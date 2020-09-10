import React from 'react'
import { AppProvider } from '../providers/AppContext'
import { WalletConnectProvider } from '../providers/WalletConnect'
import { SwitchProvider } from '../theme/switcher'

interface ProviderProps {}

const Providers: React.FC<ProviderProps> = ({ children }: any) => {
  return (
    <AppProvider>
      <WalletConnectProvider>
        <SwitchProvider>{(theme: string) => children(theme)}</SwitchProvider>
      </WalletConnectProvider>
    </AppProvider>
  )
}

export default Providers
