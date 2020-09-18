import React, { useContext } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import {
  BottomSheet,
  ListItem,
  Avatar,
  BottomSnap,
  Container,
  Button,
  Icon,
  Overlay,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import AppConstants from '../../constants'
import { AppContext } from '../../providers/AppContext'
const { SWITCHED_IDENTITY } = AppConstants.modals

interface Identity {
  did: string
  shortDid: string
  profileImage?: string
}

interface SwitcherProps {
  id: string
}

const Switcher: React.FC<SwitcherProps> = ({ id }) => {
  const {
    managedIdentities,
    selectedIdentity,
    setSelectedIdentity,
    createIdentity,
  } = useContext(AppContext)

  const switchIdentity = async (identity: Identity) => {
    setSelectedIdentity(identity.did)

    BottomSnap.close(id)

    Overlay.show(
      SWITCHED_IDENTITY.title,
      SWITCHED_IDENTITY.message,
      SWITCHED_IDENTITY.icon,
      SWITCHED_IDENTITY.delay,
    )
  }

  const isSelected = (did: string) => did === selectedIdentity

  return (
    <BottomSheet id={id} scrollEnabled>
      {() => (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {managedIdentities.data &&
            managedIdentities.data
              .sort(
                (id1: Identity, id2: Identity) =>
                  (isSelected(id2.did) ? 1 : 0) - (isSelected(id1.did) ? 1 : 0),
              )
              .map((identity: Identity) => {
                const source = identity.profileImage
                  ? { source: { uri: identity.profileImage } }
                  : {}
                return (
                  <Container key={identity.did}>
                    <ListItem
                      hideForwardArrow
                      onPress={() => switchIdentity(identity)}
                      selected={isSelected(identity.did)}
                      last
                      iconLeft={
                        <Avatar
                          {...source}
                          size={45}
                          address={identity.did}
                          type={'circle'}
                          gravatarType={'retro'}
                        />
                      }
                    >
                      {identity.shortDid}
                    </ListItem>
                  </Container>
                )
              })}
          <Container padding alignItems={'center'} dividerTop>
            <Button
              iconButton
              buttonText={'Create identity'}
              icon={
                <Icon
                  color={Colors.CONFIRM}
                  icon={{ name: 'ios-add-circle', iconFamily: 'Ionicons' }}
                />
              }
              onPress={() => createIdentity()}
            />
          </Container>
        </ScrollView>
      )}
    </BottomSheet>
  )
}

export default Switcher
