import { Box, Heading } from '@chakra-ui/react'
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/react'
import { ChangeEventHandler, FC, useCallback } from 'react'
import { useWishlistTitle } from './use-wishlist'

export type WishlistTitleProps = {
}

const WishlistTitle: FC<WishlistTitleProps> = () => {
  const { isEditable, title, onTitleChange } = useWishlistTitle()
  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(event => {
    onTitleChange(event.target.value)
  }, [onTitleChange])

  return (
    <Box>
      <Editable as={Heading} value={title} isDisabled={!isEditable}>
        <EditablePreview />
        <EditableInput onChange={onChange} />
      </Editable>
    </Box>
  )
}

WishlistTitle.displayName = 'WishlistTitle'

export default WishlistTitle
