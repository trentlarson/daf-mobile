import 'react-native'
import React from 'react'
import Settings from '../../settings/Settings'
import { render, fireEvent, act } from 'react-native-testing-library'
import { useTranslation } from 'react-i18next' //'../../../__mocks__/react-i18next'
import { SwitchProvider } from '../../../theme/switcher'

const navigation = {
  navigate: jest.fn(),
}

it('renders correctly', () => {
  const tree = render(
    <SwitchProvider>
      {() => (
        // @ts-ignore
        <Settings navigation={navigation} />
      )}
    </SwitchProvider>,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
