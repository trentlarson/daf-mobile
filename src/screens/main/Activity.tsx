import React, { useContext, useEffect } from 'react'
import { FlatList } from 'react-native'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import {
  Container,
  Text,
  Screen,
  ActivityItem,
  Button,
  Device,
  Constants,
  Credential,
  Loader,
} from '@kancha/kancha-ui'
import ContactsHeader from '../../navigators/components/ContactsHeader'
import { AppContext } from '../../providers/AppContext'
import AppConstants from '../../constants'

interface Props extends NavigationStackScreenProps {}

const Activity: React.FC<Props> = ({ navigation }) => {
  const { selectedIdentity, messages, identities, getMessages } = useContext(
    AppContext,
  )

  console.log(messages)

  const showFirstLoadModal = () => {
    navigation.navigate('CreateFirstCredential', {
      did: selectedIdentity,
      fetchMessages: getMessages,
    })
  }

  const viewAttachments = (credentials: any[], credentialIndex: number) => {
    navigation.navigate('CredentialDetail', {
      credentials,
      credentialIndex,
    })
  }

  const viewProfile = (did: any) => {
    navigation.navigate('Profile', {
      did,
      isViewer: selectedIdentity === did,
    })
  }

  const confirmRequest = (msg: any) => {
    const requestType = AppConstants.requests.DISCLOSURE

    navigation.navigate('Requests', {
      requestType,
      peerId: null,
      peerMeta: null,
      payload: null,
      messageId: msg && msg.id,
    })
  }

  return (
    <Screen background={'secondary'} safeArea={true}>
      <Container flex={1}>
        {!messages && <Loader width={180} text={'Loading activity...'} />}
        <FlatList
          ListHeaderComponent={
            <ContactsHeader
              viewProfile={viewProfile}
              identities={identities.data || []}
            />
          }
          style={{ flex: 1 }}
          data={messages.data && messages.data}
          onRefresh={() => getMessages()}
          refreshing={messages.status === 'loading'}
          renderItem={({ item }: { item: any }) => {
            return (
              <ActivityItem
                id={item.id}
                type={item.type}
                date={item.data.nbf * 1000 || item.data.iat * 1000}
                sender={item.from}
                receiver={item.to}
                viewer={item.viewer}
                confirm={() => confirmRequest(item)}
                profileAction={() => {}}
                actions={['Share']}
                attachments={item.credentials}
                renderAttachment={(
                  credential: any,
                  credentialIndex: number,
                ) => (
                  <Container
                    w={Device.width - 40}
                    padding
                    paddingRight={0}
                    key={credential.hash}
                  >
                    <Credential
                      onPress={() =>
                        viewAttachments(item.credentials, credentialIndex)
                      }
                      exp={credential.expirationDate}
                      fields={credential.fields}
                      subject={credential.sub}
                      issuer={credential.iss}
                      shadow={1.5}
                      background={'primary'}
                    />
                  </Container>
                )}
              />
            )
          }}
          keyExtractor={(item, index) => item.id + index}
          ListEmptyComponent={
            <Container>
              <Container padding background={'secondary'}>
                <Text bold type={Constants.TextTypes.H3}>
                  Hey there,
                </Text>
                <Container marginBottom marginTop={5}>
                  <Text type={Constants.TextTypes.Body}>
                    It looks like you are new here? You can start by issuing
                    yourself a<Text bold> name </Text>
                    credential!
                  </Text>
                </Container>
                <Button
                  fullWidth
                  buttonText={'Get started'}
                  onPress={() => showFirstLoadModal()}
                  type={Constants.BrandOptions.Primary}
                  block={Constants.ButtonBlocks.Outlined}
                />
              </Container>
              {[1, 2, 3, 4].map((fakeItem: number) => (
                <Container
                  background={'primary'}
                  padding
                  marginBottom={5}
                  key={fakeItem}
                >
                  <Container
                    background={'secondary'}
                    viewStyle={{ borderRadius: 20, width: 40, height: 40 }}
                  ></Container>
                  <Container
                    background={'secondary'}
                    h={90}
                    br={10}
                    marginTop={20}
                  ></Container>
                </Container>
              ))}
            </Container>
          }
        />
      </Container>
    </Screen>
  )
}

export default Activity
