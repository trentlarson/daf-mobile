import { Linking, Alert } from 'react-native'

const useDeepLinking = (navigation: any) => {
  const getInitialUrl = async () => {
    const url = await Linking.getInitialURL()
    if (url) {
      handleDeepLink(null, url)
    }
  }

  const handleDeepLink = (e: any, url?: string) => {
    const linkUrl = e ? e.url : url

    if (linkUrl.startsWith('dafmobile://hello')) {
      Alert.alert('Deeplink', 'Hello!')
    } else if ('dafmobile://heythere') {
      // Do something with navigation.
      // navigation.navigate('Screen', {})
      Alert.alert('Deeplink', 'Hey!')
    }
  }

  const addListenerForDeepLinks = async () => {
    Linking.addEventListener('url', handleDeepLink)
  }

  const removeListenerForDeepLinks = async () => {
    Linking.removeEventListener('url', handleDeepLink)
  }

  return {
    getInitialUrl,
    addListenerForDeepLinks,
    removeListenerForDeepLinks,
  }
}

export default useDeepLinking
