import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRateLimitStatus } from '@/hooks/use-api';
import { getRateLimitStatus } from '@/lib/api/rate-limiter';

interface RateLimitIndicatorProps {
  url: string;
  method?: string;
  showProgress?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function RateLimitIndicator({
  url,
  method = 'GET',
  showProgress = true,
  showBadge = true,
  className = '',
}: RateLimitIndicatorProps) {
  const status = useRateLimitStatus(url, method);

  if (!status.isLimited && status.remaining === status.total) {
    return null; // Don't show anything when no requests have been made
  }

  const progressPercentage = ((status.total - status.remaining) / status.total) * 100;
  const resetTime = new Date(status.resetTime).toLocaleTimeString();
  const timeUntilReset = Math.max(0, status.resetTime - Date.now());

  return (
    <div className={`space-y-2 ${className}`}>
      {status.isLimited && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800 dark:text-orange-200">
            Rate Limit Exceeded
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            You've reached the maximum of {status.total} requests per minute. 
            Try again after {resetTime}.
          </AlertDescription>
        </Alert>
      )}

      {showProgress && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              API Requests: {status.remaining}/{status.total}
            </span>
            <span className="text-gray-500 dark:text-gray-500">
              Resets at {resetTime}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
            style={{
              '--progress-background': status.isLimited ? 'rgb(239 68 68)' : 'rgb(34 197 94)'
            } as React.CSSProperties}
          />
        </div>
      )}

      {showBadge && (
        <div className="flex items-center gap-2">
          {status.isLimited ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Rate Limited
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {status.remaining} requests left
            </Badge>
          )}
        </div>
      )}

      {timeUntilReset > 0 && status.isLimited && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Time until reset: {Math.ceil(timeUntilReset / 1000)}s
        </div>
      )}
    </div>
  );
}

// Hook for getting rate limit status for multiple endpoints
export function useMultiEndpointRateLimit(endpoints: Array<{ url: string; method?: string }>) {
  const [statuses, setStatuses] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newStatuses: Record<string, any> = {};
      endpoints.forEach(({ url, method = 'GET' }) => {
        const key = `${method}:${url}`;
        newStatuses[key] = getRateLimitStatus(url, method);
      });
      setStatuses(newStatuses);
    }, 1000);

    return () => clearInterval(interval);
  }, [endpoints]);

  return statuses;
}

// Component for showing overall rate limit status
export function GlobalRateLimitIndicator() {
  const [globalStatus, setGlobalStatus] = React.useState({
    totalRequests: 0,
    limitedEndpoints: 0,
    anyLimited: false,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      // This would need to be implemented based on your specific needs
      // You might want to track all endpoints globally
      setGlobalStatus({
        totalRequests: 0,
        limitedEndpoints: 0,
        anyLimited: false,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!globalStatus.anyLimited) {
    return null;
  }

  return (
    <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-200">
        Rate Limits Active
      </AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
        {globalStatus.limitedEndpoints} endpoint(s) are currently rate limited.
      </AlertDescription>
    </Alert>
  );
} 