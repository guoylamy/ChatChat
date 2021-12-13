var config = require("./db-config");
const dbLib = require('./routes');
const mysql = require('mysql2/promise');
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

// Connect to our db on the cloud
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

let db;

// cleanup the database after each test
const clearDatabase = async () => {
  await knex('user_table').where('user_name', 'RoutesTestUser').del();
};

afterEach(async () => {
  await clearDatabase();
  await db.end();
});

describe('API tests (routes)', () => {
  // test data
  const testPlayer = {
    username: 'RoutesTestUser',
    password: 'test'
  };
  test('register works', async () => {
    db = await connect(config);
    await dbLib.register({ params: testPlayer },  '1');
    const newPlayer = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser');
    expect(newPlayer[0].user_name).toBe('RoutesTestUser');
  });

  test('verify login works', async () => {
    db = await connect(config);
    await dbLib.register({ params: testPlayer },  '1');
    await dbLib.verifyLogin({ params: testPlayer },  '1');
    const login_user = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser');
    expect(login_user).not.toBeNull();;
  });

  test('getMyGroups works', async () => {
    db = await connect(config);
    await dbLib.getMyGroups({ params: { username: '123' } },  '1');
    const NewGroupName = await knex.select('group_name').from('group_table').where('group_name', '=', 'dua lipa');
    expect(NewGroupName).not.toBeNull();
  });

  test('getPublicGroups works', async () => {
    db = await connect(config);
    await dbLib.getPublicGroups({ params: { username: '123' } },  '1');
    const NewPublic = await knex.select('group_name').from('group_table').where('group_name', '=', 'dua lipa');
    expect(NewPublic).not.toBeNull();
  });

  test('getPrivateGroups works', async () => {
    db = await connect(config);
    await dbLib.getPrivateGroups({ params: { username: '123' } },  '1');
    const PrivateGroups = await knex.select('group_name').from('group_table').where('group_name', '=', 'dua lipa');
    expect(PrivateGroups).not.toBeNull();
  });


});
