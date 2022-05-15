import { signInAnonymously } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react'
import { auth } from '../firebase/clientApp'

export default function useUid() {
  useEffect(() => {
    signInAnonymously(auth)
  }, [])
  const [user, loading, error] = useAuthState(auth)
  if (error) {
    console.log('Cannot login', error)
  }
  if (loading || error) {
    return null
  }
  return user?.uid
}
