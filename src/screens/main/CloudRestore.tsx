/**
 *
 */
import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { Container, Text, Screen, Constants } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useMutation } from '@apollo/react-hooks'
import {
  GET_MANAGED_IDENTITIES,
  GET_VIEWER,
  RESTORE_CLOUD_BACKUP,
} from '../../lib/graphql/queries'

const CloudRestore: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const refetchQueries = [
    { query: GET_MANAGED_IDENTITIES },
    { query: GET_VIEWER },
  ]
  const [restoreCloudBackup] = useMutation(RESTORE_CLOUD_BACKUP, {
    onCompleted({ restoreCloudBackup }) {
      if (restoreCloudBackup) {
        setTimeout(() => {
          navigation.navigate('App')
        }, 1000)
      }
    },
    refetchQueries,
  })

  useEffect(() => {
    restoreCloudBackup()
  }, [])

  return (
    <Screen>
      <Container padding marginTop={100}>
        <ActivityIndicator />
      </Container>
      <Container marginTop={30} alignItems={'center'}>
        {/* <Text type={Constants.TextTypes.H3} bold>
          {importingSeed ? 'Importing seed...' : 'Creating your identity...'}
        </Text> */}
        <Container marginTop={10}>
          <Text type={Constants.TextTypes.Body} textAlign={'center'}>
            Restoring your data...
          </Text>
        </Container>
      </Container>
    </Screen>
  )
}

export default CloudRestore
