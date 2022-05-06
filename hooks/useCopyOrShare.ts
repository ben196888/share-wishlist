import { useCallback } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

export default function useCopyOrShare() {
  const [, copy] = useCopyToClipboard()
  const copyOrShare = useCallback(async (text: string) => {
    const copied = await copy(text)
    if (copied) {
      return text
    }
    if (navigator.share) {
      await navigator.share({ text })
      return text
    }
    throw Error('Cannot copy nor share')
  }, [copy])

  return copyOrShare
}
