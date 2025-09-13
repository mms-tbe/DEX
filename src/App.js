import React from 'react';
import { Layout } from 'antd';
import SimpleWalletProvider from './components/SimpleWalletProvider';
import SimpleSolanaDEX from './components/SimpleSolanaDEX';
import { AccountModeProvider } from './contexts/AccountModeContext';
import AccountTabs from './components/AccountTabs';
import 'antd/dist/reset.css';
import Footer from './components/footer';

const { Header, Content } = Layout;

function App() {
  return (
    <SimpleWalletProvider>
      <AccountModeProvider>
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
          <Header style={{ 
            background: '#001529', 
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
              Solana DEX
            </h1>
          </Header>
          
          {/* Account Mode Tabs */}
          <AccountTabs />
          
          <Content style={{ padding: '24px' }}>
            <SimpleSolanaDEX />
          </Content>
        </Layout>
      </AccountModeProvider>
    </SimpleWalletProvider>
  );
}

export default App;
