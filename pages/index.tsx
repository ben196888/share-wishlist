import { AddIcon, DeleteIcon, LinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
  Spacer,
  VStack,
} from '@chakra-ui/react'
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

  const removeItemCreator = (index) => () => {
    setItems(prevItems => {
      const nextItems = prevItems.slice()
      nextItems.splice(index, 1)
      return nextItems
    })
  }

  const updateItemCreator = (index) => (event) => {
    setItems(prevItems => {
      const nextItems = prevItems.slice()
      nextItems[index].name = event.target.value
      return nextItems
    })
  }

  const renderItems = (items: Item[]) => items.map((item, index) => (
    <HStack key={item.id}>
      <Editable css={{ width: '100%' }} value={item.name} selectAllOnFocus={false}>
        <EditablePreview css={{ width: '100%' }} />
        <EditableInput onChange={updateItemCreator(index)} />
      </Editable>
      <IconButton aria-label='delete item' icon={<DeleteIcon />} onClick={removeItemCreator(index)} />
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
          <Flex w='xs' align='center'>
            <Box>
              <Heading as='h2'>My wishlist</Heading>
            </Box>
            <Spacer />
            <Box>
              <ButtonGroup size='sm' isAttached variant='outline'>
                <Button mr='-px'>Save</Button>
                <IconButton aria-label='get share link' icon={<LinkIcon />} />
              </ButtonGroup>
            </Box>
          </Flex>
          <Box>
            <form onSubmit={onAppendItem}>
              <HStack>
                <Input placeholder='new wish item' onChange={onUpdateValue} value={newItem} />
                <IconButton aria-label='add item' colorScheme='teal' icon={<AddIcon />} onClick={onAppendItem}>New</IconButton>
              </HStack>
            </form>
            {renderItems(items)}
          </Box>
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
