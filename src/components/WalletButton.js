import React from 'react';
import { Button, Typography } from 'antd';
import { WalletOutlined, DisconnectOutlined, LoadingOutlined } from '@ant-design/icons';
import { useWallet } from './SimpleWalletProvider';

const { Text } = Typography;

const WalletButton = () => {
    const { publicKey, connected, connecting, connect, disconnect } = useWallet();

    const handleClick = () => {
        if (connected) {
            disconnect();
        } else {
            connect();
        }
    };

    const formatAddress = (address) => {
        if (!address) return '';
        const str = address.toString();
        return `${str.slice(0, 4)}...${str.slice(-4)}`;
    };

    if (connecting) {
        return (
            <Button 
                icon={<LoadingOutlined />} 
                loading
                disabled
            >
                Connecting...
            </Button>
        );
    }

    if (connected && publicKey) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                    padding: '4px 8px', 
                    background: '#f6ffed', 
                    border: '1px solid #b7eb8f',
                    borderRadius: '6px',
                    fontSize: '12px'
                }}>
                    <Text type="success" strong>
                        {formatAddress(publicKey)}
                    </Text>
                </div>
                <Button 
                    icon={<DisconnectOutlined />}
                    onClick={handleClick}
                    size="small"
                    danger
                >
                    Disconnect
                </Button>
            </div>
        );
    }

    return (
        <Button 
            type="primary"
            icon={<WalletOutlined />}
            onClick={handleClick}
        >
            Connect Phantom
        </Button>
    );
};

export default WalletButton;