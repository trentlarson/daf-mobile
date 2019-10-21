import * as React from 'react'
import { Container, Text, Screen, Avatar, Constants } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

// tslint:disable-next-line:no-var-requires
const bannerImage = require('../../assets/images/space-x-banner.jpg')

interface Props extends NavigationStackScreenProps {}

const Profile: React.FC<Props> = ({ navigation }) => {
  return (
    <Screen scrollEnabled>
      <Container padding>
        <Avatar source={avatar1} type={'rounded'} size={60} />
        <Container marginTop={8}>
          <Text type={Constants.TextTypes.H3} bold>
            Space X
          </Text>
        </Container>
      </Container>
    </Screen>
  )
}

export default Profile
