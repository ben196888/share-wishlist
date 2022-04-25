import { createContext } from '@chakra-ui/react-utils'
import { Dispatch, SetStateAction } from 'react';
import { ShareWishlist } from '../../types';

export interface WishlistContextProps {
  wishlist?: ShareWishlist.Wishlist
  isEditable?: boolean
  items: ShareWishlist.Item[]
  setItems: Dispatch<SetStateAction<ShareWishlist.Item[]>>
  saveWishlist: (items: ShareWishlist.Item[]) => Promise<ShareWishlist.Wishlist>
}

export const [WishlistProvider, useWishlistContext] = createContext<WishlistContextProps>({
  strict: false,
  name: 'WishlistContext',
})
