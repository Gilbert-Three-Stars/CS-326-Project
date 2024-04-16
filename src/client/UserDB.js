// import { PouchDB } from 'pouchdb'

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
  async load(name) {
    const data = await this.#db.get(name);
    return data;
  }
  //removes data
  async delete(name) {
    let doc = await this.load(name);
    this.#db.remove(doc);
  }
  async loadAll() {
    const result = await this.#db.allDocs({ include_docs: true });
    return result.rows.map((row) => row.doc);
  }
}

