import React, { useState, useEffect } from 'react'
import { Card, Table, Typography, Alert, Button, Space, Tag } from 'antd'
import { BrowserProvider, formatEther } from 'ethers'
import { useWallet } from '../../hooks/useWallet'
import { chainConfig } from '../../config/wagmi'

const { Title, Text } = Typography

const History = () => {
  const { account, isAuthenticated, chainId } = useWallet()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentChain = chainConfig[chainId] || chainConfig[1]

  useEffect(() => {
    if (isAuthenticated && account) {
      fetchTransactionHistory()
    }
  }, [account, isAuthenticated, chainId])

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true)
      setError('')
      
      // For demo purposes, we'll show some mock data
      // In a real app, you'd fetch from a blockchain explorer API or indexing service
      
      const mockTransactions = [
        {
          key: '1',
          hash: '0x1234567890abcdef...',
          type: 'Transfer',
          from: account,
          to: '0xabcdef1234567890...',
          value: '0.5',
          token: 'ETH',
          timestamp: new Date(Date.now() - 3600000).toLocaleString(),
          status: 'Success'
        },
        {
          key: '2',
          hash: '0xfedcba0987654321...',
          type: 'Swap',
          from: account,
          to: 'DEX Contract',
          value: '100',
          token: 'USDT → ETH',
          timestamp: new Date(Date.now() - 7200000).toLocaleString(),
          status: 'Success'
        },
        {
          key: '3',
          hash: '0x1111222233334444...',
          type: 'Transfer',
          from: '0x5555666677778888...',
          to: account,
          value: '0.1',
          token: 'ETH',
          timestamp: new Date(Date.now() - 10800000).toLocaleString(),
          status: 'Success'
        }
      ]

      setTransactions(mockTransactions)

    } catch (error) {
      console.error('Error fetching transaction history:', error)
      setError('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'green'
      case 'Failed': return 'red'
      case 'Pending': return 'orange'
      default: return 'default'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Transfer': return 'blue'
      case 'Swap': return 'purple'
      case 'Approve': return 'cyan'
      default: return 'default'
    }
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color={getTypeColor(type)}>{type}</Tag>
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      render: (hash) => (
        <a 
          href={`${currentChain.explorer}tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {hash.slice(0, 10)}...{hash.slice(-8)}
        </a>
      )
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      render: (address) => (
        <Text code>
          {address.slice(0, 6)}...{address.slice(-4)}
        </Text>
      )
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      render: (address) => (
        <Text code>
          {address.slice(0, 6)}...{address.slice(-4)}
        </Text>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => `${value} ${record.token}`
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => <Text type="secondary">{timestamp}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    }
  ]

  if (!isAuthenticated) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title level={3}>Connect Wallet</Title>
          <Text>Please connect your wallet to view transaction history</Text>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Card 
        title={`Transaction History - ${currentChain.name}`}
        extra={
          <Button onClick={fetchTransactionHistory} loading={loading}>
            Refresh
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
            <Text strong>Account: </Text>
            <Text code>{account}</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              action={
                <Button size="small" onClick={fetchTransactionHistory}>
                  Retry
                </Button>
              }
            />
          )}

          {transactions.length === 0 && !loading && !error && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="secondary">No transactions found</Text>
            </div>
          )}

          <Table
            columns={columns}
            dataSource={transactions}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} transactions`
            }}
            scroll={{ x: 800 }}
          />

        </Space>
      </Card>
    </div>
  )
}

export default History