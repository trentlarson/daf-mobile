import { Core, Message } from 'daf-core'
import AsyncStorage from '@react-native-community/async-storage'
import iCloudStorage from 'react-native-icloudstore'

export interface Context {
  core: Core
  dataStore: any
}

const isSelected = async (identity: any, args: any, ctx: Context) => {
  const did = await AsyncStorage.getItem('selectedDid')
  return identity.did === did
}

const setViewer = async (_: any, args: { did: string }, ctx: Context) => {
  return await AsyncStorage.setItem('selectedDid', args.did)
}

const restoreCloudBackup = async (_: any, args: any, ctx: Context) => {
  const cloudIdentities = await iCloudStorage.getItem(
    'CLOUD:RINKEBY-IDENTITY-STORE',
  )
  const cloudKeys = await iCloudStorage.getItem('CLOUD:RINKEBY-KEYSTORE')
  const rawMessages = await iCloudStorage.getItem('CLOUD:MESSAGES')

  if (cloudIdentities && cloudKeys) {
    await AsyncStorage.setItem('rinkeby-identity-store', cloudIdentities)
    await AsyncStorage.setItem('rinkeby-keystore', cloudKeys)
    await AsyncStorage.setItem('iCloudBackup', 'true')

    if (rawMessages) {
      const messages = JSON.parse(rawMessages).map((message: any) => {
        return new Message({
          raw: message,
          meta: {
            type: 'iCloud',
          },
        })
      })

      await ctx.core.validateMessages(messages)
      return true
    } else {
      return true
    }
  }
}

const runCloudBackup = async (_: any, args: any, ctx: Context) => {
  const messages = await ctx.dataStore.findMessages({})
  const rawMessages = messages.map((message: any) => message.raw)
  const localIdentities = await AsyncStorage.getItem('rinkeby-identity-store')
  const localKeys = await AsyncStorage.getItem('rinkeby-keystore')

  if (localIdentities && localKeys) {
    await iCloudStorage.setItem('CLOUD:RINKEBY-KEYSTORE', localKeys)
    await iCloudStorage.setItem('CLOUD:RINKEBY-IDENTITY-STORE', localIdentities)
    await AsyncStorage.setItem('iCloudBackup', 'true')
    console.log('Identities: ', Object.keys(JSON.parse(localIdentities)).length)
    console.log('Messages: ', rawMessages.length)
    if (rawMessages) {
      await iCloudStorage.setItem('CLOUD:MESSAGES', JSON.stringify(rawMessages))
    }

    return true
  }
}

const disableCloudBackup = async (_: any, args: any, ctx: Context) => {
  await iCloudStorage.removeItem('CLOUD:RINKEBY-KEYSTORE')
  await iCloudStorage.removeItem('CLOUD:RINKEBY-IDENTITY-STORE')
  await iCloudStorage.removeItem('CLOUD:MESSAGES')

  await AsyncStorage.removeItem('iCloudBackup')

  return true
}

const hasCloudBackupPref = async (_: any, args: any, ctx: Context) => {
  const hasbackupPref = await AsyncStorage.getItem('iCloudBackup')
  return hasbackupPref === 'true'
}

const hasCloudBackup = async (_: any, args: any, ctx: Context) => {
  const cloudIdentities = await iCloudStorage.getItem(
    'CLOUD:RINKEBY-IDENTITY-STORE',
  )
  const cloudKeys = await iCloudStorage.getItem('CLOUD:RINKEBY-KEYSTORE')

  if (cloudIdentities && cloudKeys) {
    return true
  }

  return false
}

const viewer = async (_: any, args: any, ctx: Context) => {
  const did = await AsyncStorage.getItem('selectedDid')
  if (did !== null) {
    return {
      did,
      __typename: 'Identity',
    }
  } else {
    // Check if there are any identities in the core.
    // Set the first one as viewer by default
    const identities = await ctx.core.identityManager.getIdentities()
    if (identities.length > 0) {
      await AsyncStorage.setItem('selectedDid', identities[0].did)
      return {
        did: identities[0].did,
        __typename: 'Identity',
      }
    }
  }
}

export const resolvers = {
  Identity: {
    isSelected,
  },
  Query: {
    viewer,
    hasCloudBackup,
    hasCloudBackupPref,
  },
  Mutation: {
    setViewer,
    restoreCloudBackup,
    runCloudBackup,
    disableCloudBackup,
  },
}

export const typeDefs = `
  extend type Identity {
    isSelected: Boolean
  }
  extend type Query {
    viewer: Identity
    hasCloudBackup: Boolean
    hasCloudBackupPref: Boolean
  }
  extend type Mutation {
    setViewer(did: String): Boolean
    restoreCloudBackup: Boolean
    runCloudBackup: Boolean
    disableCloudBackup: Boolean
  }
`
