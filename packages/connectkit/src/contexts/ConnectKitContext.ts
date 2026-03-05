import React from "react";
import type { ContextValue } from "../types/ConnectKitContext";

export const Context = React.createContext<ContextValue | null>(null);

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error("ConnectKit Hook must be inside a Provider.");
  return context;
};
