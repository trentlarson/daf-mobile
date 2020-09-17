import React, { useState, useEffect } from 'react'
import { Screen, Container, Text, Constants, Button } from '@kancha/kancha-ui'
import { ActivityIndicator } from 'react-native'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { agent } from '../../services/daf'

interface MessageProcess {}

const MessageProcess: React.FC<MessageProcess> = () => {
  const navigation = useNavigation()
  const raw = useNavigationParam('message')

  const [parsingMessage, setParsing] = useState(true)

  const handleMessage = async (msg: string) => {
    const newMessage = await agent.handleMessage({
      raw: msg,
      metaData: [{ type: 'qrCode' }],
      save: false,
    })
    if (newMessage) {
      setParsing(false)
    }
  }

  useEffect(() => {
    if (raw) {
      handleMessage(raw)
    }
  }, [])

  return (
    <Screen
      safeAreaBottom
      footerComponent={
        !parsingMessage && (
          <Container paddingHorizontal={true} paddingBottom={true}>
            <Container alignItems={'center'}>
              <Container w={300}>
                <Button
                  fullWidth
                  type={Constants.BrandOptions.Primary}
                  block={Constants.ButtonBlocks.Outlined}
                  buttonText={'Done'}
                  onPress={() => navigation.dismiss()}
                />
              </Container>
            </Container>
          </Container>
        )
      }
    >
      <Container padding marginTop={100}>
        {parsingMessage && <ActivityIndicator />}
      </Container>
      <Container marginTop={30} alignItems={'center'}>
        <Text type={Constants.TextTypes.H3} bold>
          {parsingMessage ? 'Parsing QR Message...' : 'Message Read!'}
        </Text>
        <Container marginTop={10}>
          <Text type={Constants.TextTypes.Body} textAlign={'center'}>
            {parsingMessage
              ? 'Hang on for just a moment'
              : 'Check your activity feed for new messages containing credentials or selective disclosure requests'}
          </Text>
        </Container>
      </Container>
    </Screen>
  )
}

export default MessageProcess
