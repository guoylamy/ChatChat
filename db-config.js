require('dotenv').config();

module.exports = {
  host: process.env.host,
  port: process.env.dbport,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
};
