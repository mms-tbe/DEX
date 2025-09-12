import { useState } from 'react'
import { BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers'
import { useAccount } from 'wagmi'

const INCH_ROUTER_ABI = [
  "function swap(address caller, tuple(address srcToken, address dstToken, address srcReceiver, address dstReceiver, uint256 amount, uint256 minReturnAmount, uint256 flags, bytes permit) desc, bytes data) payable returns (uint256 returnAmount, uint256 gasLeft)"
]

export const useInchDex = () => {
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)

  const getSupportedTokens = async (chainId) => {
    try {
      const response = await fetch(`https://api.1inch.io/v5.0/${chainId}/tokens`)
      const data = await response.json()
      return data.tokens
    } catch (error) {
      console.error("Error fetching supported tokens:", error)
      return {}
    }
  }

  const getQuote = async (fromToken, toToken, amount, chainId) => {
    try {
      const params = new URLSearchParams({
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: parseUnits(amount.toString(), 18).toString()
      })

      const response = await fetch(`https://api.1inch.io/v5.0/${chainId}/quote?${params}`)
      const data = await response.json()
      
      return {
        toTokenAmount: formatUnits(data.toTokenAmount, 18),
        estimatedGas: data.estimatedGas
      }
    } catch (error) {
      console.error("Error getting quote:", error)
      return null
    }
  }

  const getSwapData = async (fromToken, toToken, amount, slippage, chainId) => {
    try {
      const params = new URLSearchParams({
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: parseUnits(amount.toString(), 18).toString(),
        fromAddress: address,
        slippage: slippage.toString()
      })

      const response = await fetch(`https://api.1inch.io/v5.0/${chainId}/swap?${params}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error getting swap data:", error)
      return null
    }
  }

  const trySwap = async (swapParams) => {
    try {
      setLoading(true)
      
      if (!window.ethereum) throw new Error("No wallet found")
      
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const tx = await signer.sendTransaction({
        to: swapParams.tx.to,
        data: swapParams.tx.data,
        value: swapParams.tx.value,
        gasLimit: swapParams.tx.gas
      })
      
      const receipt = await tx.wait()
      return receipt
      
    } catch (error) {
      console.error("Swap error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    getSupportedTokens,
    getQuote,
    getSwapData,
    trySwap,
    isLoading: loading
  }
}