import React, { useState, useEffect } from 'react'
import { Card, Input, Button, Select, Space, Typography, Alert, Spin } from 'antd'
import { BrowserProvider, parseEther, formatEther, Contract } from 'ethers'
import { useWallet } from '../../hooks/useWallet'
import { useERC20Balance } from '../../hooks/useERC20Balance'

const { Title, Text } = Typography
const { Option } = Select

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
]

const Transfer = () => {
  const { account, isAuthenticated, balance, refetchBalance } = useWallet()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('native')
  const [tokenAddress, setTokenAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { balance: tokenBalance, refetch: refetchTokenBalance } = useERC20Balance(
    selectedToken === 'erc20' ? tokenAddress : null
  )

  useEffect(() => {
    setError('')
    setSuccess('')
  }, [amount, recipient, selectedToken, tokenAddress])

  const validateInputs = () => {
    if (!isAuthenticated) {
      setError('Please connect your wallet')
      return false
    }
    if (!recipient) {
      setError('Please enter recipient address')
      return false
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      setError('Invalid recipient address')
      return false
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    if (selectedToken === 'erc20' && !tokenAddress) {
      setError('Please enter token contract address')
      return false
    }
    if (selectedToken === 'erc20' && !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
      setError('Invalid token contract address')
      return false
    }
    return true
  }

  const executeNativeTransfer = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(amount)
      })

      setSuccess('Transaction sent! Waiting for confirmation...')
      
      const receipt = await tx.wait()
      setSuccess(`Transfer successful! Tx Hash: ${receipt.hash}`)
      
      // Refresh balance
      refetchBalance()
      
      // Clear form
      setRecipient('')
      setAmount('')
      
    } catch (error) {
      console.error('Native transfer error:', error)
      setError(error.reason || error.message || 'Transfer failed')
    }
  }

  const executeTokenTransfer = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const contract = new Contract(tokenAddress, ERC20_ABI, signer)
      const decimals = await contract.decimals()
      const transferAmount = parseEther(amount) // Assuming 18 decimals, adjust as needed
      
      const tx = await contract.transfer(recipient, transferAmount)
      
      setSuccess('Transaction sent! Waiting for confirmation...')
      
      const receipt = await tx.wait()
      setSuccess(`Token transfer successful! Tx Hash: ${receipt.hash}`)
      
      // Refresh token balance
      refetchTokenBalance()
      
      // Clear form
      setRecipient('')
      setAmount('')
      
    } catch (error) {
      console.error('Token transfer error:', error)
      setError(error.reason || error.message || 'Token transfer failed')
    }
  }

  const handleTransfer = async () => {
    if (!validateInputs()) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      if (selectedToken === 'native') {
        await executeNativeTransfer()
      } else {
        await executeTokenTransfer()
      }
      
    } catch (error) {
      console.error('Transfer error:', error)
      setError('Transfer failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentBalance = () => {
    if (selectedToken === 'native') {
      return balance
    } else if (selectedToken === 'erc20') {
      return tokenBalance
    }
    return '0'
  }

  const getCurrentSymbol = () => {
    if (selectedToken === 'native') {
      return 'ETH'
    } else {
      return 'TOKEN'
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title level={3}>Connect Wallet</Title>
          <Text>Please connect your wallet to use the transfer feature</Text>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Card title="Transfer Tokens" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          <div>
            <Text strong>Token Type:</Text>
            <Select
              value={selectedToken}
              onChange={setSelectedToken}
              style={{ width: '100%', marginTop: '8px' }}
            >
              <Option value="native">Native Token (ETH)</Option>
              <Option value="erc20">ERC20 Token</Option>
            </Select>
          </div>

          {selectedToken === 'erc20' && (
            <div>
              <Text strong>Token Contract Address:</Text>
              <Input
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                style={{ marginTop: '8px' }}
              />
            </div>
          )}

          <div>
            <Text strong>Recipient Address:</Text>
            <Input
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>Amount:</Text>
              <Text type="secondary">
                Balance: {parseFloat(getCurrentBalance()).toFixed(4)} {getCurrentSymbol()}
              </Text>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ marginTop: '8px' }}
            />
          </div>

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

          <Button
            type="primary"
            size="large"
            onClick={handleTransfer}
            loading={loading}
            disabled={!recipient || !amount || loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Processing...' : 'Transfer'}
          </Button>
          
        </Space>
      </Card>
    </div>
  )
}

export default Transfer