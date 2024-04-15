import PouchDB from "pouchdb";

export class UserDB{

  #db;

  constructor(name) {
    this.#db = new PouchDB(name); 
  }

  //saves the data to the database
  async save(name, data) {
    await this.#db.put({ _id: name, data }); 
  }

  //modifies an data
  async  modify(doc) {
    await this.#db.put(doc);
  }

  //load data
  async  load(name) {
    const counter = await this.#db.get(name);
    return counter;
  }
  //removes data
  async remove(name) {
    this.#db.remove(name);
  }
  // async loadAll() {
  //   const result = await db.allDocs({ include_docs: true });
  //   return result.rows.map((row) => row.doc);
  // }
}

