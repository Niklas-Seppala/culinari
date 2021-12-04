'use strict';
const fkName = model => {
  const splitName = model.getTableName().split('_');
  const name = splitName[splitName.length - 1];
  return name;
};

module.exports = fkName;
