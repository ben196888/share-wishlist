import { useBoolean } from '@chakra-ui/react'
import { httpsCallable } from 'firebase/functions'
import { useCallback, useState } from 'react'
import { functions } from '../firebase/clientApp'

export default function useFunction<TRequestData, TResponseData>(functionName: string) {
  const [data, setData] = useState<TResponseData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useBoolean()

  const func = useCallback((requestData: TRequestData) => {
    setLoading.on()
    const requestFn = httpsCallable<TRequestData, TResponseData>(functions, functionName)

    requestFn(requestData)
      .then((result => {
        setData(result.data)
        setError(null)
      }))
      .catch(err => {
        setData(null)
        setError(err)
      })
      .finally(() => {
        setLoading.off()
      })
  }, [setLoading, functionName, setData, setError])

  return {
    func,
    data,
    loading,
    error,
  }
}
