/**
 *
 */
import React, { useEffect, useContext } from 'react'
import { ActivityIndicator } from 'react-native'
import { Container, Text, Screen, Constants } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { AppContext } from '../../providers/AppContext'
import { agent } from '../../services/daf'
import useAgent from '../../hooks/useAgent'

const Intro: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  // Check if we are importing a seed
  const importingSeed = navigation.getParam('import', false)

  // State hooks
  const { selectedIdentity, setSelectedIdentity } = useContext(AppContext)
  const { state: identity, request: createIdentity } = useAgent(
    agent.identityManagerCreateIdentity,
    { kms: 'local', provider: 'did:ethr:rinkeby' },
    false,
  )

  useEffect(() => {
    if (identity.data && identity.data.did) {
      setSelectedIdentity(identity.data.did)

      navigation.navigate('App')
    }
  }, [identity])

  useEffect(() => {
    setTimeout(() => {
      if (!importingSeed) {
        createIdentity()
      } else {
        navigation.navigate('App')
      }
    }, 1100)
  }, [])

  return (
    <Screen>
      <Container padding marginTop={100}>
        <ActivityIndicator />
      </Container>
      <Container marginTop={30} alignItems={'center'}>
        <Text type={Constants.TextTypes.H3} bold>
          {importingSeed ? 'Importing seed...' : 'Creating your identity...'}
        </Text>
        <Container marginTop={10}>
          <Text type={Constants.TextTypes.Body} textAlign={'center'}>
            Hang on for just a moment
          </Text>
        </Container>
      </Container>
    </Screen>
  )
}

export default Intro
