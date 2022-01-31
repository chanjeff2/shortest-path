import { FormControlLabel, Switch } from '@mui/material'
import { useTheme } from 'next-themes'
import { useContext, useEffect, useState } from 'react'
import { ColorModeContext } from '../pages/_app'

export const ThemeChanger = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const colorMode = useContext(ColorModeContext);

    // When mounted on client, now we can show the UI
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <FormControlLabel
            label="Dark Mode"
            control={
                <Switch
                    defaultChecked
                    onChange={event => {
                        setTheme(event.target.checked ? "dark" : "light")
                        colorMode.toggleColorMode()
                    }}
                />
            }
        />
    )
}