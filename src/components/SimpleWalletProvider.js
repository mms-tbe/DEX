import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const WalletContext = createContext(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

const SimpleWalletProvider = ({ children }) => {
    const [publicKey, setPublicKey] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);

    const connection = useMemo(() => {
        const rpcUrl = process.env.REACT_APP_SOLANA_RPC_HOST || clusterApiUrl('mainnet-beta');
        return new Connection(rpcUrl, 'confirmed');
    }, []);

    // Auto-connect on page load if previously connected
    useEffect(() => {
        const autoConnect = async () => {
            const userDisconnected = localStorage.getItem('user-disconnected') === 'true';
            if (userDisconnected) {
                console.log('User previously disconnected, skipping auto-connect.');
                return;
            }

            try {
                if (window.solana && window.solana.isPhantom) {
                    setConnecting(true);
                    // Only connect if user previously approved this app
                    const response = await window.solana.connect({ onlyIfTrusted: true });
                    if (response.publicKey) {
                        setPublicKey(response.publicKey);
                        setConnected(true);
                        console.log('Auto-connected to Phantom wallet:', response.publicKey.toString());
                    }
                }
            } catch (error) {
                // User hasn't previously approved connection or wallet is locked
                console.log('No previous wallet connection found');
            } finally {
                setConnecting(false);
            }
        };

        autoConnect();

        // Set up event listeners for wallet events
        if (window.solana) {
            const handleConnect = (publicKey) => {
                console.log('Wallet connected:', publicKey.toString());
                setPublicKey(publicKey);
                setConnected(true);
                setConnecting(false);
            };

            const handleDisconnect = () => {
                console.log('Wallet disconnected');
                setPublicKey(null);
                setConnected(false);
                setConnecting(false);
            };

            const handleAccountChanged = (publicKey) => {
                if (publicKey) {
                    console.log('Account changed:', publicKey.toString());
                    setPublicKey(publicKey);
                    setConnected(true);
                } else {
                    console.log('Account disconnected');
                    setPublicKey(null);
                    setConnected(false);
                }
                setConnecting(false);
            };

            // Add event listeners
            window.solana.on('connect', handleConnect);
            window.solana.on('disconnect', handleDisconnect);
            window.solana.on('accountChanged', handleAccountChanged);

            // Cleanup function
            return () => {
                if (window.solana) {
                    window.solana.removeListener('connect', handleConnect);
                    window.solana.removeListener('disconnect', handleDisconnect);
                    window.solana.removeListener('accountChanged', handleAccountChanged);
                }
            };
        }
    }, []);

    const connectPhantom = useCallback(async () => {
        try {
            if (window.solana && window.solana.isPhantom) {
                setConnecting(true);
                const response = await window.solana.connect();
                setPublicKey(response.publicKey);
                setConnected(true);
                localStorage.removeItem('user-disconnected');
                setConnecting(false);
                console.log('Connected to Phantom wallet:', response.publicKey.toString());
                return response.publicKey;
            } else {
                alert('Phantom wallet not found! Please install Phantom wallet.');
                window.open('https://phantom.app/', '_blank');
            }
        } catch (error) {
            console.error('Error connecting to Phantom:', error);
            setConnecting(false);
            throw error;
        }
    }, []);

    const disconnect = useCallback(async () => {
        setDisconnecting(true);
        try {
            if (window.solana) {
                await window.solana.disconnect();
            }
            setPublicKey(null);
            setConnected(false);
            localStorage.setItem('user-disconnected', 'true');
            console.log('Disconnected from wallet');
        } catch (error) {
            console.error('Error disconnecting:', error);
        } finally {
            setDisconnecting(false);
        }
    }, []);

    const sendTransaction = useCallback(async (transaction) => {
        try {
            if (!window.solana || !connected) {
                throw new Error('Wallet not connected');
            }
            const { signature } = await window.solana.signAndSendTransaction(transaction);
            console.log('Transaction sent:', signature);
            return signature;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }, [connected]);

    const value = {
        publicKey,
        connected,
        connecting,
        disconnecting,
        connect: connectPhantom,
        disconnect,
        sendTransaction,
        connection
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

export default SimpleWalletProvider;