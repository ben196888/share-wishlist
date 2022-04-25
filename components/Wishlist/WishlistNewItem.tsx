import { AddIcon } from '@chakra-ui/icons'
import { HStack, IconButton, Input } from '@chakra-ui/react'
import { ChangeEventHandler, FC, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useWishlistItems } from './use-wishlist'

export type WishlistNewItemProps = {
  isDisabled?: boolean
}

const WishlistNewItem: FC<WishlistNewItemProps> = () => {
  const { setItems } = useWishlistItems()

  const [newItem, setNewItem] = useState<string>('')
  const onUpdateValue: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setNewItem(event.target.value)
  }, [setNewItem])
  const onAppendItem = useCallback((event) => {
    event.preventDefault();
    setItems(items => [...items, { id: uuidv4(), name: newItem, status: 'open' }])
    setNewItem('')
  }, [setItems, newItem, setNewItem])

  return (
    <form onSubmit={onAppendItem}>
      <HStack>
        <Input required pattern='^(?!\s*$).+' placeholder='new wish item' onChange={onUpdateValue} value={newItem} />
        <IconButton size='sm' aria-label='add item' colorScheme='teal' icon={<AddIcon />} onClick={onAppendItem} />
      </HStack>
    </form>
  )
}

WishlistNewItem.displayName = 'WishlistNewItem'

export default WishlistNewItem
