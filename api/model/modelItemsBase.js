class ModelItemsBase {
  constructor (model, tableName, primaryKeyColumn, allColumns) {
    this.model = model;
    this.knex = model.knex;
    this.tableName = tableName;
    this.primaryKeyColumn = primaryKeyColumn;
    this.allColumns = allColumns;
    this.jsonToTableNames = this.getJsonToTableNames(allColumns);
  }

  getSelectQuery () {
    const selectArgs = [];
    this.allColumns.forEach(column => {
      selectArgs.push(this.getSelectPart(column));
    });
    return this.knex.select(...selectArgs).from(this.tableName);
  }

  getSelectPart (column) {
    const parts = column.split('=');
    const columnName = parts[0];
    const jsonName = parts.length === 2 ? parts[1] : parts[0];
    return `${this.tableName}.${columnName} as ${jsonName}`;
  }

  get (id) {
    const query = this.getSelectQuery().where(`${this.tableName}.${this.primaryKeyColumn}`, id);
    return query.then((results) => {
      return results.length === 0 ? null : results[0];
    });
  }

  getAll () {
    const query = this.getSelectQuery().orderBy(`${this.tableName}.${this.primaryKeyColumn}`, 'asc');
    return query.then((results) => { return results; });
  }

  insert (item) {
    const itemWithColumnNames = this.convertJsonNamesToColumnNames(item);
    const query = this.knex(this.tableName).insert(itemWithColumnNames);
    return query.then((results) => { return results; });
  }

  update (item) {
    const itemWithColumnNames = this.convertJsonNamesToColumnNames(item);
    const query = this.knex(this.tableName).update(itemWithColumnNames).where({ id: itemWithColumnNames.id });
    return query.then((results) => { return results; });
  }

  delete (id) {
    const query = this.knex(this.tableName).delete().where({ id: id });
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
