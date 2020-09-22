import * as React from 'react'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useTranslation } from 'react-i18next'
import { Switch } from 'react-native'
import { Container, Text, Screen, ListItem, Section } from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import Config from 'react-native-config'
import { useSwitch } from '../../theme/switcher'

const Settings: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const [themeType, switchTheme] = useSwitch()
  return (
    <Screen scrollEnabled={true}>
      <Container backgroundColor={Colors.BRAND} padding alignItems={'center'}>
        <Text bold textColor={Colors.WHITE}>
          {t('Environment')}: {Config.ENV}
        </Text>
      </Container>
      <Container>
        <Section title={'Language'}>
          <ListItem
            last
            iconLeft={
              <Switch
                testID={'LANGUAGE_SWITCH_BTN'}
                value={i18n.language === 'es'}
                onValueChange={() =>
                  i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
                }
              />
            }
          >
            {i18n.language === 'en' ? t('English') : t('Spanish')}
          </ListItem>
        </Section>
        <Section title={'Theme'}>
          <ListItem
            last
            iconLeft={
              <Switch
                testID={'THEME_SWITCH_BTN'}
                value={themeType === 'dark'}
                onValueChange={() =>
                  switchTheme(themeType === 'light' ? 'dark' : 'light')
                }
              />
            }
          >
            {themeType === 'dark' ? 'Dark Mode - experimental' : 'Light Mode'}
          </ListItem>
        </Section>
      </Container>
    </Screen>
  )
}

export default Settings
