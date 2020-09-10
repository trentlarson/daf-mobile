import { useState, useEffect, useCallback } from 'react'
import { resolve } from 'url'

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
    let data
    try {
      data = await method(options)
      setState({ status: 'complete', error: null, data })
    } catch (error) {
      setState({ status: 'error', error, data: null })
    }
  }

  const request = () => {
    doRequest(options)
  }

  useEffect(() => {
    if (prefetch) {
      request()
    }
  }, [])

  return { state, request }
}

export default useAgent
