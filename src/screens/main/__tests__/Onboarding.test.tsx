import 'react-native'
import React from 'react'
import { render } from 'react-native-testing-library'
import Onboarding from '../Onboarding'

jest.useFakeTimers()
jest.runAllTimers()

describe('Onboarding', () => {
  test('renders the intermediate screen if dids are present', async () => {
    // @ts-ignore
    const onboarding = <Onboarding navigation={jest.fn()} />
    const tree = render(onboarding).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
