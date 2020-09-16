import { useState, useEffect } from 'react'

const useAgent = (method: any, options?: any, prefetch = true) => {
  const [state, setState] = useState<{
    status: string
    error: any
    data: any
  }>({
    status: 'loading',
    error: null,
    data: null,
  })

  const doRequest = async (options: any) => {
    setState({ status: 'loading', error: null, data: null })
    try {
      const data = await method(options)
      if (data) {
        setState({ status: 'complete', error: null, data })
      }
    } catch (error) {
      setState({ status: 'error', error, data: null })
    }
  }

  const request = (opts?: any) => {
    doRequest(opts || options)
  }

  useEffect(() => {
    if (prefetch) {
      request()
    }
  }, [])

  return { state, loading: state.status === 'loading', request }
}

export default useAgent
