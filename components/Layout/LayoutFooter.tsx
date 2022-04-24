import { Box, Center, Link } from '@chakra-ui/react'
import Image from 'next/image'
import { forwardRef } from '@chakra-ui/react';

export type LayoutFooterProps = {}

const LayoutFooter = forwardRef<LayoutFooterProps, 'footer'>((props, ref) => {
  return (
    <Center as='footer' ref={ref}>
      <Box>
        Powered by{' '}
        <Link href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" isExternal>

          <Box as='span'>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </Box>
        </Link>
      </Box>
    </Center>
  )
})

LayoutFooter.displayName = 'LayoutFooter'

export default LayoutFooter
