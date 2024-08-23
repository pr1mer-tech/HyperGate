import { expect, test } from "bun:test";

import { deserialize } from "./deserialize.js";
import { serialize } from "./serialize.js";

test("deserializes", () => {
	const complexObject = {
		some: "complex",
		object: {
			that: "has",
			many: [
				{ many: "many", manymany: "many" },
				{ many: "many" },
				{ many: "many" },
				{
					many: {
						properties: {
							ones: {
								that: {
									have: {
										functions: () => null,
									},
								},
							},
						},
					},
				},
			],
		},
		and: {
			ones: {
				that: {
					have: {
						bigints: 123456789012345678901234567890n,
					},
				},
			},
		},
		also: {
			ones: {
				that: {
					have: {
						proxies: new Proxy({ lol: "nice" }, {}),
					},
				},
			},
		},
	} as const;
	const deserializedCache = deserialize(serialize(complexObject));

	// Change the proxy & function to ensure they are not the same object

	//@ts-expect-error - const cannot be assigned
	complexObject.object.many[3].many.properties.ones.that.have = {};
	//@ts-expect-error - const cannot be assigned
	complexObject.also.ones.that.have.proxies = { lol: "nice" };

	expect(deserializedCache).toEqual(complexObject);
});

test("Map", () => {
	const map = new Map().set("foo", { bar: "baz" });
	const deserializedCache = deserialize(serialize({ map }));
	expect(deserializedCache).toEqual({ map });
});

test("bigint", () => {
	const bigint = 123n;
	const deserializedCache = deserialize(serialize({ bigint }));
	expect(deserializedCache).toEqual({ bigint });
});
