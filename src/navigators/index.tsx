import React from 'react'
import i18n from '../lib/I18n'
import { Image } from 'react-native'
import {
  createAppContainer,
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  createSwitchNavigator,
} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Icon, Container, Text } from '@kancha/kancha-ui'
import TabAvatar from './components/TabAvatar'
import { Colors, Icons } from '../theme'
import { Screens } from './screens'

// Main Screens
import Activity from '../screens/main/Activity'
import Explore from '../screens/main/Explore'
import ViewerProfile from '../screens/main/ViewerProfile'
import Profile from '../screens/main/Profile'
import Onboarding from '../screens/main/Onboarding'
import Restore from '../screens/main/Restore'
import Intro from '../screens/main/Intro'

import Scanner from '../screens/main/Scanner'
import MessageProcess from '../screens/main/MessageProcess'
import Requests from '../screens/main/Requests/Requests'
import Credential from '../screens/main/Credential'
import CredentialView from '../screens/main/CredentialView'
import CreatingWallet from '../screens/main/CreateIdentity'
import CreateFirstCredential from '../screens/main/CreateFirstCredential'
import IssueCredentialScreen from '../screens/main/IssueCredential'

// Settings
import Settings from '../screens/settings/Settings'

const headerLogo = () => (
  <Image
    source={require('../assets/images/daf-black-icon.png')}
    style={{ height: 41 }}
    resizeMode={'contain'}
  />
)

const defaultNavigationOptions = {
  defaultNavigationOptions: {
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerBackTitleVisible: false,
  },
}

const SettingsNavigator = createStackNavigator(
  {
    [Screens.Settings.screen]: {
      screen: Settings,
      navigationOptions: {
        title: i18n.t('Settings'),
      },
    },
  },
  {
    ...defaultNavigationOptions,
  },
)

const ProfileNavigator = createStackNavigator({
  [Screens.ViewerProfile.screen]: {
    screen: ViewerProfile,
    navigationOptions: {
      title: i18n.t('My Profile'),
    },
  },
})

const ActivityNavigator = createStackNavigator(
  {
    [Screens.Activity.screen]: {
      screen: Activity,
      navigationOptions: {
        title: i18n.t('Activity'),
      },
    },
    [Screens.Profile.screen]: {
      screen: Profile,
    },
  },
  {
    initialRouteName: 'Activity',
    ...defaultNavigationOptions,
  },
)

const ExploreNavigator = createStackNavigator(
  {
    [Screens.Explore.screen]: Explore,
  },
  {
    ...defaultNavigationOptions,
  },
)

const ScannerNavigator = createStackNavigator(
  {
    [Screens.Scanner.screen]: Scanner,
    [Screens.MessageProcess.screen]: MessageProcess,
  },
  {
    headerMode: 'none',
  },
)

const IssueCredential = createStackNavigator({
  IssueCredentialScreen,
})

const IssueFirstCredential = createStackNavigator({
  CreateFirstCredential,
})

/**
 * Main TabNavigator
 */
const TabNavigator = createBottomTabNavigator(
  {
    [Screens.Activity.screen]: {
      screen: ActivityNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Icon icon={Icons.HEART} color={tintColor} />
        },
      },
    },
    [Screens.Explore.screen]: {
      screen: ExploreNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Icon icon={Icons.SEARCH} color={tintColor} />
        },
      },
    },
    Scan: {
      screen: () => null,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarOnPress: () => navigation.navigate('Scanner'),
        tabBarIcon: ({ tintColor }) => {
          return <Icon icon={Icons.SCAN} color={Colors.BRAND} />
        },
      }),
    },
    [Screens.Settings.screen]: {
      screen: SettingsNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Icon icon={Icons.SETTINGS} color={tintColor} />
        },
      },
    },
    [Screens.ViewerProfile.screen]: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <TabAvatar />
        },
      },
    },
  },
  {
    initialRouteName: 'Activity',
    backBehavior: 'initialRoute',
    tabBarOptions: {
      showLabel: false,
      activeTintColor: {
        light: Colors.DARK_GREY,
        dark: Colors.BRAND,
      },
    },
  },
)

const CredentialDetail = createStackNavigator({
  Credential: {
    screen: Credential,
    navigationOptions: {
      headerStyle: { borderBottomWidth: 0, backgroundColor: '#000000' },
    },
  },
  SettingsDetail: Settings,
})

const DeepLinkModal = createStackNavigator({
  DeepLinkModal: {
    screen: () => (
      <Container>
        <Text>Hello Modal</Text>
      </Container>
    ),
    navigationOptions: {
      headerStyle: { borderBottomWidth: 0, backgroundColor: '#000000' },
    },
  },
})

const App = createStackNavigator(
  {
    Tabs: TabNavigator,
    Requests: Requests,
    Scanner: ScannerNavigator,
    IssueFirstCredential,
    IssueCredential,
    CredentialDetail,
    CredentialView,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
)

const Onboard = createStackNavigator(
  {
    Intro: {
      screen: Intro,
    },
    Onboarding: {
      screen: Onboarding,
    },
    Restore: {
      screen: Restore,
    },
    CreatingWallet: {
      screen: CreatingWallet,
    },
  },
  {
    defaultNavigationOptions: {
      headerTitle: headerLogo,
      headerBackTitleVisible: false,
      headerStyle: {
        borderBottomWidth: 0,
      },
    },
    initialRouteName: 'Intro',
  },
)

const RootNavigator = createSwitchNavigator(
  {
    App: {
      screen: App,
      path: '',
    },
    Onboard,
  },
  { initialRouteName: 'Onboard' },
)

export interface NavigationScreen {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default createAppContainer(RootNavigator)
