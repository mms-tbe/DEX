import React, { useState, useEffect } from 'react'
import { Card, Input, Button, Select, Space, Typography, Alert, Spin } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { useWallet } from '../../hooks/useWallet'
import { useInchDex } from '../../hooks/useInchDex'
import { chainConfig } from '../../config/wagmi'

const { Title, Text } = Typography
const { Option } = Select

// Common token list for demo
const COMMON_TOKENS = {
  1: [ // Ethereum
    { address: '0xA0b86a33E6417ea91aE4c6bbea50f6c21f5B9b73', symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { address: '0xA0b86a33E6417ea91aE4c6bbea50f6c21f5B9b73', symbol: 'USDT', name: 'Tether USD', decimals: 6 },
    { address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { address: '0x514910771af9ca656af840dff83e8264ecf986ca', symbol: 'LINK', name: 'Chainlink', decimals: 18 },
  ],
  137: [ // Polygon
    { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'MATIC', name: 'Polygon', decimals: 18 },
    { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', symbol: 'USDT', name: 'Tether USD', decimals: 6 },
  ]
}

const DEX = () => {
  const { account, isAuthenticated, chainId } = useWallet()
  const { getQuote, getSwapData, trySwap, isLoading } = useInchDex()
  
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [slippage, setSlippage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [quote, setQuote] = useState(null)

  const currentChain = chainConfig[chainId] || chainConfig[1]
  const availableTokens = COMMON_TOKENS[chainId] || COMMON_TOKENS[1]

  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0) {
      fetchQuote()
    } else {
      setToAmount('')
      setQuote(null)
    }
  }, [fromToken, toToken, fromAmount, chainId])

  const fetchQuote = async () => {
    try {
      setLoading(true)
      const quoteData = await getQuote(fromToken, toToken, fromAmount, chainId)
      if (quoteData) {
        setToAmount(quoteData.toTokenAmount)
        setQuote(quoteData)
      }
    } catch (error) {
      console.error('Quote error:', error)
      setError('Failed to get quote')
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!validateSwap()) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const swapData = await getSwapData(fromToken, toToken, fromAmount, slippage, chainId)
      if (!swapData) {
        setError('Failed to get swap data')
        return
      }

      const receipt = await trySwap(swapData)
      setSuccess(`Swap successful! Transaction hash: ${receipt.hash}`)
      
      // Clear form
      setFromAmount('')
      setToAmount('')
      setQuote(null)

    } catch (error) {
      console.error('Swap error:', error)
      setError(error.message || 'Swap failed')
    } finally {
      setLoading(false)
    }
  }

  const validateSwap = () => {
    if (!isAuthenticated) {
      setError('Please connect your wallet')
      return false
    }
    if (!fromToken || !toToken) {
      setError('Please select both tokens')
      return false
    }
    if (fromToken === toToken) {
      setError('Cannot swap same token')
      return false
    }
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    return true
  }

  const swapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title level={3}>Connect Wallet</Title>
          <Text>Please connect your wallet to use the DEX</Text>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Card title={`DEX - ${currentChain.name}`} style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
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
                {availableTokens.map(token => (
                  <Option key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </Option>
                ))}
              </Select>
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
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
                {availableTokens.map(token => (
                  <Option key={token.address} value={token.address}>
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
          {quote && !loading && (
            <Card size="small" style={{ background: '#f9f9f9' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Estimated Gas: {quote.estimatedGas}
              </Text>
            </Card>
          )}

          {/* Error/Success Messages */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
            />
          )}

          {success && (
            <Alert
              message={success}
              type="success"
              showIcon
            />
          )}

          {/* Loading */}
          {(loading || isLoading) && (
            <div style={{ textAlign: 'center' }}>
              <Spin size="small" />
              <Text style={{ marginLeft: '8px' }}>
                {isLoading ? 'Processing swap...' : 'Getting quote...'}
              </Text>
            </div>
          )}

          {/* Swap Button */}
          <Button
            type="primary"
            size="large"
            onClick={handleSwap}
            loading={loading || isLoading}
            disabled={!fromToken || !toToken || !fromAmount || !toAmount || loading}
            style={{ width: '100%' }}
          >
            {(loading || isLoading) ? 'Processing...' : 'Swap'}
          </Button>
          
        </Space>
      </Card>
    </div>
  )
}

export default DEX