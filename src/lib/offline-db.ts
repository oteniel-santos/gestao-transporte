// import { openDB } from "idb";

// export const dbPromise = openDB("cadastros-transporte", 1, {
//   upgrade(db) {
//     db.createObjectStore("pendentes", {
//       keyPath: "id",
//       autoIncrement: true,
//     });
//   },
// });

// export async function salvarOffline(dados: any) {
//   const db = await dbPromise;
//   await db.add("pendentes", {
//     ...dados,
//     createdAt: new Date().toISOString(),
//   });
// }

// export async function listarPendentes() {
//   const db = await dbPromise;
//   return db.getAll("pendentes");
// }

// export async function removerPendente(id: number) {
//   const db = await dbPromise;
//   await db.delete("pendentes", id);
// }
import { openDB, IDBPDatabase } from "idb";

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!dbPromise) {
    dbPromise = openDB("cadastros-transporte", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("pendentes")) {
          db.createObjectStore("pendentes", { keyPath: "id" });
        }
      },
    });
  }

  return dbPromise;
}
