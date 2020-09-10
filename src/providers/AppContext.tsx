import React, { useState, createContext, useEffect } from 'react'
import Debug from 'debug'
import { agent } from '../lib/setup'
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
    agent.identityManagerGetIdentities,
  )
  const { state: messages, request: getMessages } = useAgent(
    agent.dataStoreORMGetMessages,
  )

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

  const AppState = {}

  return (
    <AppContext.Provider
      value={{
        // Data
        selectedIdentity,
        identities,
        messages,
        // Methods
        getIdentities,
        getMessages,
        setSelectedIdentity,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}
