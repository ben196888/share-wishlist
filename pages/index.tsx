import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Editable, EditableInput, EditablePreview, Heading, HStack, IconButton, Input, Link, Text, VStack } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Item = {
  id: string
  name: string
  status: 'open' | 'reserved' | 'closed'
}

export default function Home() {
  const initialState = []
  const [items, setItems] = useState<Item[]>(initialState)
  useEffect(() => {
    let items
    if (typeof window !== 'undefined') {
      items = JSON.parse(window.localStorage.getItem('items'))
    }
    if (items) {
      setItems(items)
    }
  }, [])
  useEffect(() => {
    if (items !== initialState) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('items', JSON.stringify(items))
      }
    }
  }, [items])

  const removeItem = (index) => {
    setItems(prevItems => {
      const nextItems = prevItems.slice()
      nextItems.splice(index, 1)
      return nextItems
    })
  }

  const renderItems = (items: Item[]) => items.map((item, index) => (
    <HStack key={item.id}>
      <Editable value={item.name} selectAllOnFocus={false}>
        <EditablePreview />
        <EditableInput />
      </Editable>
      <IconButton aria-label='delete item' icon={<DeleteIcon />} onClick={() => removeItem(index)} />
    </HStack>
  ))

  const [newItem, setNewItem] = useState<string>('')
  const onUpdateValue = (event) => {
    setNewItem(event.target.value)
  }
  const onAppendItem = (event) => {
    event.preventDefault();
    setItems(items => [...items, { id: uuidv4(), name: newItem, status: 'open' }])
    setNewItem('')
  }

  return (
    <Box>
      <Head>
        <title>Share My Wishlist</title>
        <meta name="description" content="Share my wishlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as='main'>
        <Center>
          <Heading as='h1' size='4xl'>
            Wishlist
          </Heading>
        </Center>

        <VStack>
          <form onSubmit={onAppendItem}>
            <HStack>
              <Input placeholder='new wish item' onChange={onUpdateValue} value={newItem} />
              <IconButton aria-label='add item' colorScheme='teal' icon={<AddIcon />} onClick={onAppendItem}>New</IconButton>
            </HStack>
          </form>
          {renderItems(items)}
        </VStack>
      </Box>

      <Center as='footer'>
        <Box>
          Powered by{' '}
          <Link href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" isExternal>

            <Box as='span'>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </Box>
          </Link>
        </Box>
      </Center>
    </Box>
  )
}
