import React, { useState } from 'react'
import { Button, Dropdown, Menu, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useWallet } from '../hooks/useWallet'
import { chainConfig } from '../config/wagmi'

const Navbar = ({ setSelectedTab }) => {
  const { isAuthenticated, account, chainId, logout, authenticate, connectors } = useWallet()
  const [authModalVisible, setAuthModalVisible] = useState(false)

  const currentChain = chainConfig[chainId] || chainConfig[1]

  const handleConnect = async (connectorId) => {
    try {
      await authenticate(connectorId)
      setAuthModalVisible(false)
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  const walletMenu = (
    <Menu>
      <Menu.Item key="1" onClick={logout}>
        Disconnect Wallet
      </Menu.Item>
    </Menu>
  )

  const connectionMenu = (
    <Menu>
      {connectors.map((connector) => (
        <Menu.Item key={connector.id} onClick={() => handleConnect(connector.id)}>
          Connect with {connector.name}
        </Menu.Item>
      ))}
    </Menu>
  )

  const tabMenu = (
    <Menu>
      <Menu.Item key="dex" onClick={() => setSelectedTab('dex')}>
        DEX
      </Menu.Item>
      <Menu.Item key="transfer" onClick={() => setSelectedTab('transfer')}>
        Transfer
      </Menu.Item>
      <Menu.Item key="history" onClick={() => setSelectedTab('history')}>
        History
      </Menu.Item>
    </Menu>
  )

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      height: '64px',
      borderBottom: '1px solid #f0f0f0',
      background: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, marginRight: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          DEX App
        </h1>
        
        <Dropdown overlay={tabMenu} trigger={['click']}>
          <Button>
            Navigation <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isAuthenticated ? (
          <>
            <div style={{ 
              padding: '8px 12px', 
              background: '#f6f6f6', 
              borderRadius: '6px',
              fontSize: '12px'
            }}>
              Chain: {currentChain.name}
            </div>
            <Dropdown overlay={walletMenu} trigger={['click']}>
              <Button type="primary">
                <Space>
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </>
        ) : (
          <Dropdown overlay={connectionMenu} trigger={['click']}>
            <Button type="primary">
              Connect Wallet <DownOutlined />
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  )
}

export default Navbar