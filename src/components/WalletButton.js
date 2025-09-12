import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useWallet } from './SimpleWalletProvider';

const WalletButton = () => {
  const { publicKey, connected, connect, disconnect } = useWallet();

  const handleConnect = () => {
    connect();
  };

  const walletMenu = {
    items: [
      {
        key: '1',
        label: 'Disconnect',
        onClick: disconnect
      }
    ]
  };

  if (connected && publicKey) {
    return (
      <Dropdown menu={walletMenu} trigger={['click']}>
        <Button type="primary">
          <Space>
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    );
  }

  return (
    <Button type="primary" onClick={handleConnect}>
      Connect Phantom Wallet
    </Button>
  );
};

export default WalletButton;