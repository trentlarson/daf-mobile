import React, { useState } from 'react'
import {
  Container,
  Screen,
  Credential,
  Text,
  Constants,
  Button,
} from '@kancha/kancha-ui'
import { useNavigation, useNavigationParam } from 'react-navigation-hooks'

type Identity = {
  did: string
  shortId: string
}

interface CredentialViewProps {}

const CredentialView: React.FC<CredentialViewProps> = () => {
  const navigation = useNavigation()

  const message = useNavigationParam('handleMessage')
  const credentials = useNavigationParam('credentials')
  const handleMessage = useNavigationParam('handleMessage')

  const saveMessage = () => {
    handleMessage({
      variables: {
        raw: message,
        metaData: [{ type: 'reviewed' }],
        save: true,
      },
    })

    navigation.goBack()
  }

  return (
    <Screen
      safeAreaTop
      footerComponent={
        <Container flexDirection={'row'} padding paddingBottom={32}>
          <Container flex={1} marginRight>
            <Button
              type={'secondary'}
              fullWidth
              buttonText={'Done'}
              onPress={() => navigation.goBack()}
              block={'outlined'}
            />
          </Container>
          <Container flex={2}>
            <Button
              type={'primary'}
              disabled={false}
              fullWidth
              buttonText={'Save'}
              onPress={saveMessage}
              block={'filled'}
            />
          </Container>
        </Container>
      }
    >
      <Container padding>
        <Container marginBottom={30}>
          <Text type={Constants.TextTypes.H2} bold>
            Review Credential
          </Text>
        </Container>
        {credentials.map((vc: any) => {
          return (
            <Credential
              background={'primary'}
              key={vc.hash}
              detailMode
              jwt={vc.raw}
              issuer={vc.issuer}
              subject={vc.subject}
              fields={vc.claims}
              exp={vc.expirationDate}
            />
          )
        })}
      </Container>
    </Screen>
  )
}

export default CredentialView
