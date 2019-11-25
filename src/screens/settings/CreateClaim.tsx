/**
 * Serto Mobile App
 *
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Section,
  Text,
  Card,
} from '@kancha/kancha-ui'
import { TextInput } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { useQuery } from 'react-apollo'
import { GET_VIEWER } from '../../lib/graphql/queries'

import { Colors } from '../../theme'

interface Field {
  type: string
  value: any
}

/**
 * Temporary implementation until all requirements have been ironed out.
 * Final component will be built in @kancha
 */
export default () => {
  const navigation = useNavigation()

  const { data } = useQuery(GET_VIEWER)

  const [subject, updateSubject] = useState()
  const [claimValue, updateClaimValue] = useState('')
  const [claimType, updateClaimType] = useState('')
  const [fields, updateFields] = useState<Field[]>([])

  const signClaim = () => {
    navigation.navigate('ShareClaim', {
      claim: {
        fields,
        issuer: data.viewer.did,
        subject: subject,
      },
    })
  }

  const updateClaimFields = (field: Field) => {
    const newfields = fields.concat([field])
    updateFields(newfields)
    updateClaimValue('')
    updateClaimType('')
  }

  useEffect(() => {
    if (data && data.viewer) {
      updateSubject(data.viewer.did)
    }
  }, [])

  return (
    <Screen scrollEnabled={true} background={'primary'}>
      <Container padding>
        <Container marginBottom>
          <Text type={Constants.TextTypes.H3} bold>
            Create Claim
          </Text>
          <Container marginTop>
            <Text>
              Create a claim about an identity you control or another identity
            </Text>
          </Container>
        </Container>
        <Container background={'secondary'} padding br={5} marginBottom={5}>
          <Text textColor={Colors.MEDIUM_GREY} textStyle={{ fontSize: 12 }}>
            ISSUER
          </Text>
          <Text textColor={Colors.MEDIUM_GREY} textStyle={{ fontSize: 14 }}>
            {subject}
          </Text>
        </Container>
        <Container background={'secondary'} padding br={5}>
          <Text textColor={Colors.MEDIUM_GREY} textStyle={{ fontSize: 12 }}>
            SUBJECT
          </Text>
          <TextInput
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
            placeholderTextColor={Colors.LIGHT_GREY}
            style={{ color: Colors.BRAND }}
            onChangeText={updateSubject}
            value={subject}
          ></TextInput>
        </Container>
        <Container marginTop>
          {fields.map((field, i) => {
            return (
              <Container
                key={i}
                backgroundColor={Colors.CHARCOAL}
                br={8}
                padding
                marginBottom
              >
                <Text textColor={Colors.WHITE} textStyle={{ fontSize: 12 }}>
                  {field.type}
                </Text>
                <Text textColor={Colors.WHITE}>{field.value}</Text>
              </Container>
            )
          })}
        </Container>
        <Container
          backgroundColor={Colors.LIGHTEST_GREY}
          br={8}
          padding
          marginBottom={3}
        >
          <TextInput
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
            placeholderTextColor={Colors.LIGHT_GREY}
            placeholder={'Enter claim type'}
            value={claimType}
            style={{ fontSize: 12 }}
            onChangeText={updateClaimType}
          ></TextInput>
        </Container>
        <Container
          backgroundColor={Colors.LIGHTEST_GREY}
          br={8}
          padding
          marginBottom
        >
          <TextInput
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
            placeholderTextColor={Colors.LIGHT_GREY}
            placeholder={'Enter claim value'}
            value={claimValue}
            style={{ fontSize: 12 }}
            onChangeText={updateClaimValue}
          ></TextInput>
        </Container>

        <Container flexDirection={'row'} marginTop>
          <Container flex={1} marginRight>
            <Button
              buttonText={'Add field'}
              fullWidth
              type={'accent'}
              block={Constants.ButtonBlocks.Outlined}
              disabled={claimValue === '' || claimType === ''}
              onPress={() =>
                updateClaimFields({ type: claimType, value: claimValue })
              }
            ></Button>
          </Container>
          <Container flex={2}>
            <Button
              buttonText={'Sign Claim'}
              fullWidth
              type={'confirm'}
              block={'filled'}
              onPress={() => signClaim()}
              disabled={fields.length === 0}
              shadowOpacity={0.2}
            ></Button>
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}
