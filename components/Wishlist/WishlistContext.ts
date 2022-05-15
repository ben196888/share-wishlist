import { createContext } from '@chakra-ui/react-utils'
import { useWishlist } from './use-wishlist';

export type WishlistContextProps = ReturnType<typeof useWishlist>

export const [WishlistProvider, useWishlistContext] = createContext<WishlistContextProps>({
  strict: false,
  name: 'WishlistContext',
})
