import { AddIcon, DeleteIcon, LinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Spacer,
  VStack,
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useLocalStorage, useCopyToClipboard } from 'usehooks-ts'
import { v4 as uuidv4 } from 'uuid'
import useWishlist from '../hooks/useWishlist'
import useShareLink from '../hooks/useShareLink'
import useFlowWithToast from '../hooks/useFlowWithToast'
import type { ShareWishlist } from '../types'
import useLayout from '../hooks/useLayout'

export default function Home() {
  const { Layout } = useLayout()
  const [items, setItems] = useLocalStorage<ShareWishlist.Item[]>('items', [])

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

  const { saveWishlist } = useWishlist()

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
    <Layout.Container>
      <Layout.Title />
      <Layout.Header />
      <Layout.Main>
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
      </Layout.Main>

      <Layout.Footer />
    </Layout.Container>
  )
}
