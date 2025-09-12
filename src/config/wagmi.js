import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, bsc } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, bsc],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: '573a087d615681f9c9c1f8e77c86b877' })
  ],
  transports: {
    [mainnet.id]: http('https://ethereum.publicnode.com'),
    [polygon.id]: http('https://polygon.publicnode.com'),
    [arbitrum.id]: http('https://arbitrum.publicnode.com'),
    [bsc.id]: http('https://bsc-dataseed.binance.org/')
  },
})

export const chainConfig = {
  1: {
    name: "Ethereum",
    currency: "ETH",
    rpc: "https://ethereum.publicnode.com",
    explorer: "https://etherscan.io/"
  },
  137: {
    name: "Polygon",
    currency: "MATIC",
    rpc: "https://polygon.publicnode.com",
    explorer: "https://polygonscan.com/"
  },
  42161: {
    name: "Arbitrum",
    currency: "ETH",
    rpc: "https://arbitrum.publicnode.com",
    explorer: "https://arbiscan.io/"
  },
  56: {
    name: "BSC",
    currency: "BNB",
    rpc: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com/"
  }
}