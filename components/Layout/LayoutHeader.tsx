import { Center, Heading, forwardRef, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

export type LayoutHeaderProps = {}

const LayoutHeader = forwardRef<LayoutHeaderProps, 'div'>((props, ref) => {
  return (
    <Center ref={ref}>
      <NextLink href='/' passHref>
        <Link>
          <Heading as='h1' size='4xl'>Wishlist</Heading>
        </Link>
      </NextLink>
    </Center>
  )
})

LayoutHeader.displayName = 'LayoutHeader'

export default LayoutHeader
