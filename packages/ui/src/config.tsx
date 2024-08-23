import type React from 'react';
import { createContext, useContext } from 'react';
import type { Config } from "@repo/core";

// Create a context for the config
const ConfigContext = createContext<Config | undefined>(undefined);

// Props type for the HyperGateConfig component
interface HyperGateConfigProps {
  config: Config;
  children: React.ReactNode;
}

// HyperGateConfig provider component
export const HyperGateConfig: React.FC<HyperGateConfigProps> = ({ config, children }) => {
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook to use the config
export const useConfig = (): Config => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a HyperGateConfig provider');
  }
  return context;
};