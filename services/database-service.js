// Import the openDB function from the idb library
import { openDB } from "idb";

// Define constants for database name, store name, and version
const DB_NAME = "data-stream-db";
const STORE_NAME = "my-store";
const VERSION = 1;

// Initialize the IndexedDB database
export async function initDB() {
  return openDB(DB_NAME, VERSION, {
    // The upgrade function is called when the database is first created or upgraded
    upgrade(db) {
      // Check if the object store (like a table) already exists, if not, create it
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

// Function to set an item in the database
export async function setItem(key, value) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite"); // Start a readwrite transaction
  tx.objectStore(STORE_NAME).put(value, key); // Put the value into the object store
  await tx.done; // Wait for the transaction to complete
}

// Function to get an item from the database
export async function getItem(key) {
  const db = await initDB();
  return db.transaction(STORE_NAME).objectStore(STORE_NAME).get(key); // Get the value from the object store
}

// Function to delete an item from the database
export async function deleteItem(key) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite"); // Start a readwrite transaction
  tx.objectStore(STORE_NAME).delete(key); // Delete the value from the object store
  await tx.done; // Wait for the transaction to complete
}

// Function to clear all items from the database
export async function clearDB() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite"); // Start a readwrite transaction
  tx.objectStore(STORE_NAME).clear(); // Clear all values from the object store
  await tx.done; // Wait for the transaction to complete
}
