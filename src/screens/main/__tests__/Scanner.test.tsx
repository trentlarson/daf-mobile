import 'react-native'
import React from 'react'
import Scanner from '../Scanner'
import { render, fireEvent, act } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'

const navigation = {
  goBack: jest.fn(),
  dismiss: jest.fn(),
  navigate: jest.fn(),
}

jest.useFakeTimers()
jest.runAllTimers()

describe('Scanner', () => {
  it('renders correctly', () => {
    //@ts-ignore
    const tree = render(
      <MockedProvider addTypename={false}>
        <Scanner navigation={navigation} />
      </MockedProvider>,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('cancel button test', () => {
    //@ts-ignore
    const { getByTestId } = render(
      <MockedProvider addTypename={false}>
        <Scanner navigation={navigation} />
      </MockedProvider>,
    )
    expect(getByTestId('CANCEL_SCAN_BTN')).toBeDefined()

    act(() => {
      fireEvent.press(getByTestId('CANCEL_SCAN_BTN'))
    })

    expect(navigation.dismiss).toBeCalled()
  })

  it('jwt paste handler', () => {
    const component = render(
      <MockedProvider addTypename={false}>
        <Scanner navigation={navigation} />
      </MockedProvider>,
    )
    expect(component.getByTestId('ENABLE_PASTE')).toBeDefined()
    //expect(component.getByTestId('JWT_INPUT')).toThrowError()
    act(() => {
      fireEvent(component.getByTestId('ENABLE_PASTE'), 'press')
    })
    expect(component.getByTestId('JWT_INPUT')).toBeDefined()
  })
})
