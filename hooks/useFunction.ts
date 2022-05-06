import { httpsCallable } from 'firebase/functions'
import { useMemo } from 'react'
import { functions } from '../firebase/clientApp'

export default function useFunction<TRequestData, TResponseData>(functionName: string) {
  return useMemo(() => {
    return httpsCallable<TRequestData, TResponseData>(functions, functionName)
  }, [functionName])
}
