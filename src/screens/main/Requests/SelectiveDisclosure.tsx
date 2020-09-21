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
import { agent, getMessageWithSdr } from '../../../services/daf'
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
  // const [selected, updateSelected] = useState<ValidationState>({})
  // const [formValid, setValid] = useState(true)
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

  // const [actionSignVc] = useMutation(SIGN_VC_MUTATION, {
  //   onCompleted: async (response) => {
  //     if (response && response.signCredentialJwt) {
  //       refetch()
  //     }
  //   },
  // })

  // const signVc = (claimType: string, value: string) => {
  //   actionSignVc({
  //     variables: {
  //       data: {
  //         issuer: selectedIdentity,
  //         context: ['https://www.w3.org/2018/credentials/v1'],
  //         type: ['VerifiableCredential'],
  //         credentialSubject: {
  //           id: selectedIdentity,
  //           [claimType]: value,
  //         },
  //       },
  //     },
  //   })
  // }

  // const [actionSendDidComm] = useMutation(SEND_DIDCOMM_MUTATION, {
  //   onCompleted: (response) => {
  //     if (response) {
  //       updateSending(false)
  //     }
  //   },
  //   onError: (error) => {
  //     console.log(error)
  //   },
  // })
  // const [actionSignVp] = useMutation(SIGN_VP, {
  //   onCompleted: async (response) => {
  //     if (response.signPresentationJwt) {
  //       updateSending(true)

  //       if (isWalletConnect) {
  //         await approveCallRequest(response.signPresentationJwt.raw)
  //       } else {
  //         await actionSendDidComm({
  //           variables: {
  //             data: {
  //               to: message.from.did,
  //               from: selectedIdentity,
  //               body: response.signPresentationJwt.raw,
  //               type: 'DIDComm',
  //             },
  //             url: message.replyUrl,
  //             save: false,
  //           },
  //         })
  //       }
  //       navigation.goBack()
  //     }
  //   },
  //   onError: (error) => {
  //     console.log(error)
  //   },
  // })

  // const accept = () => {
  //   if (formValid) {
  //     const selectedVp = Object.keys(selected)
  //       .map((key) => selected[key].jwt)
  //       .filter((item) => item)

  //     const payload = {
  //       variables: {
  //         data: {
  //           issuer: selectedIdentity,
  //           audience: message && message.from.did,
  //           tag: message && message.threadId,
  //           context: ['https://www.w3.org/2018/credentials/v1'],
  //           type: ['VerifiablePresentation'],
  //           verifiableCredential: selectedVp,
  //         },
  //       },
  //     }

  //     actionSignVp(payload)
  //   }
  // }

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
              onPress={() => {}}
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
                  selfSign={() => {}}
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
