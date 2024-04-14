import PouchDB from "pouchdb";

const db = new PouchDB("counters");

/**
 * Asynchronously saves a new counter to the database with a specified name and
 * count. If a counter with the same name already exists, it will be
 * overwritten.
 *
 * @async
 * @param {string} name - The unique identifier for the counter.
 * @param {number} count - The initial count value for the counter.
 * @returns {Promise<void>} - A promise that resolves when the counter has been
 * successfully saved.
 * @throws {Error} - Throws an error if the operation fails, e.g., due to
 * database connectivity issues.
 */
export async function saveCounter(name, count) {
  await db.put({ _id: name, count });
}

/**
 * Asynchronously modifies an existing counter in the database. The counter
 * document must include an `_id` property that matches the counter's name in
 * the database.
 *
 * @async
 * @param {Object} doc - The counter document to be updated. Must include `_id`
 * and `count` properties.
 * @returns {Promise<void>} - A promise that resolves when the counter has been
 * successfully modified.
 * @throws {Error} - Throws an error if the operation fails, e.g., the counter
 * does not exist or database issues.
 */
export async function modifyCounter(doc) {
  await db.put(doc);
}

/**
 * Asynchronously retrieves a counter from the database by its name.
 *
 * @async
 * @param {string} name - The name of the counter to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the counter document.
 * @throws {Error} - Throws an error if the counter cannot be found or if there
 * is a database issue.
 */
export async function loadCounter(name) {
  const counter = await db.get(name);
  return counter;
}

/**
 * Asynchronously removes a counter from the database by its name.
 *
 * @async
 * @param {string} name - The name of the counter to be removed.
 * @returns {Promise<void>} - A promise that resolves when the counter has been
 * successfully removed.
 * @throws {Error} - Throws an error if the counter cannot be removed, e.g., it
 * does not exist or due to database issues.
 */
export async function removeCounter(name) {
  db.remove(name);
}

/**
 * Asynchronously retrieves all counters from the database.
 *
 * @async
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of
 * counter documents.
 * @throws {Error} - Throws an error if there is a problem accessing the
 * database.
 */
export async function loadAllCounters() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}