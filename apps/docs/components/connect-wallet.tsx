"use client";

import { useAccount } from '@repo/ui';

export function ConnectWallet() {
    const { account } = useAccount();
	return <>
		<button type="button" onClick={() => alert("connect wallet")}>
			Connect Wallet
		</button>
        {account && <p>Connected: {account}</p>}
	</>;
}
