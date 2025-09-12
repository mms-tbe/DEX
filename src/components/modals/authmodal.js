import React, { useState } from 'react'
import { Modal, Button, Space, Typography, Alert } from 'antd'
import { useWallet } from '../../hooks/useWallet'

const { Title, Text } = Typography

const AuthModal = ({ visible, onCancel }) => {
  const { authenticate, connectors } = useWallet()
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async (connectorId) => {
    try {
      setConnecting(true)
      setError('')
      await authenticate(connectorId)
      onCancel() // Close modal on successful connection
    } catch (error) {
      console.error('Connection failed:', error)
      setError(error.message || 'Failed to connect wallet')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Modal
      title="Connect Wallet"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>Choose your wallet</Title>
          <Text type="secondary">
            Connect with one of our available wallet providers
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
          />
        )}

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              size="large"
              style={{ 
                width: '100%',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '20px'
              }}
              onClick={() => handleConnect(connector.id)}
              loading={connecting}
              disabled={connecting}
            >
              <Space>
                <span style={{ fontSize: '16px' }}>
                  {getConnectorIcon(connector.id)}
                </span>
                <span>{connector.name}</span>
              </Space>
            </Button>
          ))}
        </Space>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </Text>
        </div>

      </Space>
    </Modal>
  )
}

const getConnectorIcon = (connectorId) => {
  switch (connectorId) {
    case 'metaMask':
      return '🦊'
    case 'walletConnect':
      return '🔗'
    case 'injected':
      return '💳'
    default:
      return '💰'
  }
}

export default AuthModal