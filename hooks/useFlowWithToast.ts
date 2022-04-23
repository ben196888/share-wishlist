import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import type { ReactNode } from 'react'

type SuccessToastOption<T> = {
  title: ReactNode
  description?: (result: T) => ReactNode
}

type FailureToastOption = {
  title: ReactNode
  description?: (result: Error) => ReactNode
}

export default function useFlowWithToast<T extends (...args: any[]) => any>(
  successOption: SuccessToastOption<Awaited<ReturnType<T>>>,
  failureOption: FailureToastOption,
  flowFn: T,
): (...args: Parameters<T>) => void {
  const toast = useToast({ isClosable: true })

  const withToastFlow = useCallback(async (...args) => {
    try {
      const result = await flowFn(...args)
      const description = successOption.description ? successOption.description(result) : null

      toast({
        status: 'success',
        title: successOption.title,
        description,
      })

      return result
    } catch (err) {
      const description = failureOption.description ? failureOption.description(err) : err.toString()

      toast({
        status: 'error',
        title: failureOption.title,
        description,
      })
    }
  }, [toast, successOption, failureOption, flowFn])

  return withToastFlow as T
}
