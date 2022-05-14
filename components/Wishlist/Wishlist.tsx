import { Box, Flex, Spacer, VStack } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import { ShareWishlist } from '../../types'
import { useWishlist } from './use-wishlist'
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

const Wishlist: WishlistComponent = ({ isEditable, wishlist }) => {
  const ctx = useWishlist({ isEditable, wishlist })

  const context: WishlistContextProps = useMemo(() => {
    return { ...ctx }
  }, [ctx])

  return (
    <WishlistProvider value={context}>
      <VStack>
        <Flex w='xs' align='center' justify='center'>
          {
            isEditable ? (
              <>
                <WishlistTitle />
                <Spacer />
                <WishlistControlPanel />
              </>
            ) : (
              <>
                <WishlistTitle />
              </>
            )}
        </Flex>
        <Box w='xs'>
          {isEditable && <WishlistNewItem />}
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
