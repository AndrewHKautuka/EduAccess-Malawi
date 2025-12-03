declare module "@tanstack/react-query" {
  export type QueryResult<TData = unknown> = {
    data?: TData
    isLoading: boolean
    isFetching?: boolean
    isError: boolean
    error?: unknown
    refetch: () => Promise<void>
  }

  export function useQuery<TData = unknown>(opts: unknown): QueryResult<TData>
}
