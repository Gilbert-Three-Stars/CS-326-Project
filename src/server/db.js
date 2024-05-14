import PouchDB from "pouchdb";
const db = new PouchDB("user");

//saves the data to the database
export async function save(name, data) {
    await db.put({ _id: name, data }); 
}

  //modifies an data
export async function modify(doc) {
    await db.put(doc);
}

  //load data
export async function load(name) {
    const data = await db.get(name);
    return data;
}
  //removes data
export async function del(name) {
    let doc = await load(name);
    db.remove(doc);
}
  //returns all data
export async function loadAll() {
    const result = await db.allDocs({ include_docs: true });
    return result.rows.map((row) => row.doc);
}
