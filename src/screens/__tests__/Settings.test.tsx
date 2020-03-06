import 'react-native'
import React from 'react'
import Settings from '../settings/Settings'
import { render } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'

const navigation = {
  navigate: jest.fn(),
}

it('renders correctly', () => {
  // jest.useFakeTimers()
  // @ts-ignore
  const screen = <Settings navigation={navigation} />
  const tree = render(
    <MockedProvider mocks={[]}>{screen}</MockedProvider>,
  ).toJSON()

  expect(tree).toMatchSnapshot()
})
