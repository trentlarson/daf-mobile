import React, { useEffect } from 'react'
import Navigation from './navigators'
import NavigationService from './navigators/navigationService'
import Providers from './providers'
import WalletConnect from './components/WalletConnect'
import { Toast, OverlaySign } from '@kancha/kancha-ui'
import IDSwitcher from './navigators/components/Switcher'
import useDeepLinking from './hooks/useDeepLinking'
import './lib/I18n'

const App = () => {
  const {
    getInitialUrl,
    addListenerForDeepLinks,
    removeListenerForDeepLinks,
  } = useDeepLinking(NavigationService.navigate)

  useEffect(() => {
    getInitialUrl()
    addListenerForDeepLinks()

    return () => {
      removeListenerForDeepLinks()
    }
  }, [])

  return (
    <Providers>
      <WalletConnect navigate={NavigationService.navigate} />
      <Toast />
      <OverlaySign />
      <Navigation
        enableURLHandling={false}
        ref={navigatorRef =>
          NavigationService.setTopLevelNavigator(navigatorRef)
        }
      />
      <IDSwitcher id={'SWITCH_IDENTITY'} />
    </Providers>
  )
}

export default App
