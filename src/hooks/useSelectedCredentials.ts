import { useState, useEffect } from 'react'

interface ValidationState {
  [index: string]: {
    required: boolean
    jwt: string | null
  }
}

const useSelectedCredentials = (message: any) => {
  const [selected, setSelected] = useState<ValidationState>({})
  const [valid, setValid] = useState<boolean>(true)

  const onSelect = (
    id: string | null,
    jwt: string | null,
    claimType: string,
  ) => {
    const newState = {
      ...selected,
      [claimType]: { ...selected[claimType], jwt },
    }

    setSelected(newState)
  }

  const checkValidity = () => {
    let valid = true
    Object.keys(selected).map((key) => {
      if (selected[key].required && !selected[key].jwt) {
        valid = false
      }
    })

    setValid(valid)
  }

  useEffect(() => {
    checkValidity()
  }, [selected])

  useEffect(() => {
    if (message) {
      let defaultSelected: ValidationState = {}
      message.sdr.map((sdr: any) => {
        if (sdr && sdr.essential) {
          if (sdr.credentials.length) {
            defaultSelected[sdr.claimType] = {
              required: true,
              jwt: sdr.credentials[0].raw,
            }
          } else {
            defaultSelected[sdr.claimType] = {
              required: true,
              jwt: null,
            }
            setValid(false)
          }
        }
      })
      setSelected(defaultSelected)
    }
  }, [message])

  return { selected, valid, onSelect }
}

export default useSelectedCredentials
