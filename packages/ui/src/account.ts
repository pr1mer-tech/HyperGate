import { useConfig } from "./config";
import { useStore } from "zustand";
import type { Address } from "../../core/src/utils/address";

export function useAccount() {
	const config = useConfig();

	const useConfigStore = (selector: (state: typeof config.state) => unknown) =>
		useStore(config._internal.store, selector);

	const account = useConfigStore((state) =>
		state.current ? state.connections.get(state.current)?.accounts[0] : null,
	) as Address | null;
	return {
		account,
	};
}
