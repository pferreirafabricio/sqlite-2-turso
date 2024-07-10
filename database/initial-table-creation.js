/**
 * This file contains the SQL queries to create the initial tables
 * in the Turso database, if they do not already exist.
 * 
 * The keys of the object are the table names, and the values are the SQL queries.
 * 
 * @type {Object.<string, string>}
 */
export default {
    Users: `
        CREATE TABLE Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );
    `,
    Books: ` 
        CREATE TABLE Books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            author_name TEXT NOT NULL,
            genre TEXT,
            year INTEGER,
            rating REAL
        );
    `,
};