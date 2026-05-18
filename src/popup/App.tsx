import { useEffect, useState } from "react";
import { createClient } from "mv3-message-router";
import type { Messages } from "@/shared/messages";

const client = createClient<Messages>();

export function App() {
	const [count, setCount] = useState<number | null>(null);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		client.send("GET_STATE", undefined).then((s) => setCount(s.count));
	}, []);

	const inc = async (by: number) => {
		setBusy(true);
		try {
			const { count: next } = await client.send("INCREMENT", { by });
			setCount(next);
		} finally {
			setBusy(false);
		}
	};

	return (
		<main>
			<h1>MV3 Vite Starter</h1>
			<p className="count">{count ?? "…"}</p>
			<div className="row">
				<button type="button" onClick={() => inc(-1)} disabled={busy}>
					−
				</button>
				<button type="button" onClick={() => inc(1)} disabled={busy}>
					+
				</button>
			</div>
			<p className="hint">Edit <code>src/popup/App.tsx</code> — Vite hot-reloads it.</p>
		</main>
	);
}
