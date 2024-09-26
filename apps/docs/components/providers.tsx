"use client";

import { XummConnector, GemConnector, createConfig } from "@hypergate/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "@hypergate/connectkit";
import { HyperGateProvider } from "@hypergate/react";

const queryClient = new QueryClient();
const config = createConfig(
  getDefaultConfig({
    appName: "HyperGate Demo",
    connectors: [
      new XummConnector("2e0e665d-a72f-4d17-a760-ce7bc57462d2"),
      new GemConnector(),
    ],
  }),
);
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HyperGateProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </HyperGateProvider>
  );
}
