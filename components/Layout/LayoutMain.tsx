import { Box, forwardRef } from '@chakra-ui/react'
import { ReactNode } from 'react'

export type LayoutMainProps = {
  children?: ReactNode
}

const LayoutMain = forwardRef<LayoutMainProps, 'main'>((props, ref) => {
  return (
    <Box as='main' ref={ref}>
      {props.children}
    </Box>
  )
})

LayoutMain.displayName = 'LayoutMain'

export default LayoutMain
