import React from 'react'
import { Provider } from '../providers/ApolloProvider'
import { AppProvider } from '../providers/AppContext'
import { WalletConnectProvider } from '../providers/WalletConnect'
import { SwitchProvider } from '../theme/switcher'

interface ProviderProps {}

const Providers: React.FC<ProviderProps> = ({ children }: any) => {
  return (
    <Provider>
      <AppProvider>
        <WalletConnectProvider>
          <SwitchProvider>{(theme: string) => children(theme)}</SwitchProvider>
        </WalletConnectProvider>
      </AppProvider>
    </Provider>
  )
}

export default Providers
