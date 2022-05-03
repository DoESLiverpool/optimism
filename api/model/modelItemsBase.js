/**
 * Base class representing individual database tables and providing a set of data access methods for them.
 */
class ModelItemsBase {
  /**
   * This should be called in a derived class constructor.
   *
   * @param {object} model - The model which owns this object.
   * @param {string} tableName - The name of the database table.
   * @param {string} primaryKeyColumn - The name of the primary key column (typically 'id')
   * @param {Array.<string>} allColumns - The array of table column names, including the primary key column. If
   *    the name of a column should have a different name in JSON, enter it as column_name=jsonName.
   */
  constructor (model, tableName, primaryKeyColumn, allColumns) {
    this.model = model;
    this.knex = model.knex;
    this.tableName = tableName;
    this.primaryKeyColumn = primaryKeyColumn;
    this.allColumns = allColumns;
    this.jsonToTableNames = this._getJsonToTableNames(allColumns);
  }

  /**
   * Gets a knex query to return all items.
   *
   * @param {Function} knex - A knex function used to construct the query
   * @returns {Promise} When resolved returns all records for the underlying table
   */
  getSelectQuery (knex) {
    const selectArgs = [];
    this.allColumns.forEach(column => {
      selectArgs.push(this._getSelectPart(column));
    });
    return knex.select(...selectArgs).from(this.tableName);
  }

  /**
   * Gets filtered results based on supplied column_name: value pairs.
   *
   * @param {Object<string, any>} whereCondition - { column_name: value, ... } pairs. For example { id: 123 }.
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {Promise} When resolved returns filtered results.
   */
  getWhere (whereCondition, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const columnNameWhereCondition = this._convertJsonNamesToColumnNames(whereCondition);
    const query = this.getSelectQuery(knexOrTrx).where(columnNameWhereCondition);
    return query;
  }

  /**
   * Gets an item with a specific id.
   *
   * @param {number} id - The id of the item to get.
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {Promise} When resolved returns the item with the supplied id, or null if it doesn't exist.
   */
  getById (id, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const query = this.getSelectQuery(knexOrTrx).where(`${this.tableName}.${this.primaryKeyColumn}`, id);
    return query.then((results) => {
      return results.length === 0 ? null : results[0];
    });
  }

  /**
   * Gets all items.
   *
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {Promise} When resolved returns an array of all items, or an empty array if there are no items.
   */
  getAll (trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    return this.getSelectQuery(knexOrTrx).orderBy(`${this.tableName}.${this.primaryKeyColumn}`, 'asc');
  }

  /**
   * Inserts a new item.
   *
   * @param {Object<string, any>} item - The item to insert. It must have all the columns except the id column.
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {Promise} When resolved returns an array of the form [{id: 123}] where the id is set to the inserted
   *  row id. If the knex client is not one of 'pg' or 'sqlite3' then a rejected promise is returned.
   */
  insert (item, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const itemWithColumnNames = this._convertJsonNamesToColumnNames(item);
    /* The value returned should be an array of the form:
       [{id: 16 }], where 16 in this example is the id of the inserted row.
       There is no single method provided by different databases to obtain
       this value. So specific code is needed for the different
       clients that Optimism supports.

       Currently these are pg (postgres) and sqlite3 (sqlite).
    */
    const client = knexOrTrx.client.config.client;
    if (client === 'sqlite3') {
      return knexOrTrx(this.tableName)
        .insert(itemWithColumnNames)
        .then(() => {
          return knexOrTrx.raw('SELECT last_insert_rowid() as id');
        });
    }
    if (client === 'pg') {
      return knexOrTrx(this.tableName).returning(this.primaryKeyColumn).insert(itemWithColumnNames);
    }
    return Promise.reject(
      new Error('The knex client is not supported. It must be one of \'pg\' or \'sqlite3\'')
    );
  }

  /**
   * Updates an existing item.
   *
   * @param {Object<string,any>} item - The item to update. It must include the id column and at least one other column.
   * @param {*} trx - Optional knex function to be supplied when using a transaction.
   * @returns {any} TODO
   */
  update (item, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const itemWithColumnNames = this._convertJsonNamesToColumnNames(item);
    return knexOrTrx(this.tableName).update(itemWithColumnNames).where({ id: itemWithColumnNames.id });
  }

  /**
   * Deletes an item with a specified id.
   *
   * @param {number} id - The id of the item to delete.
   * @param {*} trx - Optional knex function to be supplied when using a transaction.
   * @returns {any} TODO
   */
  deleteById (id, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    return knexOrTrx(this.tableName).delete().where({ id: id });
  }

  /**
   * Deletes items based on supplied column_name: value pairs.
   *
   * @param {Object<string, any>} whereCondition - { column_name: value, ... } pairs. For example { id: 123 }.
   * @param {*} trx - Optional knex function to be supplied when using a transaction.
   * @returns {any} TODO
   */
  deleteWhere (whereCondition, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const columnNameWhereCondition = this._convertJsonNamesToColumnNames(whereCondition);
    return knexOrTrx(this.tableName).delete().where(columnNameWhereCondition);
  }

  _getSelectPart (column) {
    const parts = column.split('=');
    const columnName = parts[0];
    const jsonName = parts.length === 2 ? parts[1] : parts[0];
    return `${this.tableName}.${columnName} as ${jsonName}`;
  }

  _convertJsonNamesToColumnNames (jsonItem) {
    const columnItem = {};
    Object.keys(jsonItem).forEach(key => {
      const tableName = this.jsonToTableNames[key];
      columnItem[tableName] = jsonItem[key];
    });
    return columnItem;
  }

  _getJsonToTableNames (columns) {
    const result = {};
    columns.forEach(column => {
      const parts = column.split('=');
      const columnName = parts[0];
      const jsonName = parts.length === 2 ? parts[1] : columnName;
      result[jsonName] = columnName;
    });
    return result;
  }
}

module.exports = ModelItemsBase;
