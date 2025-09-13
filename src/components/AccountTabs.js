import React from 'react';
import { Tabs, Badge, Typography, Space, Card, Statistic, Row, Col, Button, Popconfirm } from 'antd';
import { ExperimentOutlined, DollarCircleOutlined, SafetyOutlined, WarningOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAccountMode } from '../contexts/AccountModeContext';

const { Text } = Typography;

const AccountTabs = () => {
  const { accountMode, switchAccountMode, demoBalance, resetDemoBalance } = useAccountMode();

  const handleTabChange = (key) => {
    switchAccountMode(key);
  };

  const items = [
    {
      key: 'demo',
      label: (
        <Space>
          <ExperimentOutlined style={{ color: '#52c41a' }} />
          <span>Demo Account</span>
          <Badge status="processing" />
        </Space>
      ),
      children: null,
    },
    {
      key: 'real',
      label: (
        <Space>
          <DollarCircleOutlined style={{ color: '#ff7875' }} />
          <span>Live Trading</span>
          <Badge status="error" />
        </Space>
      ),
      children: null,
    },
  ];

  return (
    <div style={{ 
      background: 'white', 
      padding: '16px 20px',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <Tabs
          activeKey={accountMode}
          onChange={handleTabChange}
          items={items}
          size="small"
          style={{ minWidth: '280px' }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {accountMode === 'real' && (
            <Space>
              <WarningOutlined style={{ color: '#ff4d4f' }} />
              <Text type="danger">Live Trading Active</Text>
              <Badge status="error" text="Real Funds" />
            </Space>
          )}
        </div>
      </div>

      {/* Demo Balance Display */}
      {accountMode === 'demo' && (
        <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SafetyOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
              <Text type="success" strong>Demo Account Balances</Text>
            </div>
            <Popconfirm
              title="Reset Demo Balance"
              description="This will reset all demo balances to default values. Are you sure?"
              onConfirm={resetDemoBalance}
              okText="Yes, Reset"
              cancelText="Cancel"
            >
              <Button 
                icon={<ReloadOutlined />} 
                size="small" 
                type="text"
                style={{ color: '#52c41a' }}
              >
                Reset
              </Button>
            </Popconfirm>
          </div>
          
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="SOL"
                value={demoBalance.SOL}
                precision={2}
                valueStyle={{ color: '#52c41a', fontSize: '14px' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="USDC"
                value={demoBalance.USDC}
                precision={2}
                valueStyle={{ color: '#52c41a', fontSize: '14px' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="USDT"
                value={demoBalance.USDT}
                precision={2}
                valueStyle={{ color: '#52c41a', fontSize: '14px' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="mSOL"
                value={demoBalance.mSOL}
                precision={2}
                valueStyle={{ color: '#52c41a', fontSize: '14px' }}
              />
            </Col>
          </Row>
          
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <Text type="success" style={{ fontSize: '12px' }}>
              💡 Virtual funds for testing - Data persists across page reloads
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AccountTabs;