import { DeleteIcon } from '@chakra-ui/icons'
import { Editable, EditableInput, EditablePreview, HStack, IconButton } from '@chakra-ui/react'
import { ChangeEventHandler, FC, MouseEventHandler, useCallback } from 'react'
import { useWishlistItems } from './use-wishlist'

export type WishlistItemsProps = {
}

const WishlistItems: FC<WishlistItemsProps> = () => {
  const { isEditable, items, removeItemAt, updateItemAt } = useWishlistItems()

  const removeItemCreator: (index: number) => MouseEventHandler<HTMLButtonElement> = useCallback((index) => () => {
    removeItemAt(index)
  }, [removeItemAt])

  const updateItemCreator: (index: number) => ChangeEventHandler<HTMLInputElement> = useCallback((index) => (event) => {
    updateItemAt(index, { name: event.target.value })
  }, [updateItemAt])

  return (
    <>
      {items.map((item, index) => (
        <HStack key={item.id} mt='1'>
          <Editable w='100%' value={item.name} selectAllOnFocus={false} isDisabled={!isEditable}>
            <EditablePreview w='100%' />
            <EditableInput onChange={updateItemCreator(index)} />
          </Editable>
          {isEditable && <IconButton size='sm' aria-label='delete item' icon={<DeleteIcon />} onClick={removeItemCreator(index)} />}
        </HStack>
      ))}
    </>
  )
}

WishlistItems.displayName = 'WishlistItems'

export default WishlistItems
