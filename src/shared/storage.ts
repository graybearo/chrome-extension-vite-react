export interface AppState {
	count: number;
	lastUpdated: number;
}

const KEY = "appState";

export async function readState(): Promise<AppState> {
	const data = await chrome.storage.local.get(KEY);
	return (data[KEY] as AppState | undefined) ?? { count: 0, lastUpdated: 0 };
}

export async function writeState(next: AppState): Promise<void> {
	await chrome.storage.local.set({ [KEY]: next });
}
