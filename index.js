import { AppRegistry, YellowBox, Platform } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import codePush from 'react-native-code-push'
import { Sentry } from 'react-native-sentry'
import Config from 'react-native-config'
import analytics from '@segment/analytics-react-native'
import { useScreens } from 'react-native-screens'
import Log from './src/lib/Log'

useScreens()

Sentry.config(Config.SENTRY_DSN).install()

const defaultHandler =
  ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()

if (defaultHandler) {
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Log.error(error.stack ? error.stack : error.message, 'System')
    defaultHandler && defaultHandler(error, isFatal)
  })
}

analytics.setup(
  Platform.OS === 'ios' ? Config.SEGMENT_IOS : Config.SEGMENT_ANDROID,
  {
    // Record screen views automatically!
    recordScreenViews: true,
    // Record certain application events automatically!
    trackAppLifecycleEvents: true,
  },
)

codePush.getUpdateMetadata().then(update => {
  if (update) {
    Sentry.setVersion(update.appVersion + '-codepush:' + update.label)
  }
})

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
}
AppRegistry.registerComponent(appName, () => codePush(codePushOptions)(App))
