import { agent } from '../lib/setup'

const claimToObject = (arr: any[]) => {
  return arr.reduce(
    (obj, item) => Object.assign(obj, { [item.type]: item.value }),
    {},
  )
}
const shortId = (did: string) => `${did.slice(0, 15)}...${did.slice(-4)}`

const getActivityWithProfiles = async (args?: any) => {
  const messages = await agent.dataStoreORMGetMessages({ ...args })
  return await Promise.all(
    messages.map(async (message: any) => {
      return {
        ...message,
        viewer: await getProfile({ subject: message.to }),
        from: await getProfile({ subject: message.from }),
        to: await getProfile({ subject: message.to }),
        credentials: await Promise.all(
          message.credentials.map(async (vc: any) => {
            return await credentialProfile(vc)
          }),
        ),
      }
    }),
  )
}

const getGetCredentialsWithProfiles = async (args?: any) => {
  const credentials = await agent.dataStoreORMGetVerifiableCredentials({
    ...args,
  })

  return Promise.all(
    credentials.map(async (vc: any) => {
      return await credentialProfile(vc)
    }),
  )
}

const credentialProfile = async (vc: any) => {
  return {
    issuer: await getProfile({ subject: vc.issuer.id }),
    subject: await getProfile({ subject: vc.credentialSubject.id }),
    claims: Object.keys(vc.credentialSubject)
      .map((key) => {
        return (
          key !== 'id' && {
            type: key,
            value: vc.credentialSubject[key],
            isObject: vc.credentialSubject[key] === typeof Object,
          }
        )
      })
      .filter((i) => i),
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

  return {
    did: subject,
    shortDid: shortId(subject),
    shortId: shortId(subject),
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
  getGetCredentialsWithProfiles,
  getActivityWithProfiles,
}
