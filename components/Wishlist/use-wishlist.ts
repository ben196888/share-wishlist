import { useCallback } from 'react';
import { ShareWishlist } from '../../types';
import { useWishlistContext } from './WishlistContext';

export function useItems() {
  const { items, setItems } = useWishlistContext()

  const removeItemAt = useCallback((index: number) => {
    setItems(prevItems => {
      const nextItems = prevItems.slice()
      nextItems.splice(index, 1)
      return nextItems
    })
  }, [setItems])

  const updateItemAt = useCallback((index: number, updates: Partial<ShareWishlist.Item>) => {
    setItems(prevItems => {
      const nextItems = prevItems.slice()
      if (updates.name) {
        nextItems[index].name = updates.name
      }
      return nextItems
    })
  }, [setItems])

  return { items, setItems, removeItemAt, updateItemAt }
}
