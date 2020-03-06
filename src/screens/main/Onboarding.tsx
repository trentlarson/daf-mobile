import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Screen,
  Container,
  Button,
  Constants,
  Text,
  Device,
  Icon,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { Colors } from '../../theme'
import { useLazyQuery, useQuery } from '@apollo/react-hooks'
import { CHECK_CLOUD_BACKUP } from '../../lib/graphql/queries'

interface OnboardingProps extends NavigationStackScreenProps {}

const Onboarding: React.FC<OnboardingProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const [hasCloudBackup, setHasCloudBackup] = useState(false)
  const { data } = useQuery(CHECK_CLOUD_BACKUP)

  useEffect(() => {
    if (data && data.hasCloudBackup) {
      setHasCloudBackup(data.hasCloudBackup)
    }
  })

  return (
    <Screen>
      <Container alignItems={'center'} flex={1} padding>
        <Container marginTop={30}>
          <Text type={Constants.TextTypes.H2} bold>
            Get started!
          </Text>
        </Container>
        {Device.isIOS && hasCloudBackup && (
          <>
            <Container marginTop={30}>
              <Text type={Constants.TextTypes.Body} textAlign={'center'}>
                We found a back up in your iCloud. Would you like to restore
                from this backup now?
              </Text>
            </Container>
            <Container w={300} marginTop={30}>
              <Button
                shadowOpacity={0.2}
                fullWidth
                icon={
                  <Icon
                    color={Colors.WHITE}
                    icon={{
                      name: 'ios-cloud-download',
                      iconFamily: 'Ionicons',
                    }}
                  />
                }
                type={Constants.BrandOptions.Primary}
                block={Constants.ButtonBlocks.Filled}
                buttonText={t('Restore from iCloud')}
                onPress={() => {
                  navigation.navigate('CloudRestore')
                }}
              />
            </Container>
          </>
        )}
        <Container marginTop={30}>
          <Text type={Constants.TextTypes.Body} textAlign={'center'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Container>
        <Container w={300} marginTop={30}>
          <Button
            fullWidth
            type={Constants.BrandOptions.Primary}
            block={Constants.ButtonBlocks.Filled}
            buttonText={t('Create New Identity')}
            onPress={() => navigation.navigate('CreatingWallet')}
          />
        </Container>
      </Container>
    </Screen>
  )
}

export default Onboarding
