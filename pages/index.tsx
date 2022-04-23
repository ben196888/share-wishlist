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
import { useCallback, useState } from 'react'
import { useLocalStorage, useCopyToClipboard } from 'usehooks-ts'
import { v4 as uuidv4 } from 'uuid'
import useSaveWishlist from '../hooks/useSaveWishlist'
import useShareLink from '../hooks/useShareLink'
import useFlowWithToast from '../hooks/useFlowWithToast'
import type { ShareWishlist } from '../types'

export default function Home() {
  const initialState = []
  const [items, setItems] = useLocalStorage<ShareWishlist.Item[]>('items', initialState)

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

  const renderItems = (items: ShareWishlist.Item[]) => items.map((item, index) => (
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

  const saveWishlist = useSaveWishlist()

  const saveFlow = useCallback(async () => {
    await saveWishlist(items)
  }, [saveWishlist, items])

  const onSave = useFlowWithToast(
    { title: 'Wishlist saved.' },
    { title: 'Wishlist save failure.' },
    saveFlow,
  )

  const { getShareLink } = useShareLink()
  const [copiedText, copy] = useCopyToClipboard()

  const shareLinkFlow = useCallback(async () => {
    const wishlist = await saveWishlist(items)
    const shareLink = await getShareLink(wishlist)
    await copy(shareLink)
    return shareLink
  }, [saveWishlist, items, getShareLink, copy])

  const onShareLink = useFlowWithToast(
    { title: 'Share link is copied in the clipboard.', description: shareLink => shareLink },
    { title: 'Share link create failure.' },
    shareLinkFlow,
  )

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
                <Button mr='-px' onClick={onSave}>Save</Button>
                <IconButton aria-label='get share link' icon={<LinkIcon />} onClick={onShareLink} />
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
