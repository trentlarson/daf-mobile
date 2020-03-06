/**
 * Serto Mobile App
 *
 */
import React, { useState, useEffect } from 'react'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useTranslation } from 'react-i18next'
import { Switch } from 'react-native'
import {
  Container,
  Text,
  Screen,
  ListItem,
  Section,
  Device,
  Overlay,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import Config from 'react-native-config'
import {
  RUN_CLOUD_BACKUP,
  CHECK_CLOUD_BACKUP,
  CHECK_CLOUD_BACKUP_PREF,
  DISABLE_CLOUD_BACKUP,
  VIEWER_RAW_MESSAGES,
} from '../../lib/graphql/queries'
import { useQuery, useMutation } from 'react-apollo'

const Settings: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const refetchQueries = [
    {
      query: CHECK_CLOUD_BACKUP,
    },
    {
      query: CHECK_CLOUD_BACKUP_PREF,
    },
  ]
  const { data: checkCloud } = useQuery(CHECK_CLOUD_BACKUP)
  const { data: checkLocal } = useQuery(CHECK_CLOUD_BACKUP_PREF)

  const [backupEnabled, setBackupPreference] = useState(false)
  const [runCloudBackup] = useMutation(RUN_CLOUD_BACKUP, { refetchQueries })
  const [disableCloudBackup] = useMutation(DISABLE_CLOUD_BACKUP, {
    refetchQueries,
  })

  const toggleBackup = () => {
    if (backupEnabled) {
      disableCloudBackup()
      Overlay.show(
        'Backup disabled',
        'Your data has been removed from iCloud',
        { name: 'ios-cloud', iconFamily: 'Ionicons' },
      )
    } else {
      runCloudBackup()
      Overlay.show('Backup enabled', 'Your data will be backup up', {
        name: 'ios-cloud',
        iconFamily: 'Ionicons',
      })
    }
  }

  useEffect(() => {
    if (
      checkLocal &&
      checkLocal.hasCloudBackupPref &&
      checkCloud &&
      checkCloud.hasCloudBackup
    ) {
      setBackupPreference(true)
    } else {
      setBackupPreference(false)
    }
  }, [checkCloud, checkLocal])

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
            <ListItem onPress={() => navigation.navigate('Messages')}>
              {t('Messages')}
            </ListItem>
            <ListItem onPress={() => navigation.navigate('CreateCredential')}>
              {t('Create Credential')}
            </ListItem>
            <ListItem onPress={() => navigation.navigate('CreateRequest')}>
              {t('Request Data')}
            </ListItem>
            <ListItem onPress={() => navigation.navigate('Connections')}>
              {t('Connections')}
            </ListItem>
            <ListItem last onPress={() => navigation.navigate('Signer')}>
              {t('Identities')}
            </ListItem>
          </Section>
        )}
        <Section title={'Language'}>
          <ListItem
            last
            iconLeft={
              <Switch
                testID={'language_switch'}
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
        {Device.isIOS && (
          <Section title={'Backup'}>
            <ListItem
              last
              iconLeft={
                <Switch value={backupEnabled} onValueChange={toggleBackup} />
              }
            >
              {backupEnabled ? t('Backup ON') : t('Backup OFF')}
            </ListItem>
            <ListItem last>
              {backupEnabled
                ? 'All of your data is backed up to iCloud'
                : 'Your data is not backed up and will be lost if you delete the app'}
            </ListItem>
          </Section>
        )}
      </Container>
    </Screen>
  )
}

export default Settings
