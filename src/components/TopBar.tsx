'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@headlessui/react'
import { SunIcon, MoonIcon } from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'
import Logo from './Logo'

function TopBar() {
  const { theme, setTheme } = useTheme()

  const toggleDarkMode = () => {
    if (theme === 'dark') setTheme('light')
    else setTheme('dark')
  }

  return (
    <>
      <header className="w-full shadow-md bg-white dark:bg-white/5">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex space-x-1 text-2xl font-bold text-primary"
            >
              <Logo width="32" height="32" />
              <span>IDM.TO</span>
            </Link>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link
              href="https://github.com/codeninja819/idm.to"
              className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 hover:text-primary"
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
      </header>
    </>
  )
}

export default TopBar
