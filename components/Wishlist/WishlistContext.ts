import { createContext } from '@chakra-ui/react-utils'
import { Dispatch, SetStateAction } from 'react';
import { ShareWishlist } from '../../types';

export interface WishlistContextProps {
  isEditable?: boolean
  items: ShareWishlist.Item[]
  setItems: Dispatch<SetStateAction<ShareWishlist.Item[]>>
}

export const [WishlistProvider, useWishlistContext] = createContext<WishlistContextProps>({
  strict: false,
  name: 'WishlistContext',
})
