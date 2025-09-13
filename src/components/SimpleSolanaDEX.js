import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from './SimpleWalletProvider';
import { useAccountMode } from '../contexts/AccountModeContext';
import WalletButton from './WalletButton';
import { Card, Input, Button, Select, Space, Typography, Alert, message, Spin, Modal } from 'antd';
import { SwapOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PublicKey } from '@solana/web3.js';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// Popular Solana tokens
const SOLANA_TOKENS = [
  { 
    mint: 'So11111111111111111111111111111111111111112', 
    symbol: 'SOL', 
    name: 'Solana',
    decimals: 9
  },
  { 
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 
    symbol: 'USDC', 
    name: 'USD Coin',
    decimals: 6
  },
  { 
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', 
    symbol: 'USDT', 
    name: 'Tether USD',
    decimals: 6
  },
  {
    mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    symbol: 'mSOL',
    name: 'Marinade Staked SOL',
    decimals: 9
  }
];

const SimpleSolanaDEX = () => {
  const { publicKey, connected, sendTransaction, connection } = useWallet();
  const { accountMode, isDemo, isReal, demoBalance, updateDemoBalance } = useAccountMode();
  
  const [fromToken, setFromToken] = useState('So11111111111111111111111111111111111111112'); // SOL
  const [toToken, setToToken] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [error, setError] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [quoteData, setQuoteData] = useState(null);
  const [realBalances, setRealBalances] = useState({});
  const [balancesLoading, setBalancesLoading] = useState(false);

  const fetchRealBalances = useCallback(async () => {
    if (!connected || !publicKey || !connection || !isReal) {
      setRealBalances({});
      return;
    }

    setBalancesLoading(true);
    try {
      const balances = {};
      const publicKeyObj = new PublicKey(publicKey);

      await Promise.all(SOLANA_TOKENS.map(async (token) => {
        try {
          if (token.symbol === 'SOL') {
            const solBalance = await connection.getBalance(publicKeyObj);
            balances[token.symbol] = solBalance / Math.pow(10, token.decimals);
          } else {
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKeyObj, {
              mint: new PublicKey(token.mint)
            });

            if (tokenAccounts.value.length > 0) {
              const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
              balances[token.symbol] = accountInfo.tokenAmount.uiAmount || 0;
            } else {
              balances[token.symbol] = 0;
            }
          }
        } catch (e) {
          console.error(`Failed to fetch balance for ${token.symbol}`, e);
          balances[token.symbol] = 0;
        }
      }));

      setRealBalances(balances);
    } catch (error) {
      console.error('Failed to fetch real balances:', error);
      setError('Could not load wallet balances.');
      setRealBalances({});
    } finally {
      setBalancesLoading(false);
    }
  }, [connected, publicKey, connection, isReal]);

  useEffect(() => {
    if (isReal) {
      fetchRealBalances();
    }
  }, [isReal, fetchRealBalances]);

  // Get Jupiter quote
  const getJupiterQuote = useCallback(async (inputMint, outputMint, amount, slippageBps = 100) => {
    if (!amount || parseFloat(amount) <= 0) return null;
    
    try {
      setQuoteLoading(true);
      
      const inputToken = SOLANA_TOKENS.find(t => t.mint === inputMint);
      if (!inputToken) return null;
      
      // Convert amount to lamports/smallest unit
      const amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, inputToken.decimals));
      
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInSmallestUnit}&slippageBps=${slippageBps}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get quote');
      }
      
      const quote = await response.json();
      
      if (quote.error) {
        throw new Error(quote.error);
      }
      
      // Convert output amount back to readable format
      const outputToken = SOLANA_TOKENS.find(t => t.mint === outputMint);
      if (outputToken) {
        const readableAmount = parseFloat(quote.outAmount) / Math.pow(10, outputToken.decimals);
        setToAmount(readableAmount.toFixed(6));
        setQuoteData(quote);
      }
      
      return quote;
    } catch (error) {
      console.error('Jupiter quote error:', error);
      setError('Failed to get quote: ' + error.message);
      return null;
    } finally {
      setQuoteLoading(false);
    }
  }, [connection]);

  // Handle amount change with debounced quote fetching
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (fromAmount && fromToken && toToken && fromToken !== toToken) {
        getJupiterQuote(fromToken, toToken, fromAmount, slippage * 100);
      } else {
        setToAmount('');
        setQuoteData(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fromAmount, fromToken, toToken, slippage, getJupiterQuote]);

  const handleAmountChange = (value) => {
    setFromAmount(value);
    setError('');
    
    const fromSymbol = getTokenSymbol(fromToken);
    if (isDemo && value) {
      const userBalance = demoBalance[fromSymbol] || 0;
      if (parseFloat(value) > userBalance) {
        setError(`Insufficient ${fromSymbol} balance. You have ${userBalance} ${fromSymbol}`);
      }
    } else if (isReal && value && connected) {
      const userBalance = realBalances[fromSymbol] || 0;
      if (parseFloat(value) > userBalance) {
        setError(`Insufficient ${fromSymbol} balance. You have ${userBalance.toFixed(6)} ${fromSymbol}`);
      }
    }
  };

  const swapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    setQuoteData(null);
  };

  const handleSwap = async () => {
    if (!connected) {
      setError('Please connect your wallet');
      return;
    }
    
    if (!quoteData) {
      setError('No quote available. Please try again.');
      return;
    }

    const fromSymbol = getTokenSymbol(fromToken);
    const toSymbol = getTokenSymbol(toToken);
    const fromAmountNum = parseFloat(fromAmount);
    const toAmountNum = parseFloat(toAmount);

    // Check balance
    if (isDemo) {
      const userBalance = demoBalance[fromSymbol] || 0;
      if (fromAmountNum > userBalance) {
        setError(`Insufficient ${fromSymbol} balance`);
        return;
      }
    } else if (isReal && connected) {
        const userBalance = realBalances[fromSymbol] || 0;
        if (fromAmountNum > userBalance) {
            setError(`Insufficient ${fromSymbol} balance`);
            return;
        }
    }

    // Show confirmation for real trades
    if (isReal) {
      confirm({
        title: 'Confirm Live Trade',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <Alert
              message="⚠️ WARNING: This will use real SOL from your wallet!"
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <p>
              Swap {fromAmount} {fromSymbol} for approximately {toAmount} {toSymbol}
            </p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              This action cannot be undone. Make sure you want to proceed with real funds.
            </p>
          </div>
        ),
        onOk() {
          executeSwap();
        },
        okText: 'Confirm Real Trade',
        cancelText: 'Cancel',
        okButtonProps: { danger: true }
      });
    } else {
      executeSwap();
    }
  };

  const executeSwap = async () => {
    try {
      setLoading(true);
      setError('');

      const fromSymbol = getTokenSymbol(fromToken);
      const toSymbol = getTokenSymbol(toToken);
      const fromAmountNum = parseFloat(fromAmount);
      const toAmountNum = parseFloat(toAmount);

      if (isDemo) {
        // Demo swap - update balances
        updateDemoBalance(fromSymbol, -fromAmountNum);
        updateDemoBalance(toSymbol, toAmountNum);
        
        message.success(
          `✅ Demo swap successful! Traded ${fromAmount} ${fromSymbol} for ${toAmount} ${toSymbol}`,
          5
        );
      } else {
        // Real swap would happen here with Jupiter API
        message.success(
          `🚀 Real swap would execute: ${fromAmount} ${fromSymbol} → ${toAmount} ${toSymbol}`,
          5
        );
      }
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      setQuoteData(null);
      
    } catch (err) {
      console.error('Swap error:', err);
      setError('Swap failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTokenSymbol = (mint) => {
    const token = SOLANA_TOKENS.find(t => t.mint === mint);
    return token ? token.symbol : 'Unknown';
  };

  const getUserBalance = (tokenMint) => {
    if (!isDemo) return null;
    const symbol = getTokenSymbol(tokenMint);
    return demoBalance[symbol] || 0;
  };

  const getDisplayBalanceForSymbol = (symbol) => {
    const balance = isDemo ? (demoBalance[symbol] || 0) : (realBalances[symbol] || 0);
    if (balance > 0 && balance < 0.01) {
      return balance.toFixed(6);
    }
    return balance.toFixed(2);
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '20px' }}>
      {/* Account Mode Alert */}
      {isDemo && (
        <Alert
          message="Demo Mode Active"
          description="You're trading with virtual funds. No real SOL will be used. Perfect for testing!"
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}
      
      {isReal && (
        <Alert
          message="⚠️ LIVE TRADING MODE"
          description="You are using REAL SOL for trading. Trades will affect your actual wallet balance!"
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      <Card 
        title={`Solana DEX ${isDemo ? '(Demo Mode)' : '(Live Trading)'}`}
        extra={<WalletButton />}
        style={{ marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          {!connected && (
            <Alert
              message="Connect your Phantom wallet to start trading"
              type="info"
              showIcon
            />
          )}

          {/* From Token */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>From:</Text>
              {(isDemo || (isReal && connected)) && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Balance: {balancesLoading ? <Spin size="small" /> : getDisplayBalanceForSymbol(getTokenSymbol(fromToken))} {getTokenSymbol(fromToken)}
                </Text>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Select
                placeholder="Select token"
                value={fromToken}
                onChange={setFromToken}
                style={{ flex: 1 }}
              >
                {SOLANA_TOKENS.map(token => (
                  <Option key={token.mint} value={token.mint}>
                    {token.symbol} - {token.name}
                    {(isDemo || (isReal && connected)) && ` (${getDisplayBalanceForSymbol(token.symbol)})`}
                  </Option>
                ))}
              </Select>
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                style={{ width: '150px' }}
              />
            </div>
          </div>

          {/* Swap Button */}
          <div style={{ textAlign: 'center' }}>
            <Button 
              icon={<SwapOutlined />} 
              shape="circle" 
              onClick={swapTokens}
              style={{ transform: 'rotate(90deg)' }}
            />
          </div>

          {/* To Token */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>To (estimated):</Text>
              {quoteLoading && <Spin size="small" />}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Select
                placeholder="Select token"
                value={toToken}
                onChange={setToToken}
                style={{ flex: 1 }}
              >
                {SOLANA_TOKENS.map(token => (
                  <Option key={token.mint} value={token.mint}>
                    {token.symbol} - {token.name}
                    {(isDemo || (isReal && connected)) && ` (${getDisplayBalanceForSymbol(token.symbol)})`}
                  </Option>
                ))}
              </Select>
              <Input
                value={toAmount}
                placeholder="0.0"
                readOnly
                style={{ width: '150px', background: '#f5f5f5' }}
              />
            </div>
          </div>

          {/* Slippage */}
          <div>
            <Text strong>Slippage Tolerance:</Text>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Button 
                size="small" 
                onClick={() => setSlippage(0.5)}
                type={slippage === 0.5 ? 'primary' : 'default'}
              >
                0.5%
              </Button>
              <Button 
                size="small" 
                onClick={() => setSlippage(1)}
                type={slippage === 1 ? 'primary' : 'default'}
              >
                1%
              </Button>
              <Button 
                size="small" 
                onClick={() => setSlippage(3)}
                type={slippage === 3 ? 'primary' : 'default'}
              >
                3%
              </Button>
              <Input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value) || 1)}
                style={{ width: '80px' }}
                suffix="%"
              />
            </div>
          </div>

          {/* Quote Info */}
          {quoteData && !quoteLoading && (
            <Card size="small" style={{ background: '#f9f9f9' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Price Impact: ~{((1 - parseFloat(toAmount) / parseFloat(fromAmount)) * 100).toFixed(2)}%
              </Text>
            </Card>
          )}

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
            />
          )}

          <Button
            type="primary"
            size="large"
            onClick={handleSwap}
            loading={loading}
            disabled={!connected || !fromToken || !toToken || !fromAmount || !quoteData || loading}
            style={{ 
              width: '100%',
              background: isReal ? '#ff4d4f' : undefined,
              borderColor: isReal ? '#ff4d4f' : undefined
            }}
          >
            {loading 
              ? 'Processing Swap...' 
              : isDemo 
                ? 'Execute Demo Swap'
                : '⚠️ Execute LIVE Swap'
            }
          </Button>

          <div style={{ 
            background: isDemo ? '#f6ffed' : '#fff2f0', 
            padding: '10px', 
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666',
            border: isDemo ? '1px solid #b7eb8f' : '1px solid #ffccc7'
          }}>
            <Text type="secondary">
              {isDemo 
                ? '🧪 Demo Mode: Virtual trading with fake funds'
                : '🔴 Live Mode: Real Jupiter quotes • Real wallet transactions'
              }
            </Text>
          </div>
          
        </Space>
      </Card>
    </div>
  );
};

export default SimpleSolanaDEX;