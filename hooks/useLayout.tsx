import { Box, Center, Heading, Link, useCallbackRef } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { memo, useCallback, useMemo } from 'react'

export default function useLayout() {
  const Title = useCallback(() => {
    return (
      <Head>
        <title>Share My Wishlist</title>
        <meta name="description" content="Share my wishlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    )
  }, [])

  const Header = useCallback(() => {
    return (
      <Center>
        <Heading as='h1' size='4xl'>
          Wishlist
        </Heading>
      </Center>
    )
  }, [])

  const Main = useCallback(({ children }) => {
    return (
      <Box as='main'>
        {children}
      </Box>
    )
  }, [])

  const Footer = useCallback(() => {
    return (
      <Center as='footer'>
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
  }, [])

  const Container = useCallback(({ children }) => {
    return (
      <Box>
        {children}
      </Box>
    )
  }, [])

  const Layout = useMemo(() => {
    return {
      Container: memo(Container),
      Title,
      Header,
      Main,
      Footer,
    }
  }, [Container, Title, Header, Main, Footer])

  const result = useMemo(() => {
    return {
      Layout
    }
  }, [Layout])

  return result
}
