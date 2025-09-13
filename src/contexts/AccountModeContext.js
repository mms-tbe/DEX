import React, { useState, useContext, createContext, useEffect } from 'react';

// Account Mode Context
const AccountModeContext = createContext();

export const useAccountMode = () => {
  const context = useContext(AccountModeContext);
  if (!context) {
    throw new Error('useAccountMode must be used within AccountModeProvider');
  }
  return context;
};

// Account Mode Provider
export const AccountModeProvider = ({ children }) => {
  // Load account mode from localStorage or default to 'demo'
  const [accountMode, setAccountMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('solana-dex-account-mode');
      return savedMode && ['demo', 'real'].includes(savedMode) ? savedMode : 'demo';
    } catch (error) {
      console.error('Error loading account mode from localStorage:', error);
      return 'demo';
    }
  });

  // Load demo balance from localStorage or use defaults
  const [demoBalance, setDemoBalance] = useState(() => {
    try {
      const savedBalance = localStorage.getItem('solana-dex-demo-balance');
      if (savedBalance) {
        const parsedBalance = JSON.parse(savedBalance);
        // Validate the structure
        if (parsedBalance && typeof parsedBalance === 'object') {
          return {
            SOL: parsedBalance.SOL || 100,
            USDC: parsedBalance.USDC || 10000,
            USDT: parsedBalance.USDT || 5000,
            mSOL: parsedBalance.mSOL || 50
          };
        }
      }
    } catch (error) {
      console.error('Error loading demo balance from localStorage:', error);
    }
    
    // Default balances
    return {
      SOL: 100,
      USDC: 10000,
      USDT: 5000,
      mSOL: 50
    };
  });
  
  const switchAccountMode = (mode) => {
    setAccountMode(mode);
    try {
      localStorage.setItem('solana-dex-account-mode', mode);
    } catch (error) {
      console.error('Error saving account mode to localStorage:', error);
    }
  };

  const updateDemoBalance = (token, amount) => {
    if (accountMode === 'demo') {
      setDemoBalance(prev => {
        const newBalance = {
          ...prev,
          [token]: Math.max(0, prev[token] + amount)
        };
        
        // Save to localStorage
        try {
          localStorage.setItem('solana-dex-demo-balance', JSON.stringify(newBalance));
        } catch (error) {
          console.error('Error saving demo balance to localStorage:', error);
        }
        
        return newBalance;
      });
    }
  };

  const resetDemoBalance = () => {
    const defaultBalance = {
      SOL: 100,
      USDC: 10000,
      USDT: 5000,
      mSOL: 50
    };
    setDemoBalance(defaultBalance);
    try {
      localStorage.setItem('solana-dex-demo-balance', JSON.stringify(defaultBalance));
    } catch (error) {
      console.error('Error saving demo balance to localStorage:', error);
    }
  };

  // Save demo balance to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('solana-dex-demo-balance', JSON.stringify(demoBalance));
    } catch (error) {
      console.error('Error saving demo balance to localStorage:', error);
    }
  }, [demoBalance]);

  const value = {
    accountMode,
    switchAccountMode,
    demoBalance,
    setDemoBalance,
    updateDemoBalance,
    resetDemoBalance,
    isDemo: accountMode === 'demo',
    isReal: accountMode === 'real'
  };

  return (
    <AccountModeContext.Provider value={value}>
      {children}
    </AccountModeContext.Provider>
  );
};