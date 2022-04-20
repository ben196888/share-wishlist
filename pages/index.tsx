import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from '../styles/Home.module.css'

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
  const renderItems = (items: Item[]) => items.map(item => <Text key={item.id}>{item.name}</Text>)

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

      <Box>
        <Heading as='h1' size='4xl'>
          Wishlist
        </Heading>

        <VStack>
          <form onSubmit={onAppendItem}>
            <HStack>
              <Input placeholder='new wish item' onChange={onUpdateValue} value={newItem} />
              <Button onClick={onAppendItem}>New</Button>
            </HStack>
          </form>
          {renderItems(items)}
        </VStack>
      </Box>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </Box>
  )
}
