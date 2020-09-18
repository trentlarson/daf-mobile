import { agent } from '../lib/setup'

const claimToObject = (arr: any[]) => {
  return arr.reduce(
    (obj, item) => Object.assign(obj, { [item.type]: item.value }),
    {},
  )
}
const shortId = (did: string) => `${did.slice(0, 15)}...${did.slice(-4)}`

const getMessageWithSdr = async ({
  messageId,
  did,
}: {
  messageId: string
  did: string
}) => {
  const message = await agent.dataStoreORMGetMessages({
    where: [{ column: 'id', value: [messageId] }],
  })
  const sdr = await agent.getVerifiableCredentialsForSdr({
    sdr: message[0].data,
    did,
  })

  const sdrWithProfiles = await Promise.all(
    sdr.map(async (sd: any) => {
      return {
        ...sd,
        credentials: await Promise.all(
          sd.credentials.map(async (vc: any, i: number) => {
            return await credentialProfile(vc, i)
          }),
        ),
      }
    }),
  )

  return await transformMessage(message[0], did, sdrWithProfiles)
}

const transformMessage = async (message: any, did: string, sdr?: any) => {
  return {
    ...message,
    viewer: await getProfile({ subject: did }),
    from: await getProfile({ subject: message.from }),
    ...(message.to ? { to: await getProfile({ subject: message.to }) } : {}),
    credentials: await Promise.all(
      message.credentials.map(async (vc: any, i: number) => {
        return await credentialProfile(vc, i)
      }),
    ),
    sdr,
  }
}

const getActivityWithProfiles = async ({ did }: { did: string }) => {
  const messages = await agent.dataStoreORMGetMessages({
    order: [{ column: 'createdAt', direction: 'DESC' }],
  })
  return await Promise.all(
    messages.map(async (message: any) => {
      return await transformMessage(message, did)
    }),
  )
}

const getManagedIdentitiesWithProfiles = async () => {
  const identities = await agent.identityManagerGetIdentities()

  return await Promise.all(
    identities.map(async (ids: any) => {
      return await getProfile({ subject: ids.did })
    }),
  )
}

const getIdentitiesWithProfiles = async () => {
  const identities = await agent.dataStoreORMGetIdentities()

  return await Promise.all(
    identities.map(async (ids: any) => {
      return await getProfile({ subject: ids.did })
    }),
  )
}

const getGetCredentialsWithProfiles = async (args?: any) => {
  const credentials = await agent.dataStoreORMGetVerifiableCredentials({
    ...args,
  })

  return Promise.all(
    credentials.map(async (vc: any, index: number) => {
      return await credentialProfile(vc, index)
    }),
  )
}

const getCredentialsFromRequestMessage = async ({ msg }: any) => {
  return await Promise.all(
    msg.credentials.map(async (vc: any, i: number) => {
      return await credentialProfile(vc, i)
    }),
  )
}

const credentialProfile = async (vc: any, index: number) => {
  return {
    hash: `00${index + 1}`,
    iss: await getProfile({ subject: vc.issuer.id }),
    sub: await getProfile({ subject: vc.credentialSubject.id }),
    fields: Object.keys(vc.credentialSubject)
      .map((key, i) => {
        return (
          key !== 'id' && {
            type: key,
            value: vc.credentialSubject[key],
            isObject: vc.credentialSubject[key] === typeof Object,
          }
        )
      })
      .filter((i) => i),
    raw: vc.proof.jwt,
  }
}

const getProfile = async ({
  subject,
  fields,
}: {
  subject: string
  fields?: string[]
}) => {
  const _fields = fields || ['name', 'firstname', 'lastname', 'profileImage']
  const all = await agent.dataStoreORMGetVerifiableCredentialsByClaims({
    where: [
      { column: 'subject', value: [subject] },
      { column: 'type', value: _fields },
    ],
  })

  const selectedFields = Object.assign(
    {},
    ..._fields.map((f) => {
      return {
        [f]: all
          .filter((a) => a.credentialSubject[f])
          .sort(
            (a, b) => parseInt(b.issuanceDate) - parseInt(a.issuanceDate),
          )[0]?.credentialSubject[f],
      }
    }),
  )

  const managedIdentities = await (
    await agent.identityManagerGetIdentities()
  ).map((identity: any) => {
    return identity.did
  })

  return {
    did: subject,
    shortDid: shortId(subject),
    shortId: shortId(subject),
    isManaged: managedIdentities.indexOf(subject) > -1,
    ...selectedFields,
  }
}

const issueCredential = async (iss: string, sub: string, claims: any[]) => {
  return await agent.createVerifiableCredential({
    credential: {
      issuer: { id: iss },
      issuanceDate: new Date().toISOString(),
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: { id: sub, ...claimToObject(claims) },
    },
    proofFormat: 'jwt',
    save: true,
  })
}

export {
  agent,
  issueCredential,
  getProfile,
  credentialProfile,
  getMessageWithSdr,
  getGetCredentialsWithProfiles,
  getActivityWithProfiles,
  getIdentitiesWithProfiles,
  getManagedIdentitiesWithProfiles,
  getCredentialsFromRequestMessage,
}
