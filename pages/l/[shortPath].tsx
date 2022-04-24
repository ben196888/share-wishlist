import { useRouter } from 'next/router';

export default function ShortPath() {
  const router = useRouter()
  const { shortPath } = router.query

  return (
    <>
      Page {shortPath} mock
    </>
  )
}
