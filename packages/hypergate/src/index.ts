// Re-export everything from the core package
export * from "@hyper-gate/core";

// Re-export everything from the connectkit package
export * from "@hyper-gate/connectkit";

// Export namespaces to allow for clean imports
import * as Core from "@hyper-gate/core";
import * as React from "@hyper-gate/react";
import * as ConnectKit from "@hyper-gate/connectkit";

export { Core, React, ConnectKit };
