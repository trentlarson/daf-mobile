import React, { useState, useEffect, useContext } from 'react'
import {
  Container,
  Banner,
  Indicator,
  RequestItem,
  Screen,
  Button,
} from '@kancha/kancha-ui'
import { useNavigation } from 'react-navigation-hooks'
import { WalletConnectContext } from '../../../providers/WalletConnect'
import useAgent from '../../../hooks/useAgent'
import {
  agent,
  getMessageWithSdr,
  issueCredential,
  signVerifiablePresentation,
} from '../../../services/daf'
import useSelectedCredentials from '../../../hooks/useSelectedCredentials'

interface RequestProps {
  peerId: string
  payloadId: number
  peerMeta: any
  messageId: string
  isWalletConnect: boolean
  selectedIdentity: any
}
interface ValidationState {
  [index: string]: {
    required: boolean
    jwt: string | null
  }
}

const SelectiveDisclosure: React.FC<RequestProps> = ({
  peerId,
  peerMeta,
  messageId,
  isWalletConnect,
  selectedIdentity,
  payloadId,
}) => {
  const [sending, updateSending] = useState<boolean>(false)
  const navigation = useNavigation()

  const { state: sdrMessage } = useAgent(getMessageWithSdr, {
    messageId,
    did: selectedIdentity,
  })

  const {
    selected,
    onSelect: onSelectItem,
    valid: formValid,
  } = useSelectedCredentials(sdrMessage.data)

  const {
    walletConnectApproveCallRequest,
    walletConnectRejectCallRequest,
  } = useContext(WalletConnectContext)

  const shareCredentials = async () => {
    if (formValid) {
      updateSending(true)

      const vp = await signVerifiablePresentation(
        selectedIdentity,
        sdrMessage.data.from.did,
        selected,
      )

      console.log(vp)

      if (isWalletConnect) {
        await approveCallRequest(vp.proof.jwt)
        updateSending(false)
      }

      navigation.goBack()
    }
  }

  const approveCallRequest = async (jwt: string) => {
    await walletConnectApproveCallRequest(peerId, {
      id: payloadId,
      result: jwt,
    })
    navigation.goBack()
  }

  const rejectCallRequest = async () => {
    if (isWalletConnect) {
      await walletConnectRejectCallRequest(peerId, {
        id: payloadId,
        error: 'CREDENTIAL_SHARING_REJECTED',
      })
    }
    navigation.goBack()
  }

  return (
    <Screen
      scrollEnabled
      footerComponent={
        <Container flexDirection={'row'} padding paddingBottom={32}>
          <Container flex={1} marginRight>
            <Button
              type={'secondary'}
              fullWidth
              buttonText={'Later'}
              onPress={rejectCallRequest}
              block={'outlined'}
            />
          </Container>
          <Container flex={2}>
            <Button
              type={'primary'}
              disabled={!formValid}
              fullWidth
              buttonText={'Share'}
              onPress={() => shareCredentials()}
              block={'filled'}
            />
          </Container>
        </Container>
      }
    >
      <Container>
        <Banner
          title={peerMeta && peerMeta.name}
          subTitle={peerMeta && peerMeta.url}
          issuer={{
            did: '',
            shortId: '',
            profileImage: peerMeta ? peerMeta.icons[0] : 'http://',
          }}
        />
        <Indicator
          text={`${
            (peerMeta && peerMeta.name) || 'Unknown'
          } has requested credentials`}
        />

        <Container>
          {sdrMessage.data &&
            sdrMessage.data.sdr &&
            sdrMessage.data.sdr.map((sdrRequestField: any, index: number) => {
              console.log(sdrRequestField)
              return (
                <RequestItem
                  selfSign={(claimType: string, value: string) =>
                    issueCredential(selectedIdentity, selectedIdentity, [
                      { [claimType]: value },
                    ])
                  }
                  closeAfterSelect={false}
                  key={sdrRequestField.claimType + index}
                  claimType={sdrRequestField.claimType}
                  reason={sdrRequestField.reason}
                  issuers={sdrRequestField.issuers}
                  credentials={sdrRequestField.credentials}
                  required={sdrRequestField.essential}
                  onSelectItem={onSelectItem}
                />
              )
            })}
        </Container>
      </Container>
    </Screen>
  )
}

export default SelectiveDisclosure
