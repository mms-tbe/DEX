import React, { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from './SimpleWalletProvider';
import WalletButton from './WalletButton';
import { Card, Input, Button, Select, Space, Typography, Alert, message, Spin } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

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
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();
  
  const [fromToken, setFromToken] = useState('So11111111111111111111111111111111111111112'); // SOL
  const [toToken, setToToken] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [error, setError] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [quoteData, setQuoteData] = useState(null);

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
  }, []);

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

    try {
      setLoading(true);
      setError('');

      // For demo - in production you'd get the actual swap transaction from Jupiter
      message.success(`Demo: Would swap ${fromAmount} ${getTokenSymbol(fromToken)} for ${toAmount} ${getTokenSymbol(toToken)}`);
      
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

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <Card 
        title="Solana DEX (Jupiter Quotes)" 
        extra={<WalletButton />}
        style={{ marginBottom: '20px' }}
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
            <Text strong>From:</Text>
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
            style={{ width: '100%' }}
          >
            {loading ? 'Processing Swap...' : 'Swap Tokens (Demo)'}
          </Button>

          <div style={{ 
            background: '#f9f9f9', 
            padding: '10px', 
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666'
          }}>
            <Text type="secondary">
              Real Jupiter quotes • Demo swaps (install Phantom wallet to connect)
            </Text>
          </div>
          
        </Space>
      </Card>
    </div>
  );
};

export default SimpleSolanaDEX;