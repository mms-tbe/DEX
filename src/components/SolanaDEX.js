import React, { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, Input, Button, Select, Space, Typography, Alert, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock token list for Solana devnet
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
  }
];

const SolanaDEX = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock quote function (in real app, integrate with Jupiter or Raydium)
  const getQuote = useCallback(async (from, to, amount) => {
    if (!from || !to || !amount || parseFloat(amount) <= 0) return;
    
    // Mock exchange rate calculation
    const mockRate = Math.random() * 0.1 + 0.95; // Random rate between 0.95-1.05
    const estimatedAmount = (parseFloat(amount) * mockRate).toFixed(6);
    setToAmount(estimatedAmount);
  }, []);

  const handleAmountChange = (value) => {
    setFromAmount(value);
    getQuote(fromToken, toToken, value);
  };

  const swapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!publicKey) {
      setError('Please connect your wallet');
      return;
    }
    
    if (!fromToken || !toToken || !fromAmount) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // For demo purposes, we'll just show a success message
      // In a real app, you'd integrate with DEX protocols like Jupiter
      message.success(`Mock swap: ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`);
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      
    } catch (err) {
      console.error('Swap error:', err);
      setError('Swap failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTokenSymbol = (mint) => {
    const token = SOLANA_TOKENS.find(t => t.mint === mint);
    return token ? token.symbol : '';
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <Card 
        title="Solana DEX" 
        extra={<WalletMultiButton />}
        style={{ marginBottom: '20px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          {!publicKey && (
            <Alert
              message="Connect your Solana wallet to start trading"
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
            <Text strong>To (estimated):</Text>
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
            disabled={!publicKey || !fromToken || !toToken || !fromAmount || loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Processing...' : 'Swap Tokens'}
          </Button>

          <div style={{ 
            background: '#f9f9f9', 
            padding: '10px', 
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666'
          }}>
            <Text type="secondary">
              Note: This is a demo interface. In production, integrate with Jupiter Aggregator or Raydium for actual swaps.
            </Text>
          </div>
          
        </Space>
      </Card>
    </div>
  );
};

export default SolanaDEX;