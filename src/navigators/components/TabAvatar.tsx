import React, { useContext } from 'react'
import { Avatar } from '@kancha/kancha-ui'
import { ActivityIndicator } from 'react-native'
import { AppContext } from '../../providers/AppContext'
import { getProfile } from '../../services/daf'
import useAgent from '../../hooks/useAgent'

interface TabAvatarProps {
  tintColor?: string
}

export default ({ tintColor }: TabAvatarProps) => {
  const { selectedIdentity } = useContext(AppContext)
  const { state: profile, loading } = useAgent(getProfile, {
    subject: selectedIdentity,
  })

  const source =
    profile && profile.data && profile.data.profileImage
      ? { source: { uri: profile.data.profileImage } }
      : {}

  return loading ? (
    <ActivityIndicator />
  ) : (
    !loading && profile.data && (
      <Avatar
        {...source}
        backgroundColor={tintColor}
        border
        address={profile.data && profile.data.did}
        gravatarType={'retro'}
      />
    )
  )
}
