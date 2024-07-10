/**
 * The schema of the database, where the first element of each array is the primary key.
 * @type {Object.<string, string[]>}
 */
export default {
    Users: ["id", "name", "email"],
    Books: ["id", "name", "author_name", "genre", "year", "rating"],
}