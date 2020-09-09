import React, { useState, useEffect } from 'react'
import {
  ApolloProvider,
  ApolloLink,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client'
import { makeExecutableSchema } from 'graphql-tools'
import { SchemaLink } from 'apollo-link-schema'
import { createSchema, supportedMethods } from 'daf-graphql'
import { agent } from '../lib/setup'
import merge from 'lodash.merge'
import * as LocalGql from '../lib/graphql'
import Debug from 'debug'
const debug = Debug('daf-provider:apollo')

const { typeDefs: _typeDefs, resolvers: _resolvers } = createSchema({
  enabledMethods: Object.keys(supportedMethods),
})
const typeDefs = _typeDefs.concat(LocalGql.typeDefs)
const resolvers = merge(_resolvers, LocalGql.resolvers)
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const contextLink = new SchemaLink({
  schema,
  context: { agent },
})

const client = new ApolloClient({
  link: ApolloLink.from([contextLink]),
  cache: new InMemoryCache(),
  typeDefs,
  resolvers,
})

interface Props {}

export const Provider: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    // agent.on(Daf.EventTypes.savedMessage, async (message: Daf.Message) => {
    //   debug('New message %O', message)
    //   client.reFetchObservableQueries()
    // })
  }, [])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
