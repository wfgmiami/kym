const app = require('../../../server/app');
// console.log(app.get('projectRoot'));

const db = require(`${app.get('serverRoot')}/db`);

console.log(db);

const pathToData = fileName => `../../../server/db/data/${fileName}`;
const rawDataSliced = (fileName, startSlice, endSlice) => require(pathToData(fileName)).slice(startSlice || 0, endSlice || startSlice || 10);

module.exports = {
  abbrev: rawDataSliced('abbrev-sep'),
};
