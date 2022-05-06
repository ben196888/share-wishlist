import { useBoolean } from '@chakra-ui/react'
import { useCallback, useState } from 'react'

export default function useLoading<TRequest = any, TResponse = any>(targetFunc: (payload: TRequest) => Promise<TResponse>) {
  const [response, setResponse] = useState<TResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useBoolean()

  const func = useCallback(async (payload: TRequest) => {
    setLoading.on()
    try {
      const result = await targetFunc(payload)
      setResponse(result)
    } catch (err) {
      setResponse(null)
      setError(err)
    }
    setLoading.off()
  }, [setLoading, targetFunc, setResponse, setError])

  return { func, response, error, loading }
}
