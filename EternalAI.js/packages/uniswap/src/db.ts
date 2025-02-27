import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export class Db {
    dataBase: any
    dbName: string

    constructor() {
        this.dbName = "./db/uniswap";
    }

    connect = async () => {
        const _db = await open({
            filename: this.dbName,
            driver: sqlite3.Database
        });


        this.dataBase = _db
    }

    close = async () => {
        await this.dataBase.close();
    }

    createTable = async (sqlSt: string) => {

        await this.dataBase.exec(sqlSt);

    }

    insertData = async (sql: string, data: any[]) => {

        await this.dataBase.run(sql, data);
        console.log(`Inserted user: ${name}`);
        
    }

    query = async  (sql: string) : Promise<any> => {
        const rows = await this.dataBase.all(sql);
        return  rows
    }

    findOne = async  (sql: string, data: any[]) : Promise<any> => {
        const rows = await this.dataBase.get(sql, data);
        return  rows
    }
}