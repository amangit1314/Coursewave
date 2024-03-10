// src/app/QueryClientProvider.tsx
import {
  QueryClient,
  QueryClientProvider,
  QueryClientProviderProps,
} from "react-query";

const queryClient = new QueryClient();

export const GlobalQueryClientProvider: React.FC<
  QueryClientProviderProps | { children: React.ReactNode }
> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
