require('dotenv').config();

const listHardwares = require('../dist/hardware').listHardwares;

listHardwares().then(hrd => {
  console.log(hrd);
});
