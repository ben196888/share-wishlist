import { LinkIcon } from '@chakra-ui/icons'
import { Box, Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import useFlowWithToast from '../../hooks/useFlowWithToast'
import useShareLink from '../../hooks/useShareLink'
import useWishlist from '../../hooks/useWishlist'
import { useItems } from './use-wishlist'

export type WishlistControlPanelProps = {
  isDisabled?: boolean
}

const WishlistControlPanel: FC<WishlistControlPanelProps> = () => {
  const { saveWishlist } = useWishlist()
  const { items } = useItems()

  const saveFlow = useCallback(async () => {
    await saveWishlist(items)
  }, [saveWishlist, items])

  const onSave = useFlowWithToast(
    { title: 'Wishlist saved.' },
    { title: 'Wishlist save failure.' },
    saveFlow,
  )

  const { getShareLink } = useShareLink()
  const [, copy] = useCopyToClipboard()

  const shareLinkFlow = useCallback(async () => {
    const wishlist = await saveWishlist(items)
    const shareLink = await getShareLink(wishlist)
    const copied = await copy(shareLink)
    if (copied) {
      return shareLink
    }
    if (navigator.share) {
      await navigator.share({ text: shareLink })
      return shareLink
    }
    throw Error('Cannot copy or share the link')
  }, [saveWishlist, items, getShareLink, copy])

  const onShareLink = useFlowWithToast(
    { title: 'Share link is generated.', description: shareLink => shareLink },
    { title: 'Share link create failure.' },
    shareLinkFlow,
  )
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
