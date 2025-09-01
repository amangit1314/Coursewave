import { useState, useCallback, useEffect } from 'react';
import { ApiResponse, ApiError } from '@/lib/api/api-manager';
import { getRateLimitStatus } from '@/lib/api/core/rate-limiter';

// Hook state interface
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Hook return interface
interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// Hook configuration
interface UseApiConfig<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onFinally?: () => void;
}

// Custom hook for API calls
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  config: UseApiConfig<T> = {}
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError, onFinally } = config;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);
        
        if (response.success && response.data !== undefined) {
          setState(prev => ({ ...prev, data: response.data as T, loading: false }));
          onSuccess?.(response.data);
        } else {
          const error = new ApiError(
            response.message || 'API request failed',
            400,
            undefined,
            response
          );
          setState(prev => ({ ...prev, error, loading: false }));
          onError?.(error);
        }
      } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(
          error instanceof Error ? error.message : 'Unknown error',
          500
        );
        
        // Handle rate limit errors specifically
        if (apiError.status === 429) {
          console.warn('Rate limit exceeded:', apiError.message);
          // You could show a toast notification here
          if (typeof window !== 'undefined') {
            // Show user-friendly rate limit message
            const resetTime = new Date(apiError.data?.resetTime || Date.now() + 60000).toLocaleTimeString();
            console.log(`Rate limit exceeded. Try again after ${resetTime}`);
          }
        }
        
        setState(prev => ({ ...prev, error: apiError, loading: false }));
        onError?.(apiError);
      } finally {
        onFinally?.();
      }
    },
    [apiFunction, onSuccess, onError, onFinally]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  // Execute immediately if configured
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook for data fetching with automatic execution
export function useApiData<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  config: UseApiConfig<T> = {}
): UseApiReturn<T> {
  const hook = useApi(apiFunction, { ...config, immediate: false });

  useEffect(() => {
    hook.execute();
  }, dependencies);

  return hook;
}

// Hook for form submission
export function useApiSubmit<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  config: UseApiConfig<T> = {}
): UseApiReturn<T> {
  return useApi(apiFunction, config);
}

// Hook for optimistic updates
export function useOptimisticUpdate<T = any>(
  updateFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  rollbackFunction?: () => void
) {
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const executeOptimistic = useCallback(
    async (optimisticUpdate: T, ...args: any[]) => {
      // Set optimistic data
      setOptimisticData(optimisticUpdate);
      setIsOptimistic(true);

      try {
        const response = await updateFunction(...args);
        
        if (response.success) {
          setOptimisticData(null);
          setIsOptimistic(false);
          return response;
        } else {
          // Rollback on failure
          setOptimisticData(null);
          setIsOptimistic(false);
          rollbackFunction?.();
          throw new Error(response.message || 'Update failed');
        }
      } catch (error) {
        // Rollback on error
        setOptimisticData(null);
        setIsOptimistic(false);
        rollbackFunction?.();
        throw error;
      }
    },
    [updateFunction, rollbackFunction]
  );

  return {
    executeOptimistic,
    optimisticData,
    isOptimistic,
  };
}

// Hook for pagination
export function useApiPagination<T = any>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<ApiResponse<T[]>>,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState<T[]>([]);

  const { data, loading, error, execute, reset } = useApi(apiFunction);

  const loadPage = useCallback(
    async (pageNum: number, pageLimit: number = limit, ...args: any[]) => {
      await execute(pageNum, pageLimit, ...args);
    },
    [execute, limit]
  );

  const loadNextPage = useCallback(
    async (...args: any[]) => {
      if (!loading && hasMore) {
        const nextPage = page + 1;
        await loadPage(nextPage, limit, ...args);
      }
    },
    [loading, hasMore, page, limit, loadPage]
  );

  const loadPreviousPage = useCallback(
    async (...args: any[]) => {
      if (!loading && page > 1) {
        const prevPage = page - 1;
        await loadPage(prevPage, limit, ...args);
      }
    },
    [loading, page, limit, loadPage]
  );

  const goToPage = useCallback(
    async (pageNum: number, ...args: any[]) => {
      if (!loading && pageNum > 0) {
        await loadPage(pageNum, limit, ...args);
      }
    },
    [loading, limit, loadPage]
  );

  const refresh = useCallback(
    async (...args: any[]) => {
      await loadPage(1, limit, ...args);
    },
    [limit, loadPage]
  );

  // Update pagination state when data changes
  useEffect(() => {
    if (data) {
      setAllData(prev => {
        if (page === 1) {
          return data;
        } else {
          return [...prev, ...data];
        }
      });
      
      // Check if there's more data
      setHasMore(data.length === limit);
    }
  }, [data, page, limit]);

  return {
    data: allData,
    loading,
    error,
    page,
    limit,
    hasMore,
    setLimit,
    loadPage,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    refresh,
    reset,
  };
}

// Hook for checking rate limit status
export function useRateLimitStatus(url: string, method: string = 'GET') {
  const [status, setStatus] = useState(() => getRateLimitStatus(url, method));

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getRateLimitStatus(url, method));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [url, method]);

  return status;
}

// Hook for rate-limited API calls with automatic retry
export function useRateLimitedApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  config: UseApiConfig<T> & {
    retryOnRateLimit?: boolean;
    retryDelay?: number;
  } = {}
): UseApiReturn<T> & {
  rateLimitStatus: ReturnType<typeof getRateLimitStatus>;
  retry: () => void;
} {
  const { retryOnRateLimit = true, retryDelay = 5000, ...apiConfig } = config;
  
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<ApiError | null>(null);
  
  const hook = useApi(apiFunction, {
    ...apiConfig,
    onError: (error) => {
      setLastError(error);
      apiConfig.onError?.(error);
    }
  });

  const rateLimitStatus = getRateLimitStatus('', 'GET'); // You might want to extract URL from apiFunction

  const retry = useCallback(() => {
    if (lastError?.status === 429 && retryOnRateLimit) {
      const resetTime = lastError.data?.resetTime || Date.now() + 60000;
      const now = Date.now();
      
      if (now >= resetTime) {
        setRetryCount(prev => prev + 1);
        hook.execute();
      } else {
        // Wait until rate limit resets
        const delay = resetTime - now + 1000; // Add 1 second buffer
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          hook.execute();
        }, delay);
      }
    } else {
      setRetryCount(prev => prev + 1);
      hook.execute();
    }
  }, [lastError, retryOnRateLimit, hook]);

  return {
    ...hook,
    rateLimitStatus,
    retry,
  };
} 