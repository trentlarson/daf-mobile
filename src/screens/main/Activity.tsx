import * as React from 'react'
import { Container, Text, Screen } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'

interface Props extends NavigationStackScreenProps {}

const Activity: React.FC<Props> = ({ navigation }) => {
  return (
    <Screen>
      <Container alignItems={'center'} justifyContent={'center'} flex={1}>
        <Text>Activity tab</Text>
      </Container>
    </Screen>
  )
}

export default Activity
