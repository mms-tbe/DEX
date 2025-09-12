import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
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

    const connection = useMemo(() => new Connection(clusterApiUrl('devnet'), 'confirmed'), []);

    const connectPhantom = useCallback(async () => {
        try {
            if (window.solana && window.solana.isPhantom) {
                const response = await window.solana.connect();
                setPublicKey(response.publicKey);
                setConnected(true);
                return response.publicKey;
            } else {
                alert('Phantom wallet not found! Please install Phantom wallet.');
                window.open('https://phantom.app/', '_blank');
            }
        } catch (error) {
            console.error('Error connecting to Phantom:', error);
        }
    }, []);

    const disconnect = useCallback(async () => {
        try {
            if (window.solana) {
                await window.solana.disconnect();
            }
            setPublicKey(null);
            setConnected(false);
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    }, []);

    const sendTransaction = useCallback(async (transaction) => {
        try {
            if (!window.solana || !connected) {
                throw new Error('Wallet not connected');
            }
            const { signature } = await window.solana.signAndSendTransaction(transaction);
            return signature;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }, [connected]);

    const value = {
        publicKey,
        connected,
        connecting: false,
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