import { Center, Heading, forwardRef } from '@chakra-ui/react'

export type LayoutHeaderProps = {}

const LayoutHeader = forwardRef<LayoutHeaderProps, 'div'>((props, ref) => {
  return (
    <Center ref={ref}>
      <Heading as='h1' size='4xl'>
        Wishlist
      </Heading>
    </Center>
  )
})

LayoutHeader.displayName = 'LayoutHeader'

export default LayoutHeader
