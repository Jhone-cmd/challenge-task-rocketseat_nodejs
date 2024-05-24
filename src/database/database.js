// task = {[....]}
import fs from "fs/promises";

const databasePath = new URL("tasks.json", import.meta.url);

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, "utf8")
        .then((data) => {
            this.#database = JSON.parse(data);
        })
        .catch(() => {
            this.#persist();
        }) 
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
    }

    select(table, search) {
        let data = this.#database[table] ?? []
        
        if(search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase());
                });
            });
        }
        return data;
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        this.#persist();
        return data;
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex > -1) {
            const row = this.#database[table][rowIndex] // Fornece os dados da linha
            this.#database[table][rowIndex] = { id, ...row,...data } // Row => deixa os dados da linha que não serão alterados intactos; data => altera os dados que foram enviados, modificando somente eles e deixando os outros dados intactos.
            this.#persist();
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
        }
    }
}