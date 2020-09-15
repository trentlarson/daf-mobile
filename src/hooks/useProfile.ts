import { useState, useEffect } from 'react'
import useAgent from '../hooks/useAgent'
import { agent } from '../services/daf'

const useProfile = (did: string) => {
  // @Todo
  // Aggreagte requests to build a profile

  // const [state, setState] = useState<{
  //   status: string
  //   error: any
  //   data: any
  // }>({
  //   status: 'loading',
  //   error: null,
  //   data: null,
  // })

  // const getProfile = async () => {
  //   const credentials = await agent.dataStoreORMGetVerifiableCredentialsByClaims(
  //     {
  //       where: [
  //         { column: 'subject', value: [did] },
  //         { column: 'type', value: ['firstname', 'lastname', 'profileImage'] },
  //       ],
  //     },
  //   )

  //   console.log(credentials)
  // }

  const profile = {
    did,
    shortDid: did,
    firstname: 'Jim',
    lastname: 'Bean',
    profileImage: undefined,
  }

  return { profile, loading: false }
}

export default useProfile
