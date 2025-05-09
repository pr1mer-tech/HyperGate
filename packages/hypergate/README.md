# HyperGate

HyperGate is a comprehensive SDK for interacting with the XRP Ledger, providing a unified API for all your XRPL needs.

## Installation

```bash
npm install hypergate
# or
yarn add hypergate
# or
pnpm add hypergate
# or
bun add hypergate
```

## Usage

HyperGate provides access to all functionality from its subpackages in one convenient import.

```typescript
// Import everything
import * as HyperGate from 'hypergate';

// Or import specific namespaces
import { Core, React, ConnectKit } from 'hypergate';

// Or import directly from the root
import { useAccount, connectWallet } from 'hypergate';
```

## Packages

HyperGate combines these packages:

- `@hyper-gate/core` - Core functionality for XRPL interactions
- `@hyper-gate/react` - React hooks and components
- `@hyper-gate/connectkit` - UI components for wallet connections

## License

MIT 