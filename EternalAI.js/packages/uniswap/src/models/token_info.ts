import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import {an} from "vitest/dist/chunks/reporters.DTtkbAtP";
import {Db} from "../db";

export class TokenInfo  {
    tableName: string
    db: any

    constructor() {
        this.tableName = "token_info";
        this.db = new(Db)
    }

    createTable = async (): Promise<void> =>  {
        await this.db.connect()

        const sql = `CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol varchar(10) NOT NULL,
        address varchar(255) NOT NULL UNIQUE)`

        try {
            await this.db.createTable(sql);
            console.log(`Table '${this.tableName}' created or already exists.`);
        } catch (error) {
            console.error("Error creating table:", error);
        } finally {
            await this.db.close();
        }

    }

    insert = async(symbol: string, address: string): Promise<void> => {
        await this.db.connect()

        const sql = `INSERT INTO ${this.tableName} (symbol, address) VALUES (?, ?)`
        const data = [symbol, address]

        await this.db.insertData(sql, data)

        await  this.db.close()
    }

    addressBySymbol = async(symbol: string): Promise<string | null> => {
        await this.db.connect()

        const sql = `SELECT address from ${this.tableName} where symbol = ?`
        const data = [symbol]

        const address = await this.db.findOne(sql, data)

        try {
            const address = await this.db.findOne(sql, data); // Assuming `findOne` should be `get`
            return address ? address.address : null; // Return the address or null if not found
        } catch (error) {
            console.error("Error retrieving address:", error);
            return null; // Return null in case of an error
        } finally {
            await this.db.close(); // Ensure the database connection is closed
        }
    }

}