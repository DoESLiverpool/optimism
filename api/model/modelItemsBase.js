class ModelItemsBase {
  constructor (model, tableName, primaryKeyColumn, allColumns) {
    this.model = model;
    this.knex = model.knex;
    this.tableName = tableName;
    this.primaryKeyColumn = primaryKeyColumn;
    this.allColumns = allColumns;
    this.jsonToTableNames = this.getJsonToTableNames(allColumns);
  }

  getSelectQuery (knex) {
    const selectArgs = [];
    this.allColumns.forEach(column => {
      selectArgs.push(this.getSelectPart(column));
    });
    return knex.select(...selectArgs).from(this.tableName);
  }

  getSelectPart (column) {
    const parts = column.split('=');
    const columnName = parts[0];
    const jsonName = parts.length === 2 ? parts[1] : parts[0];
    return `${this.tableName}.${columnName} as ${jsonName}`;
  }

  getWhere (whereCondition, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const query = this.getSelectQuery(knexOrTrx).where(whereCondition);
    return query;
  }

  getById (id, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const query = this.getSelectQuery(knexOrTrx).where(`${this.tableName}.${this.primaryKeyColumn}`, id);
    return query.then((results) => {
      return results.length === 0 ? null : results[0];
    });
  }

  getAll (trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const query = this.getSelectQuery(knexOrTrx).orderBy(`${this.tableName}.${this.primaryKeyColumn}`, 'asc');
    return query.then((results) => { return results; });
  }

  insert (item, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const itemWithColumnNames = this.convertJsonNamesToColumnNames(item);
    const query = knexOrTrx(this.tableName).insert(itemWithColumnNames);
    return query.then((results) => { return results; });
  }

  update (item, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const itemWithColumnNames = this.convertJsonNamesToColumnNames(item);
    const query = knexOrTrx(this.tableName).update(itemWithColumnNames).where({ id: itemWithColumnNames.id });
    return query.then((results) => { return results; });
  }

  deleteWhere (whereCondition, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const query = knexOrTrx(this.tableName).delete().where(whereCondition);
    return query.then((results) => { return results; });
  }

  convertJsonNamesToColumnNames (jsonItem) {
    const columnItem = {};
    Object.keys(jsonItem).forEach(key => {
      const tableName = this.jsonToTableNames[key];
      columnItem[tableName] = jsonItem[key];
    });
    return columnItem;
  }

  getJsonToTableNames (columns) {
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
