import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Contract, BrowserProvider, formatUnits } from 'ethers'

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
]

export const useERC20Balance = (tokenAddress) => {
  const { address, isConnected } = useAccount()
  const [balance, setBalance] = useState("0")
  const [loading, setLoading] = useState(false)
  const [tokenInfo, setTokenInfo] = useState(null)

  const fetchBalance = async () => {
    if (!address || !tokenAddress || !isConnected) {
      setBalance("0")
      return
    }

    try {
      setLoading(true)
      
      // Get provider from window.ethereum
      if (!window.ethereum) throw new Error("No wallet found")
      
      const provider = new BrowserProvider(window.ethereum)
      const contract = new Contract(tokenAddress, ERC20_ABI, provider)
      
      const [balanceRaw, decimals, symbol, name] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals(),
        contract.symbol(),
        contract.name()
      ])
      
      const formattedBalance = formatUnits(balanceRaw, decimals)
      setBalance(formattedBalance)
      setTokenInfo({ decimals, symbol, name })
      
    } catch (error) {
      console.error("Error fetching ERC20 balance:", error)
      setBalance("0")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [address, tokenAddress, isConnected])

  return {
    balance,
    loading,
    refetch: fetchBalance,
    tokenInfo
  }
}