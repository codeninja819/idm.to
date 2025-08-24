'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'

import { config, networks, projectId, wagmiAdapter } from '@/wagmi'
import { createAppKit } from '@reown/appkit/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId as string,
  networks,
  metadata: {
    name: 'IDM.TO',
    description: 'Send idm on any chain',
    url: 'https://idm.to',
    icons: ['https://idm.to/favicon.ico'],
  },
  enableEIP6963: true,
  enableCoinbase: true,
})

export function Providers(props: {
  children: ReactNode
  initialState?: State
}) {
  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{props.children}</ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
