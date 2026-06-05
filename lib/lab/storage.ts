// ラボの進捗(クリア済みミッション)を IndexedDB に保存する。
const DB_NAME = "recon-lab";
const STORE = "kv";
const KEY = "completed";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadCompleted(): Promise<string[]> {
  try {
    const db = await open();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    });
  } catch { return []; }
}

export async function saveCompleted(ids: string[]): Promise<void> {
  try {
    const db = await open();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(ids, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch { /* noop */ }
}
