import { FormControlLabel, Switch } from '@mui/material'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const ThemeChanger = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    // When mounted on client, now we can show the UI
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <FormControlLabel control={<Switch onChange={event => setTheme(event.target.checked ? "dark" : "light")} />} label="Dark Mode" />
    )
}