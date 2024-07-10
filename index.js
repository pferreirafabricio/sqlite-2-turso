import 'dotenv/config'
import schema from './database/schema.js';
import initialTableCreation from './database/initial-table-creation.js'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { createClient } from '@libsql/client'
import { log } from './logger/index.js'
import { truncate } from './helpers/index.js'

sqlite3.verbose();

const sourceDbPath = process.env.SOURCE_DATABASE_PATH;
const tursoConnectionString = process.env.TURSO_DATABASE_URL;
const tursoConnectAuthToken = process.env.TURSO_AUTH_TOKEN;

const sourceDb = await open({
  filename: sourceDbPath,
  driver: sqlite3.Database,
});

const tursoDb = createClient({
  url: tursoConnectionString,
  authToken: tursoConnectAuthToken,
});

async function migrateTable(table, primaryColumn, columns = []) {
  log(`\nMigrating table ${table}...`);

  if (!await tableExistsOnTursoDb(table)) {
    log(`Table ${table} does not exist in Turso database. Creating...`);
    await createTableOnTursoDb(table);
  } else {
    log(`Table ${table} already exists in Turso database. Skipping creation...`);
  }

  const sourceQuery = `SELECT * FROM ${table}`;

  const result = await sourceDb.all(sourceQuery);

  for (const row of result) {
    const commonIdentifier = `${table}[${primaryColumn}] = ${row[primaryColumn]}`;
    log(`Migrating row with ${commonIdentifier}`);

    const exists = await keyExistsInTursoDb(table, primaryColumn, row[primaryColumn]);

    if (exists) {
      log(`Row with ${commonIdentifier} already exists in Turso database. Updating...`)
      await updateRowOnTursoDb(table, columns, Object.values(row));
      continue;
    }

    log(`Row with ${commonIdentifier} does not exist in Turso database. Inserting...`)
    await insertRowOnTursoDb(table, columns, Object.values(row));
  }
}

async function keyExistsInTursoDb(table, primaryColumn, key) {
  const query = `SELECT * FROM ${table} WHERE ${primaryColumn} = '${key}'`;

  const result = await tursoDb.execute(query);

  return result.rows.length > 0;
}

async function tableExistsOnTursoDb(tableName) {
  const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`;

  const exists = await tursoDb.execute(query);

  return exists.rows.length > 0;
}

async function createTableOnTursoDb(tableName) {
  const query = initialTableCreation[tableName];
  await tursoDb.execute(query);
}

async function updateRowOnTursoDb(table, columns = [], values = []) {
  const updateStatements = columns.map((column, index) => `${column} = '${values[index]}'`);
  const query = `UPDATE ${table} SET ${updateStatements.join(', ')} WHERE ${columns[0]} = '${values[0]}'`;

  log(`Update query: ${truncate(query)}`);
  await tursoDb.execute(query);
}

async function insertRowOnTursoDb(table, columns = [], values = []) {
  const columnsString = columns.join(', ');
  values = values.map(value => `'${value}'`);

  const query = `INSERT INTO ${table} (${columnsString}) VALUES (${values.join(', ')})`;

  log(`Insert query: ${truncate(query)}`);
  await tursoDb.execute(query);
}

(async function main() {
  try {
    console.time('migration-time');

    const migrationPromises = [];

    for (const tableIndex in schema) {
      migrationPromises.push(
        migrateTable(tableIndex, schema[tableIndex][0], schema[tableIndex])
      );
    }

    await Promise.all(migrationPromises);
  } catch (error) {
    console.error('Error during data transfer:', error);
  } finally {
    await sourceDb.close();
    tursoDb.close();

    console.timeEnd('migration-time');
  }
})();
