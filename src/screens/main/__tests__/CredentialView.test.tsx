import React from 'react'
import CredentialView from '../CredentialView'
import { render, fireEvent } from 'react-native-testing-library'

const goBack = jest.fn()
const handleMessage = jest.fn()

jest.mock('react-navigation-hooks', () => {
  return {
    useNavigation: () => {
      return {
        goBack: goBack,
      }
    },
    useNavigationParam: (type: string) => {
      switch (type) {
        case 'message':
          return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1OTIyMjA2ODEsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjZXNzIjoiQWxsIEFyZWFzIn19LCJzdWIiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4NDJjNmU5ODUzYWNjZjRhMzM3NGQxZjU4OTJmNDVlM2FjNmY4ZDk1MyIsImlzcyI6ImRpZDpldGhyOnJpbmtlYnk6MHg0MmM2ZTk4NTNhY2NmNGEzMzc0ZDFmNTg5MmY0NWUzYWM2ZjhkOTUzIn0.EGzRu5jgekeU0oxFPBBLT6QaCHKMT_DasSCh-duy-3crgiuMIRiKbSHmAZCEzB2NYrTiFOx4GSHHKXWWUk5CbgA'
        case 'credentials':
          return [
            {
              hash:
                'de9854440c3dcdc212ca62f318230970c6ba343cd89723b1811617fa2a8558e21b182ce1e9a82bac4ea567f1fe0ac50e7b0bdee4b904f8acc370b847858a82f4',
              raw:
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1OTIyMjA2ODEsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiYWNjZXNzIjoiQWxsIEFyZWFzIn19LCJzdWIiOiJkaWQ6ZXRocjpyaW5rZWJ5OjB4NDJjNmU5ODUzYWNjZjRhMzM3NGQxZjU4OTJmNDVlM2FjNmY4ZDk1MyIsImlzcyI6ImRpZDpldGhyOnJpbmtlYnk6MHg0MmM2ZTk4NTNhY2NmNGEzMzc0ZDFmNTg5MmY0NWUzYWM2ZjhkOTUzIn0.EGzRu5jgekeU0oxFPBBLT6QaCHKMT_DasSCh-duy-3crgiuMIRiKbSHmAZCEzB2NYrTiFOx4GSHHKXWWUk5CbgA',
              credentialSubject: {
                access: 'All Areas',
              },
              expirationDate: null,
              issuer: {
                did:
                  'did:ethr:rinkeby:0x42c6e9853accf4a3374d1f5892f45e3ac6f8d953',
                __typename: 'Identity',
              },
              subject: {
                did:
                  'did:ethr:rinkeby:0x42c6e9853accf4a3374d1f5892f45e3ac6f8d953',
                __typename: 'Identity',
              },
              claims: [
                {
                  isObj: false,
                  type: 'access',
                  value: 'All Areas',
                  __typename: 'Claim',
                },
              ],
              __typename: 'Credential',
            },
          ]
        case 'handleMessage':
          return handleMessage
      }
    },
  }
})

describe('Credential View', () => {
  it('should render with default props', () => {
    const tree = render(<CredentialView />)
    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('should fire cancel event', () => {
    const { getByText } = render(<CredentialView />)
    fireEvent.press(getByText('Done'))

    expect(goBack).toHaveBeenCalled()
  })

  it('should fire save event and handle message', () => {
    const { getByText } = render(<CredentialView />)
    fireEvent.press(getByText('Save'))

    expect(handleMessage).toHaveBeenCalled()
    expect(goBack).toHaveBeenCalled()
  })
})
