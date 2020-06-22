import React, { useState, createContext, useContext, useEffect } from 'react'
import { ThemeProvider } from '@kancha/kancha-ui'
import createTheme from './theme'

// import { Appearance } from 'react-native'

interface ThemeState {
  themeType: string
}

export const SwitchContext = createContext<ThemeState | any>({})

export const SwitchProvider = ({ children }: any) => {
  //   const colorScheme = Appearance.getColorScheme()
  const [themeType, setThemeType] = useState('light')
  const [theme, setTheme] = useState(createTheme(themeType))

  const switchTheme = (type: string) => {
    setThemeType(type)
    setTheme(createTheme(type))
  }

  return (
    <SwitchContext.Provider value={[themeType, switchTheme]}>
      <ThemeProvider theme={theme}>{children(themeType)}</ThemeProvider>
    </SwitchContext.Provider>
  )
}

export const useSwitch = () => {
  const [themeType, switchTheme] = useContext(SwitchContext)
  return [themeType, switchTheme]
}
