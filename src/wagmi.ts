import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  mainnet,
  arbitrum,
  avalanche,
  base,
  optimism,
  polygon,
  sepolia,
  type AppKitNetwork,
} from '@reown/appkit/networks'

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [
  mainnet,
  arbitrum,
  avalanche,
  base,
  optimism,
  polygon,
  ...(process.env.NODE_ENV === 'development' ? [sepolia] : []),
] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  networks,
  projectId,
})

export const config = wagmiAdapter.wagmiConfig
