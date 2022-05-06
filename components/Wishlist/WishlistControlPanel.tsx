import { LinkIcon } from '@chakra-ui/icons'
import { Box, Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import { FC } from 'react'
import { useWishlistControlPanel } from './use-wishlist'

export type WishlistControlPanelProps = {
  isDisabled?: boolean
}

const WishlistControlPanel: FC<WishlistControlPanelProps> = () => {
  const { onSave, onShareLink } = useWishlistControlPanel()

  return (
    <Box>
      <ButtonGroup size='sm' isAttached variant='outline'>
        <Button mr='-px' onClick={onSave}>Save</Button>
        <IconButton aria-label='get share link' icon={<LinkIcon />} onClick={onShareLink} />
      </ButtonGroup>
    </Box>
  )
}

WishlistControlPanel.displayName = 'WishlistControlPanel'

export default WishlistControlPanel
