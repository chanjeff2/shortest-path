import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    text: {
      primary: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
      secondary: `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--foreground')}, 0.87)`,
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <MuiThemeProvider theme={theme}>
        <Component {...pageProps} />
      </MuiThemeProvider>
    </ThemeProvider>
  )
}

export default MyApp
