import React, { useState, useEffect } from 'react'
import { Screen, Container, Text, Constants, Button } from '@kancha/kancha-ui'
import { ActivityIndicator } from 'react-native'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'
import { core } from '../../lib/setup'

interface MessageProcess {}

const MessageProcess: React.FC<MessageProcess> = () => {
  const [parsingMessage, setParsing] = useState(true)
  const message = useNavigationParam('message')
  const navigation = useNavigation()

  const parseMessage = (raw: string) => {
    core
      .onRawMessage({
        raw,
        meta: [
          {
            sourceType: 'qrCode',
          },
        ],
      })
      .then(parsed => {
        setParsing(false)
        console.log('Success', parsed)
      })
  }

  useEffect(() => {
    if (message) {
      parseMessage(message)
    }
  }, [])

  return (
    <Screen
      safeAreaBottom
      footerComponent={
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
              : 'All done. Do other stuff...'}
          </Text>
        </Container>
      </Container>
    </Screen>
  )
}

export default MessageProcess
