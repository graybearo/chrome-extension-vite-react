import { scheduleAlarm } from "mv3-keepalive";
import { createRouter } from "mv3-message-router";
import type { Messages } from "@/shared/messages";
import { readState, writeState } from "@/shared/storage";

const router = createRouter<Messages>();

router.on("GET_STATE", async () => readState());

router.on("INCREMENT", async ({ by }) => {
	const state = await readState();
	const next = { count: state.count + by, lastUpdated: Date.now() };
	await writeState(next);
	return { count: next.count };
});

router.on("PING", async () => ({ pong: true as const, from: "service-worker" }));

router.listen();

scheduleAlarm({
	name: "heartbeat",
	periodMinutes: 5,
	handler: async () => {
		const state = await readState();
		console.log("[sw] heartbeat", state);
	},
});

chrome.runtime.onInstalled.addListener(() => {
	console.log("[sw] installed");
});
