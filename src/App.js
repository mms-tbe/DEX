import React from 'react';
import { Layout } from 'antd';
import SimpleWalletProvider from './components/SimpleWalletProvider';
import SimpleSolanaDEX from './components/SimpleSolanaDEX';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;

function App() {
  return (
    <SimpleWalletProvider>
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
        <Content style={{ padding: '24px' }}>
          <SimpleSolanaDEX />
        </Content>
      </Layout>
    </SimpleWalletProvider>
  );
}

export default App;