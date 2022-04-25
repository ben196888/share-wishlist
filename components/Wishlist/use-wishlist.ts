import { useCallback, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { ShareWishlist } from '../../types';
import { useWishlistContext } from './WishlistContext';

// context provider value factorys
type UseItemsProps = {
  items?: ShareWishlist.Item[]
  isEditable?: boolean
}

export function useItems({ items = [], isEditable = false }: UseItemsProps = {}) {
  const useStateWithoutLocalStorage = useState<ShareWishlist.Item[]>(items)
  const useStateWithLocalStorage = useLocalStorage<ShareWishlist.Item[]>('items', items)
  if (isEditable) {
    return useStateWithLocalStorage
  }
  return useStateWithoutLocalStorage
}

// component level context hooks
export function useWishlistItems() {
  const { isEditable, items, setItems } = useWishlistContext()

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

  return { isEditable, items, setItems, removeItemAt, updateItemAt }
}
