import { Box, Heading } from '@chakra-ui/react'
import { FC } from 'react'

export type WishlistTitleProps = {
}

const WishlistTitle: FC<WishlistTitleProps> = () => {
  return (
    <Box>
      <Heading as='h2'>
        My wishlist
      </Heading>
    </Box>
  )
}

WishlistTitle.displayName = 'WishlistTitle'

export default WishlistTitle
