import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Minimal config with just Ethereum mainnet and injected connector
export const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http('https://ethereum.publicnode.com')
  },
})

export const chainConfig = {
  1: {
    name: "Ethereum",
    currency: "ETH",
    rpc: "https://ethereum.publicnode.com",
    explorer: "https://etherscan.io/"
  }
}