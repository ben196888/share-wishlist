import useFunction from './useFunction';
import useLoading from './useLoading';

export default function useLoadingFunction<TRequestData, TResponseData>(functionName: string) {
  const targetFunc = useFunction<TRequestData, TResponseData>(functionName)
  const { func, loading, error, response } = useLoading(targetFunc)

  return { func, loading, error, data: response.data }
}
