"use client";

import { useAccountEffect } from "@hyper-gate/react";
import { ConnectKitButton } from "@hyper-gate/connectkit";
import { useState } from "react";

// [!region account-effect]
export function AccountEffectDemo() {
    const [events, setEvents] = useState<string[]>([]);
    const [status, setStatus] = useState("disconnected");

    useAccountEffect({
        onConnect: (data) => {
            setStatus("connected");
            setEvents((prev) => [
                `Connected: ${data.address?.slice(0, 8)}...${data.address?.slice(-6)}`,
                ...prev.slice(0, 4), // Keep only last 5 events
            ]);
        },
        onDisconnect: () => {
            setStatus("disconnected");
            setEvents((prev) => [
                "Disconnected",
                ...prev.slice(0, 4), // Keep only last 5 events
            ]);
        },
    });

    return (
        <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">useAccountEffect Demo</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status: <span className="font-mono">{status}</span>
                    </p>
                </div>
                <ConnectKitButton />
            </div>

            <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Events:</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 min-h-[100px]">
                    {events.length > 0 ? (
                        <ul className="space-y-1">
                            {events.map((event, index) => (
                                <li
                                    key={index}
                                    className="text-sm font-mono text-gray-700 dark:text-gray-300"
                                >
                                    • {event}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic">
                            No events yet. Connect your wallet to see activity.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
// [!endregion] 