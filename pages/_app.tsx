import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { createTheme, Theme, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { createContext, useEffect, useState } from 'react'

interface ColorModeContextInterface {
  toggleColorMode: () => void
}

export const ColorModeContext = createContext<ColorModeContextInterface>({ toggleColorMode: () => { } });

function getCssVar(property: string): string {
  return window.getComputedStyle(document.documentElement).getPropertyValue(property)
}

function getMuiTheme(): Theme {
  return createTheme({
    palette: {
      text: {
        primary: getCssVar('--foreground'),
        secondary: `rgba(${getCssVar('--foreground-inline')}, 0.7)`,
        disabled: `rgba(${getCssVar('--foreground-inline')}, 0.4)`,
      },
      action: {
        active: `rgba(${getCssVar('--foreground-inline')}, 0.5)`,
        hover: `rgba(${getCssVar('--foreground-inline')}, 0.04)`,
        selected: `rgba(${getCssVar('--foreground-inline')}, 0.12)`,
        disabled: `rgba(${getCssVar('--foreground-inline')}, 0.3)`,
        disabledBackground: `rgba(${getCssVar('--foreground-inline')}, 0.12)`,
      },
      background: {
        default: getCssVar('--background'),
        paper: getCssVar('--background'),
      },
      divider: `rgba(${getCssVar('--foreground-inline')}, 0.12)`,
    }
  })
}


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <MuiWrapper>
        <Component {...pageProps} />
      </MuiWrapper>
    </ThemeProvider>
  )
}

function MuiWrapper({ children }: { children: JSX.Element }) {
  const [mounted, setMounted] = useState(false)
  const [muiTheme, setMuiTheme] = useState<Theme | null>(null);

  const colorMode: ColorModeContextInterface = {
    toggleColorMode: () => {
      let theme = getMuiTheme()
      setMuiTheme(theme)
    }
  }

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (!muiTheme) {
    colorMode.toggleColorMode()
    return null
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={muiTheme!}>
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default MyApp
