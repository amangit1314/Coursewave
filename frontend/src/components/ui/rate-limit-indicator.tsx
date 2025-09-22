import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import ApiManager from "@/lib/api/api-manager";

interface RateLimitIndicatorProps {
  url: string;
  method?: string;
  showProgress?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function RateLimitIndicator({
  url,
  method = "GET",
  showProgress = true,
  showBadge = true,
  className = "",
}: RateLimitIndicatorProps) {
  const [status, setStatus] = React.useState(
    ApiManager.getRateLimitStatus(url, method)
  );
  const [timeLeft, setTimeLeft] = React.useState(
    Math.max(0, status.resetTime - Date.now())
  );

  // Poll rate limit status every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStatus(ApiManager.getRateLimitStatus(url, method));
      setTimeLeft(Math.max(0, status.resetTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [url, method, status.resetTime]);

  if (!status.isLimited && status.remaining === status.total) {
    return null; // Don't show anything when unused
  }

  const total = status.total || 1; // prevent div/0
  const used = total - status.remaining;
  const progressPercentage = (used / total) * 100;
  const resetTime = new Date(status.resetTime).toLocaleTimeString();

  // pick bar color dynamically
  let barColor = "rgb(34 197 94)"; // green
  if (progressPercentage > 75) barColor = "rgb(239 68 68)"; // red
  else if (progressPercentage > 50) barColor = "rgb(234 179 8)"; // yellow

  return (
    <div className={`space-y-2 ${className}`}>
      {status.isLimited && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800 dark:text-orange-200">
            Rate Limit Exceeded
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            You&apos;ve reached the maximum of {status.total} requests per
            minute. Try again after {resetTime}.
          </AlertDescription>
        </Alert>
      )}

      {showProgress && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              API Requests: {status.remaining}/{status.total}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Resets at {resetTime}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2"
            style={
              {
                "--progress-background": barColor,
              } as React.CSSProperties
            }
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

      {timeLeft > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {status.isLimited
            ? `Time until reset: ${Math.ceil(timeLeft / 1000)}s`
            : `Resets in ${Math.ceil(timeLeft / 1000)}s`}
        </div>
      )}
    </div>
  );
}

// Hook for multiple endpoints
export function useMultiEndpointRateLimit(
  endpoints: Array<{ url: string; method?: string }>
) {
  const [statuses, setStatuses] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newStatuses: Record<string, any> = {};
      endpoints.forEach(({ url, method = "GET" }) => {
        const key = `${method}:${url}`;
        newStatuses[key] = ApiManager.getRateLimitStatus(url, method);
      });
      setStatuses(newStatuses);
    }, 1000);

    return () => clearInterval(interval);
  }, [endpoints]);

  return statuses;
}

// Global Indicator
export function GlobalRateLimitIndicator({
  endpoints,
}: {
  endpoints: Array<{ url: string; method?: string }>;
}) {
  const statuses = useMultiEndpointRateLimit(endpoints);

  const limitedEndpoints = Object.values(statuses).filter(
    (s: any) => s?.isLimited
  ).length;
  const totalRequests = Object.values(statuses).reduce(
    (sum: number, s: any) => sum + ((s?.total ?? 0) - (s?.remaining ?? 0)),
    0
  );

  const anyLimited = limitedEndpoints > 0;

  if (!anyLimited) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Total API calls made: {totalRequests}
      </div>
    );
  }

  return (
    <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-200">
        Rate Limits Active
      </AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
        {limitedEndpoints} endpoint(s) are currently rate limited. Total calls:{" "}
        {totalRequests}
      </AlertDescription>
    </Alert>
  );
}
