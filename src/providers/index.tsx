import React from 'react'
import { ApolloProvider } from '../providers/ApolloProvider'
import { AppProvider } from '../providers/AppContext'
import { WalletConnectProvider } from '../providers/WalletConnect'
import { SwitchProvider } from '../theme/switcher'

interface ProviderProps {}

const Providers: React.FC<ProviderProps> = ({ children }: any) => {
  return (
    <ApolloProvider>
      <AppProvider>
        <WalletConnectProvider>
          <SwitchProvider>{(theme: string) => children(theme)}</SwitchProvider>
        </WalletConnectProvider>
      </AppProvider>
    </ApolloProvider>
  )
}

export default Providers
