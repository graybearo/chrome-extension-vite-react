import { createClient } from "mv3-message-router";
import type { Messages } from "@/shared/messages";

const client = createClient<Messages>();

client
	.send("PING", undefined)
	.then((reply) => {
		console.log("[content] ping reply:", reply);
	})
	.catch((err) => {
		console.warn("[content] ping failed:", err);
	});
