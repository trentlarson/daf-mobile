/**
 * Serto Mobile App
 *
 */
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
        {/* <Section title={'Security'}>
          <ListItem last onPress={() => navigation.navigate('ShowSecret')}>
            {t('Show Seed Phrase')}
          </ListItem>
        </Section> */}
        {__DEV__ && (
          <Section title={'Developer tooling'}>
            <ListItem
              testID={'MESSAGES_BTN'}
              onPress={() => navigation.navigate('Messages')}
            >
              {t('Messages')}
            </ListItem>
            <ListItem
              testID={'ATTENDED_BVC_SAT_BTN'}
              onPress={() => navigation.navigate('BvcAttendedSat')}
            >
              {t('Attended BVC Saturday')}
            </ListItem>
            <ListItem
              testID={'CREATE_CREDENTIAL_BTN'}
              onPress={() => navigation.navigate('CreateCredential')}
            >
              {t('Create Credential')}
            </ListItem>
            <ListItem
              testID={'CREATE_REQUEST_BTN'}
              onPress={() => navigation.navigate('CreateRequest')}
            >
              {t('Request Data')}
            </ListItem>
            <ListItem
              testID={'CONNECTIONS_BTN'}
              onPress={() => navigation.navigate('Connections')}
            >
              {t('Connections')}
            </ListItem>
            <ListItem
              last
              testID={'SIGNER_BTN'}
              onPress={() => navigation.navigate('Signer')}
            >
              {t('Identities')}
            </ListItem>
          </Section>
        )}
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
