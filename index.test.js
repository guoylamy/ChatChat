var config = require("./db-config");
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  },
});

const request = require('supertest');
const dbLib = require('./routes');

let db;
const webapp = require('./index');

const connect = async (credentials) => {
  try {
    const connection = await mysql.createConnection({
      host: credentials.host,
      user: credentials.user,
      password: credentials.password,
      database: credentials.database,
    });
      // Connected to db
    console.log(`Connected to database: ${connection.connection.config.database}`);
    return connection;
  } catch (err) {
    console.log(err.message);
  }
};

// cleanup the database after each test
const clearDatabase = async () => {
  await knex('user_table').where('user_name', 'IndexTestUser').del();
};

beforeAll(async () => {
  db = await connect(config);
});

afterEach(async () => {
  await clearDatabase();
});

describe(' API tests', () => {
  // test data
  const testPlayer = {
    userName: 'IndexTestUser',
    password: 'test'
  };

  test('register', () => request(webapp).get('/api/register/IndexTestUser/test').send('userName=IndexTestUser&password=test').expect(200));
  test('login', () => request(webapp).get('/api/login/IndexTestUser/test').send('userName=IndexTestUser&password=test').expect(200));
  test('login if UserName Exists', () => request(webapp).get('/api/login/IndexTestUser').send('userName=IndexTestUser').expect(200));

});