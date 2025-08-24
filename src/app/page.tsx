'use client'

import TopBar from '@/components/TopBar'
import {
  Button,
  Checkbox,
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Textarea,
} from '@headlessui/react'
import clsx from 'clsx'
import {
  ArrowPathIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  useAccount,
  usePrepareTransactionRequest,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { formatEther, isAddress, parseEther, toHex } from 'viem'
import Link from 'next/link'

function App() {
  const { address, addresses } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const publicClient = usePublicClient()

  const [from, setFrom] = useState('Select a wallet')
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tip, setTip] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (address) setFrom(address)
  }, [address])

  const { data: txRequest, isFetching } = usePrepareTransactionRequest({
    account: from as `0x${string}`,
    to: to as `0x${string}`,
    data: toHex(message),
    value: tip ? parseEther(value) : 0n,
  })

  const sendMessage = async () => {
    if (!from || !isAddress(from)) {
      toast.error('Please select a wallet.')
      return
    }
    if (!to) {
      toast.error('Please enter a to address.')
      return
    }
    if (!isAddress(to)) {
      toast.error('Please enter a valid to address.')
      return
    }
    if (!message.trim()) {
      toast.error('Please enter a message.')
      return
    }

    setIsLoading(true)
    try {
      if (txRequest)
        await toast.promise(
          (async () => {
            const hash = await sendTransactionAsync(txRequest)
            await publicClient?.waitForTransactionReceipt({ hash })
          })(),
          {
            loading: 'Sending message...',
            success: 'Message sent successfully!',
            error: 'Failed to send message.',
          },
        )
      else throw new Error('Simulation failed.')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Fieldset className="rounded-xl bg-white dark:bg-white/5 backdrop-blur-2xl p-8 shadow-md w-full max-w-md">
            <Legend className="text-2xl font-bold mb-6 text-center">
              Send an IDM
            </Legend>
            <div className="space-y-4">
              <Field>
                <Label className="text-sm/6 font-medium">From</Label>
                <Listbox value={from} onChange={setFrom}>
                  <ListboxButton
                    className={clsx(
                      'flex items-center relative mt-3 w-full rounded-lg bg-black/5 dark:bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-black dark:text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 dark:data-[focus]:outline-white/25 overflow-hidden text-ellipsis',
                    )}
                  >
                    <span className='flex-1 w-0 truncate'>{from}</span>
                    <ChevronDownIcon
                      className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                      aria-hidden="true"
                    />
                  </ListboxButton>
                  <ListboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                      'w-[var(--button-width)] rounded-xl border border-black/5 dark:border-white/5 bg-neutral-200 dark:bg-neutral-800 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none',
                      'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
                    )}
                  >
                    {(addresses || []).map((address, index) => (
                      <ListboxOption
                        key={address}
                        value={address}
                        className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10 dark:data-[focus]:bg-white/10"
                      >
                        <CheckIcon className="invisible size-4 fill-black dark:fill-white group-data-[selected]:visible" />
                        <div className="text-sm/6 text-black dark:text-white w-full overflow-hidden text-ellipsis">
                          {address}
                        </div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Listbox>
              </Field>

              <Field>
                <Label className="text-sm/6 font-medium">To</Label>
                <Input
                  className={clsx(
                    'mt-3 block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 dark:data-[focus]:outline-white/25',
                  )}
                  value={to}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTo(e.target.value)
                  }
                />
              </Field>

              <Field>
                <Label className="text-sm/6 font-medium">Message</Label>
                <Textarea
                  className={clsx(
                    'mt-3 block w-full resize-none rounded-lg border-none bg-black/5 dark:bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 dark:data-[focus]:outline-white/25',
                  )}
                  rows={4}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMessage(e.target.value)
                  }
                />
              </Field>
              <Field className="flex items-center gap-2">
                <Checkbox
                  checked={tip}
                  onChange={setTip}
                  className="group size-6 rounded-md bg-black/10 dark:bg-white/10 p-1 ring-1 ring-black/15 dark:ring-white/15 ring-inset dark:data-[checked]:bg-white"
                >
                  <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
                </Checkbox>
                <Label>Tip</Label>
              </Field>

              {tip && (
                <Field>
                  <Label className="text-sm/6 font-medium">Amount (ETH)</Label>
                  <Input
                    className={clsx(
                      'mt-3 block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white',
                      'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25 dark:data-[focus]:outline-white/25',
                    )}
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValue(e.target.value)
                    }
                    type="number"
                  />
                </Field>
              )}

              <div className="flex flex-row items-center text-sm text-neutral-600 dark:text-neutral-400">
                Gas Fee:&nbsp;
                {isFetching && (
                  <div className="animate-spin">
                    <ArrowPathIcon className="size-4" />
                  </div>
                )}
                {!isFetching &&
                  ` ${
                    txRequest
                      ? txRequest.maxFeePerGas * txRequest.gas <
                        100000000000000n
                        ? '<0.0001'
                        : `~${Number.parseFloat(
                            formatEther(txRequest.maxFeePerGas * txRequest.gas),
                          ).toFixed(4)}`
                      : '-'
                  } ETH`}
                {!isFetching && !txRequest && (
                  <span className="text-red-500/80">
                    &nbsp;(likely to fail)
                  </span>
                )}
              </div>

              <Button
                className="w-full justify-center inline-flex items-center gap-2 rounded-md bg-neutral-300 dark:bg-neutral-700 py-1.5 px-3 text-sm/6 font-semibold text-black dark:text-white shadow-inner shadow-white/90 dark:shadow-white/10 focus:outline-none data-[hover]:bg-neutral-200 dark:data-[hover]:bg-neutral-600 data-[open]:bg-neutral-300 dark:data-[open]:bg-neutral-700 data-[focus]:outline-1 data-[focus]:outline-black dark:data-[focus]:outline-white"
                onClick={sendMessage}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </Fieldset>
        </div>
        <footer className="relative justify-center my-8 flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <Link
              className="underline"
              href="https://github.com/codeninja819/idm.to"
              target="_blank"
            >
              GitHub
            </Link>
            <Link
              className="underline"
              href="https://etherscan.io/address/0x7488903781C6dF233E6f3f3845be65CE02d399bA"
              target="_blank"
            >
              Donate
            </Link>
          </div>
          <div className="text-toast-600">
            <span>&copy; 2024 IDM.TO</span>
            <span>&nbsp;&middot;&nbsp;</span>
            <span>
              <span>Built by </span>
              <Link
                className="underline"
                href="https://x.com/codeninja819"
                target="_blank"
              >
                codeninja819.eth
              </Link>
            </span>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
