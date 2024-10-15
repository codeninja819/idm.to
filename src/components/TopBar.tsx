'use client'

import Link from 'next/link'
import { Button } from '@headlessui/react'
import { SunIcon, MoonIcon } from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'

function TopBar() {
  const { theme, setTheme } = useTheme()

  const toggleDarkMode = () => {
    if (theme === 'dark') setTheme('light')
    else setTheme('dark')
  }

  return (
    <>
      <div className="w-full shadow-md bg-white dark:bg-white/5">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              IDM.TO
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/codeninja819/idm.to"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary"
              target="_blank"
            >
              GitHub
            </Link>
            <Button onClick={toggleDarkMode}>
              {theme === 'light' ? (
                <SunIcon className="size-5" />
              ) : (
                <MoonIcon className="size-5" />
              )}
            </Button>
            <w3m-button />
          </div>
        </div>
      </div>
    </>
  )
}

export default TopBar
