import React, { useState } from 'react';
import { useAccountMode } from '../contexts/AccountModeContext';

const TradingInterface = () => {
  const { accountMode, isDemo, demoBalance } = useAccountMode();
  const [amount, setAmount] = useState('');

  const handleTrade = () => {
    if (isDemo) {
      alert(`Demo trade executed with $${amount}`);
    } else {
      alert(`Real trade executed with $${amount} - This would use real funds!`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">
        {isDemo ? 'Demo Trading' : 'Live Trading'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Trade Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
          />
        </div>

        {isDemo && (
          <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-md">
            <p className="text-blue-300 text-sm">
              💡 You're trading with demo funds. No real money is at risk.
            </p>
          </div>
        )}

        {!isDemo && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-md">
            <p className="text-red-300 text-sm">
              ⚠️ Warning: You're using real funds for trading.
            </p>
          </div>
        )}

        <button
          onClick={handleTrade}
          disabled={!amount}
          className={`
            w-full py-3 px-4 rounded-md font-semibold transition-all duration-200
            ${isDemo 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isDemo ? 'Execute Demo Trade' : 'Execute Live Trade'}
        </button>
      </div>
    </div>
  );
};

export default TradingInterface;