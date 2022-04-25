import { Box, Flex, Spacer, VStack } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { ShareWishlist } from '../../types'
import { WishlistContextProps, WishlistProvider } from './WishlistContext'
import WishlistControlPanel from './WishlistControlPanel'
import WishlistItems from './WishlistItems'
import WishlistNewItem from './WishlistNewItem'
import WishlistTitle from './WishlistTitle'

export type WishlistProps = {
  wishlist?: ShareWishlist.Wishlist
  isEditable?: boolean
}

interface WishlistComponent extends FC<WishlistProps> {
  ControlPanel: typeof WishlistControlPanel
  Items: typeof WishlistItems
  NewItem: typeof WishlistNewItem
  Title: typeof WishlistTitle
}

const Wishlist: WishlistComponent = ({ isEditable }) => {
  const [items, setItems] = useLocalStorage<ShareWishlist.Item[]>('items', [])

  const context: WishlistContextProps = useMemo(() => {
    return {
      isEditable,
      items,
      setItems,
    }
  }, [isEditable, items, setItems])

  return (
    <WishlistProvider value={context}>
      <VStack>
        <Flex w='xs' align='center' justify='center'>
          <WishlistTitle />
          <Spacer />
          <WishlistControlPanel />
        </Flex>
        <Box w='xs'>
          <WishlistNewItem />
          <WishlistItems />
        </Box>
      </VStack>
    </WishlistProvider>
  )
}

Wishlist.displayName = 'Wishlist'
Wishlist.ControlPanel = WishlistControlPanel
Wishlist.Items = WishlistItems
Wishlist.NewItem = WishlistNewItem
Wishlist.Title = WishlistTitle


export default Wishlist
