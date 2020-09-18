import React, { useEffect, useContext } from 'react'
import {
  Container,
  Text,
  Screen,
  Avatar,
  Constants,
  Button,
  BottomSnap,
  Credential,
  Icon,
} from '@kancha/kancha-ui'
import TabAvatar from '../../navigators/components/TabAvatar'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { ActivityIndicator } from 'react-native'
import { Colors } from '../../theme'
import hexToRgba from 'hex-to-rgba'
import { AppContext } from '../../providers/AppContext'
import useAgent from '../../hooks/useAgent'
import { getProfile, getGetCredentialsWithProfiles } from '../../services/daf'

const SWITCH_IDENTITY = 'SWITCH_IDENTITY'

interface Props extends NavigationStackScreenProps {}

const ViewerProfile: React.FC<Props> & { navigationOptions: any } = ({
  navigation,
}) => {
  const { selectedIdentity } = useContext(AppContext)

  const { state: profile, loading: profileLoading } = useAgent(getProfile, {
    subject: selectedIdentity,
    fields: ['name', 'profileImage'],
  })

  const {
    state: credentials,
    loading: credentialsLoading,
    request: getCredentials,
  } = useAgent(getGetCredentialsWithProfiles, {
    where: [{ column: 'subject', value: [selectedIdentity] }],
  })

  const source =
    profile.data && profile.data.profileImage
      ? { source: { uri: profile.data.profileImage } }
      : {}

  useEffect(() => {
    if (profile.data) {
      navigation.setParams({ viewer: profile.data })
    }
  }, [profile.data])

  useEffect(() => {
    getCredentials()
  }, [selectedIdentity])

  return (
    <Screen scrollEnabled background={'primary'}>
      {profileLoading && (
        <Container padding flex={1}>
          <Container
            w={100}
            h={100}
            br={5}
            background={'secondary'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <ActivityIndicator size={'large'} />
          </Container>
          <Container marginTop>
            <Container h={23} br={5} background={'secondary'}></Container>
            <Container marginTop>
              <Container
                h={60}
                backgroundColor={hexToRgba(Colors.CONFIRM, 0.3)}
                padding
                br={5}
              ></Container>
            </Container>
          </Container>
        </Container>
      )}

      {!profileLoading && (
        <Container padding flex={1}>
          <Avatar
            {...source}
            type={'rounded'}
            size={100}
            address={selectedIdentity}
            gravatarType={'retro'}
            backgroundColor={'white'}
          />
          <Container marginTop>
            <Text type={Constants.TextTypes.H2} bold>
              {profile.data && profile.data.shortDid}
            </Text>
            <Container marginTop>
              <Container
                backgroundColor={hexToRgba(Colors.CONFIRM, 0.3)}
                padding
                br={5}
              >
                <Text textStyle={{ fontFamily: 'menlo' }} selectable>
                  {selectedIdentity}
                </Text>
              </Container>
            </Container>
          </Container>
        </Container>
      )}
      <Container padding>
        {!profileLoading && (
          <Container flexDirection={'row'}>
            <Text type={Constants.TextTypes.H3} bold>
              Credentials
            </Text>
          </Container>
        )}

        {!credentialsLoading &&
          credentials.data &&
          credentials.data.length === 0 && (
            <Container marginTop>
              <Text type={Constants.TextTypes.Body}>
                Start issuing credentials to yourself and others. Try starting
                with a <Text bold>name</Text> credential to personalise this
                profile.
              </Text>
            </Container>
          )}
        {!credentialsLoading &&
          credentials.data &&
          credentials.data.length > 0 && (
            <Container>
              <Container marginBottom>
                <Container marginTop>
                  <Text type={Constants.TextTypes.Body}>
                    <Text bold>Received</Text> credentials are presented here as
                    a plain list for now. Some will be moved to the data
                    explorer tab where we can explore all of our data and
                    connections.
                  </Text>
                </Container>
              </Container>
              {credentials &&
                credentials.data.map((vc: any, i: number) => {
                  return (
                    <Credential
                      key={i}
                      onPress={() =>
                        navigation.navigate('Credential', {
                          credentials: [vc],
                        })
                      }
                      background={'secondary'}
                      exp={3456789}
                      issuer={vc.issuer}
                      subject={vc.subject}
                      fields={vc.claims}
                    />
                  )
                })}
            </Container>
          )}
      </Container>
    </Screen>
  )
}

ViewerProfile.navigationOptions = ({ navigation }: any) => {
  const { viewer } = navigation.state.params || {}

  return {
    headerLeft: () => (
      <Container paddingLeft>
        <Button
          iconButton
          onPress={() =>
            viewer && navigation.navigate('IssueCredential', { viewer })
          }
          icon={
            <Icon
              color={Colors.CHARCOAL}
              icon={{ name: 'ios-create', iconFamily: 'Ionicons' }}
              size={30}
            />
          }
        />
      </Container>
    ),
    headerRight: () => (
      <Button
        onPress={() => BottomSnap.open(SWITCH_IDENTITY)}
        iconButton
        icon={<TabAvatar />}
      />
    ),
  }
}

export default ViewerProfile
