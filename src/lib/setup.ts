import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
// import { resolver as naclDidResolver } from 'nacl-did'
// import webDidResolver from 'web-did-resolver'

import * as Daf from './packages/daf-core'
import * as DidJwt from './packages/daf-did-jwt'
import RnEthrDidController from './rn-packages/rn-identity-controller'

import * as W3c from './packages/daf-w3c'
import * as SD from './packages/daf-selective-disclosure'
import * as TG from './packages/daf-trust-graph'
import * as DBG from './packages/daf-debug'
// import * as DIDComm from './packages/daf-did-comm'

import RnSqlite from './rn-packages/db-driver-rn-sqlite3'
import { DataStore } from './packages/daf-data-store'

import Debug from 'debug'
Debug.enable('*')
const debug = Debug('main')

// DID Document Resolver
// const web = webDidResolver.getResolver()
const didResolver = new Resolver({
  ...ethrDidResolver({
    rpcUrl: 'https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c',
  }),
  // ...web,
  // https: web.web,
  // nacl: naclDidResolver
})

const identityControllers = [new RnEthrDidController()]

const messageValidator = new DBG.MessageValidator()
messageValidator
  // .setNext(new DIDComm.MessageValidator())
  .setNext(
    new DidJwt.MessageValidator({
      payloadValidators: [
        new W3c.PayloadValidator(),
        new SD.PayloadValidator(),
      ],
    }),
  )

const actionHandler = new DBG.ActionHandler()
actionHandler
  // .setNext(new DIDComm.ActionHandler())
  .setNext(
    new TG.ActionHandler({
      uri: 'http://0.0.0.0:3000/graphql',
    }),
  )
  .setNext(new W3c.ActionHandler())
  .setNext(new SD.ActionHandler())

const serviceControllersWithConfig = [
  // { controller: Rnd.RandomMessageService, config: {}},
  {
    controller: TG.TrustGraphServiceController,
    config: {
      uri: 'https://mouro.eu.ngrok.io/graphql',
      wsUri: 'wss://mouro.eu.ngrok.io/graphql',
    },
  },
]

export const core = new Daf.Core({
  identityControllers,
  serviceControllersWithConfig,
  didResolver,
  messageValidator,
  actionHandler,
})

export const db = new RnSqlite('database.sqlite3')
export const dataStore = new DataStore(db)

core.on(
  Daf.EventTypes.validatedMessage,
  async (eventType: string, message: Daf.Types.ValidatedMessage) => {
    debug('New message %O', message)
    await dataStore.saveMessage(message)
  },
)
