import { child, push, ref, runTransaction } from 'firebase/database'
import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { database as db } from '../../firebase/clientApp'
import useCopyOrShare from '../../hooks/useCopyOrShare';
import useFlowWithToast from '../../hooks/useFlowWithToast'
import useFunction from '../../hooks/useFunction';
import type { ShareWishlist } from '../../types';
import { useWishlistContext, WishlistContextProps } from './WishlistContext';

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

export function useWishlistId() {
  const initialWishlistId = ''
  const [wishlistId, setWishlistId] = useLocalStorage('wishlistId', initialWishlistId)

  const isValidWishlistId = useMemo(() => {
    return wishlistId !== initialWishlistId
  }, [wishlistId])

  const updateWishlistId = useCallback(() => {
    if (isValidWishlistId) {
      return wishlistId
    }
    const nextWishlistId = push(child(ref(db), 'wishlists')).key
    setWishlistId(nextWishlistId)
    return nextWishlistId
  }, [isValidWishlistId, wishlistId, setWishlistId])

  return { wishlistId, isValidWishlistId, updateWishlistId }
}

type UseTitleProps = {
  title?: ShareWishlist.Title
}

export function useTitle({ title = 'My wishlist' }: UseTitleProps) {
  const [titleValue, setTitleValue] = useState(title)
  const onTitleChange = useCallback((nextTitle: string) => {
    setTitleValue(nextTitle)
  }, [setTitleValue])

  return { title: titleValue, onTitleChange }
}

type UseWishlistProps = {
  wishlist?: ShareWishlist.Wishlist
  isEditable?: boolean
}

export function useWishlist({ wishlist, isEditable = false }: UseWishlistProps = {}): WishlistContextProps {
  const [items, setItems] = useItems({ items: wishlist?.items, isEditable })
  const { updateWishlistId } = useWishlistId()
  const { title, onTitleChange } = useTitle({ title: wishlist?.title })

  return { wishlist, isEditable, items, setItems, updateWishlistId, title, onTitleChange }
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

const buildShareLink = (shortPath: ShareWishlist.ShortPath) => {
  const path = `/l/${shortPath}`
  return `${window.location.origin}${path}`
}

export function useWishlistControlPanel() {
  const { isEditable, items, updateWishlistId } = useWishlistContext()

  const saveWishlist = useCallback(async (items: ShareWishlist.Item[]) => {
    if (!isEditable) {
      throw Error('You cannot save this wishlist')
    }
    const wishlistId = updateWishlistId()
    const wishlistPath = `/wishlists/${wishlistId}`

    const result = await runTransaction(ref(db, wishlistPath), (wishlist: ShareWishlist.Wishlist | null) => {
      const nextWishlist: ShareWishlist.Wishlist = {
        ...wishlist,
        items,
        id: wishlistId,
        roles: {},
      }

      return nextWishlist
    })

    return result.snapshot.val() as ShareWishlist.Wishlist
  }, [isEditable, updateWishlistId])

  const saveFlow = useCallback(async () => {
    await saveWishlist(items)
  }, [saveWishlist, items])

  const onSave = useFlowWithToast(
    { title: 'Wishlist saved.' },
    { title: 'Wishlist save failure.' },
    saveFlow,
  )

  type ReqData = ShareWishlist.Functions.CreateWishlistShortPath.RequestData
  type ResData = ShareWishlist.Functions.CreateWishlistShortPath.ResponseData
  const createWishlistShortPath = useFunction<ReqData, ResData>('createWishlistShortPath')

  const getShortPath = useCallback(async () => {
    const wishlist = await saveWishlist(items)
    if (wishlist.shortPath) {
      return wishlist.shortPath
    }
    const result = await createWishlistShortPath({ wishlistId: wishlist.id })
    return result.data.shortPath
  }, [saveWishlist, items, createWishlistShortPath])

  const copyOrShare = useCopyOrShare()

  const shareLinkFlow = useCallback(async () => {
    const shortPath = await getShortPath()
    const shareLink = buildShareLink(shortPath)
    const copiedShareLink = await copyOrShare(shareLink)
    return copiedShareLink
  }, [getShortPath, copyOrShare])

  const onShareLink = useFlowWithToast(
    { title: 'Share link is generated.', description: shareLink => shareLink },
    { title: 'Share link create failure.' },
    shareLinkFlow,
  )

  return { onSave, onShareLink }
}

export function useWishlistTitle() {
  const { isEditable, title, onTitleChange } = useWishlistContext()
  return { isEditable, title, onTitleChange }
}
