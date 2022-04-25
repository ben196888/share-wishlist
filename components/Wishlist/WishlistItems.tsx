import { DeleteIcon } from '@chakra-ui/icons'
import { Editable, EditableInput, EditablePreview, HStack, IconButton } from '@chakra-ui/react'
import { ChangeEventHandler, FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { useItems } from './use-wishlist'

export type WishlistItemsProps = {
}

const WishlistItems: FC<WishlistItemsProps> = () => {
  const { items, setItems, removeItemAt, updateItemAt } = useItems()

  const removeItemCreator: (index: number) => MouseEventHandler<HTMLButtonElement> = useCallback((index) => () => {
    removeItemAt(index)
  }, [removeItemAt])

  const updateItemCreator: (index: number) => ChangeEventHandler<HTMLInputElement> = useCallback((index) => (event) => {
    updateItemAt(index, { name: event.target.value })
  }, [updateItemAt])

  const css = useMemo(() => ({ width: '100%' }), [])

  return (
    <>
      {items.map((item, index) => (
        <HStack key={item.id} mt='1'>
          <Editable css={css} value={item.name} selectAllOnFocus={false}>
            <EditablePreview css={css} />
            <EditableInput onChange={updateItemCreator(index)} />
          </Editable>
          <IconButton size='sm' aria-label='delete item' icon={<DeleteIcon />} onClick={removeItemCreator(index)} />
        </HStack>
      ))}
    </>
  )
}

WishlistItems.displayName = 'WishlistItems'

export default WishlistItems
