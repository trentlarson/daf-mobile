import React, { useState, createContext, useEffect } from 'react'
import Debug from 'debug'
import {
  agent,
  msgHandler,
  getActivityWithProfiles,
  getIdentitiesWithProfiles,
  getManagedIdentitiesWithProfiles,
} from '../services/daf'
import AsyncStorage from '@react-native-community/async-storage'
import useAgent from '../hooks/useAgent'

const debug = Debug('daf-provider:app-state')

interface AppState {
  selectedIdentity: any
}

export const AppContext = createContext<AppState | any>({})

export const AppProvider = (props: any) => {
  // --------------
  // State
  const [selectedIdentity, setSelectedDid] = useState<string | null>(null)
  // --------------
  // State from hooks
  const { state: identities, request: getIdentities } = useAgent(
    getIdentitiesWithProfiles,
  )

  const { state: managedIdentities, request: getManagedIdentities } = useAgent(
    getManagedIdentitiesWithProfiles,
  )

  const {
    state: messages,
    request: getMessages,
  } = useAgent(getActivityWithProfiles, { did: selectedIdentity })

  const createIdentity = async () => {
    await agent.identityManagerCreateIdentity({
      kms: 'local',
      provider: 'did:ethr:rinkeby',
    })

    getManagedIdentities()
  }

  // --------------

  const setSelectedIdentity = async (did: string) => {
    await AsyncStorage.setItem('selectedIdentity', did)
    setSelectedDid(did)
  }

  useEffect(() => {
    const setDefaultIdentity = async () => {
      const storedSelectedIdentity = await AsyncStorage.getItem(
        'selectedIdentity',
      )

      debug('Stored Identity', storedSelectedIdentity)

      if (!storedSelectedIdentity) {
        if (identities.data && identities.data.length > 0) {
          await AsyncStorage.setItem('selectedIdentity', identities.data[0].did)
          setSelectedIdentity(identities.data[0].did)
        }
      } else {
        setSelectedDid(storedSelectedIdentity)
      }
    }

    setDefaultIdentity()
  }, [])

  useEffect(() => {
    getMessages()
  }, [selectedIdentity])

  useEffect(() => {
    msgHandler.on('validatedMessage', (msg: any) => {
      getMessages()
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        // Data
        selectedIdentity,
        identities,
        managedIdentities,
        messages,
        // Methods
        getIdentities,
        createIdentity,
        getManagedIdentities,
        getMessages,
        setSelectedIdentity,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}
