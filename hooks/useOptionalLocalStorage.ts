import { Dispatch, SetStateAction, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function useOptionalLocalStorage<T>(
  key: string,
  initialValue: T,
  isLocalStorage: boolean = false,
): [T, Dispatch<SetStateAction<T>>] {
  const useStateWithoutLocalStorage = useState<T>(initialValue)
  const useStateWithLocalStorage = useLocalStorage<T>(key, initialValue)
  if (isLocalStorage) {
    return useStateWithLocalStorage
  }
  return useStateWithoutLocalStorage
}
