import { useAccount, useBalance, useDisconnect, useConnect } from 'wagmi'
import { formatEther } from 'ethers'

export const useWallet = () => {
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()
  
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address,
  })

  const authenticate = async (connectorId) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
    }
  }

  const logout = () => {
    disconnect()
  }

  const getBalance = () => {
    if (!balance) return "0"
    return formatEther(balance.value)
  }

  return {
    account: address,
    isAuthenticated: isConnected,
    chainId,
    authenticate,
    logout,
    balance: getBalance(),
    refetchBalance,
    connectors
  }
}