import { HyperGateConfig } from "@hypergate/react";
import { XummConnector, createConfig } from "@hypergate/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HyperGateConfig
      config={createConfig({
        connectors: [new XummConnector("2e0e665d-a72f-4d17-a760-ce7bc57462d2")],
      })}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HyperGateConfig>
  );
}
