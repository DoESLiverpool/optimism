class ModelItemsBase {
  constructor (model, tableName, primaryKeyColumn, otherColumns) {
    this.model = model;
    this.knex = model.knex;
    this.tableName = tableName;
    this.primaryKeyColumn = primaryKeyColumn;
    this.otherColumns = otherColumns;
    this.jsonToTableNames = this.getJsonToTableNames(otherColumns);
  }

  getSelectQuery () {
    const selectArgs = [];
    selectArgs.push(this.getSelectPart(this.primaryKeyColumn));
    this.otherColumns.forEach(column => {
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

  getInsertQuery (item) {
    return this.knex(this.tableName).insert(item);
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
    const query = this.getInsertQuery(itemWithColumnNames);
    return query.then((results) => { return results; });
  }

  convertJsonNamesToColumnNames (jsonItem) {
    const columnItem = {};
    Object.keys(jsonItem).forEach(key => {
      columnItem[this.jsonToTableNames[key]] = jsonItem[key];
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
