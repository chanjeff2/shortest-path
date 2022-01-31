import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { createTheme, Theme, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    let theme = createTheme({
      palette: {
        text: {
          primary: window.getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
          secondary: `rgba(${window.getComputedStyle(document.documentElement).getPropertyValue('--foreground')}, 0.87)`,
        }
      }
    })
    setTheme(theme)
  })

  if (theme) {
    return (
      <ThemeProvider>
        <MuiThemeProvider theme={theme}>
          <Component {...pageProps} />
        </MuiThemeProvider>
      </ThemeProvider>
    )
  } else {
    return (
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }


}

export default MyApp
