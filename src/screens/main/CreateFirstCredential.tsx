/**
 *
 */
import React, { useState } from 'react'
import { TextInput, ActivityIndicator } from 'react-native'
import {
  Container,
  Text,
  Screen,
  Constants,
  Button,
  Modal,
} from '@kancha/kancha-ui'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { agent, issueCredential } from '../../services/daf'

const CreateFirstCredential: React.FC<NavigationStackScreenProps> & {
  navigationOptions: any
} = ({ navigation }) => {
  const did = navigation.getParam('did')
  const fetchMessages = navigation.getParam('fetchMessages')

  const [name, setName] = useState('')

  const signVc = async () => {
    const credential = await issueCredential(did, did, [
      { type: 'name', value: name },
    ])

    await agent.handleMessage({
      raw: credential.proof.jwt,
      save: true,
    })
    await agent.handleMessage({ raw: credential.proof.jwt, save: true })

    fetchMessages()
    navigation.dismiss()
  }

  return (
    <Screen scrollEnabled background={'primary'}>
      <Container padding>
        <Text type={Constants.TextTypes.H3} bold>
          {'Issue Credential'}
        </Text>
        <Container marginTop={10}>
          <Text type={Constants.TextTypes.Body}>
            You are issuing a credential to youself
          </Text>
        </Container>

        <Container backgroundColor={'#D3F4DF'} padding br={5} marginTop>
          <Text textStyle={{ fontFamily: 'menlo' }}>{did}</Text>
        </Container>
        <Container marginTop marginBottom>
          <Text type={Constants.TextTypes.Body}>
            Let's create your first credential by issuing a name credential to
            yourself...
          </Text>
        </Container>
        <Container marginTop marginBottom>
          <Text type={Constants.TextTypes.Body}>Enter your name</Text>
        </Container>
        <Container background={'secondary'} padding br={5}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={'Name'}
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
          />
        </Container>
        <Container marginTop={50}>
          <Container>
            <Button
              disabled={!name}
              fullWidth
              block={Constants.ButtonBlocks.Filled}
              type={Constants.BrandOptions.Primary}
              buttonText={'Issue'}
              onPress={() => signVc()}
            />
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}

CreateFirstCredential.navigationOptions = ({ navigation }: any) => {
  return {
    title: 'Issue credential',
    headerLeft: () => (
      <HeaderButtons>
        <Item title={'Cancel'} onPress={navigation.dismiss} />
      </HeaderButtons>
    ),
  }
}

export default CreateFirstCredential
