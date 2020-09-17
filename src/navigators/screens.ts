const OnboardingScreens = {
  Restore: { screen: 'Restore', title: 'Restore' },
  Intro: { screen: 'Intro', title: 'Intro' },
  CreatingWallet: { screen: 'CreatingWallet', title: 'Creating Wallet' },
  Onboarding: { screen: 'Onboarding', title: 'Onboarding' },
}

const MainScreens = {
  Activity: { screen: 'Activity', title: 'Activity' },
  Explore: { screen: 'Explore', title: 'Explore' },
  Settings: { screen: 'Settings', title: 'Settings' },
  ViewerProfile: { screen: 'ViewerProfile', title: 'Profile' },
  Profile: { screen: 'Profile', title: 'Profile' },
  Scanner: { screen: 'Scanner', title: 'Scanner' },
  IssueCredential: { screen: 'IssueCredential', title: 'Issue Credential' },
  Request: { screen: 'Request', title: 'Request' },
  Requests: { screen: 'Requests', title: 'Request' },
  CreateFirstCredential: {
    screen: 'CreateFirstCredential',
    title: 'Create First Credential',
  },
  Credential: { screen: 'Credential', title: 'Credential' },
  CredentialView: { screen: 'CredentialView', title: 'Credential' },
}

const UserSettingScreens = {
  Security: { screen: 'Security', title: 'Security' },
  ShowSecret: { screen: 'ShowSecret', title: 'Reveal Secret' },
}

const DeveloperSettingsScreens = {
  MessageProcess: { screen: 'MessageProcess', title: 'Message Process' },
}

export const Screens = {
  ...MainScreens,
  ...OnboardingScreens,
  ...UserSettingScreens,
  ...DeveloperSettingsScreens,
}
