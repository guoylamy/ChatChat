var config = require("./db-config");
const mysql = require("mysql2")
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
    console.log(`Connected to database: ${connection.config.database}`);
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

  // profile page api
  test('get my groups', () => request(webapp).get('/api/profile/getmygroups/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get Regsiter Date', () => request(webapp).get('/api/profile/getRegsiterDate/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get group invitations', () => request(webapp).get('/api/profile/getGroupsInvitations/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get group Admin group IDs', () => request(webapp).get('/api/profile/getAdminGroupsIds/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get public group request IDs', () => request(webapp).get('/api/profile/getPublicGroupsRequestsIds/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get notifications', () => request(webapp).get('/api/profile/getNotifications/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get Flagged Notifications', () => request(webapp).get('/api/profile/getFlaggedNotifications/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get avatar', () => request(webapp).get('/api/profile/getavatar/IndexTestUser').send('userName=IndexTestUser').expect(200));

  // general notification
  test('get General Notifications', () => request(webapp).get('/api/getGeneralNotifications/IndexTestUser').send('userName=IndexTestUser').expect(200));

  // group page
  test('get group page public groups', () => request(webapp).get('/api/grouppage/public/IndexTestUser/2').send('userName=IndexTestUser&order=2').expect(200));

  test('get group page private groups', () => request(webapp).get('/api/grouppage/private/IndexTestUser').send('userName=IndexTestUser').expect(200));
  
  test('get group page suggested groups', () => request(webapp).get('/api/grouppage/suggestgroup/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get group page all public groups', () => request(webapp).get('/api/grouppage/getAllPublicGroups').expect(200));

  // group details api
  test('get group details topics', () => request(webapp).get('/api/groupDetails/topics/IndexGroup').send('groupName=IndexGroup').expect(200));

  test('get group details all posts ids', () => request(webapp).get('/api/groupDetails/allpostsids/IndexGroup').send('groupName=IndexGroup').expect(200));

  test('get group details Creator Name', () => request(webapp).get('/api/groupDetails/getCreatorName/IndexGroup').send('groupName=IndexGroup').expect(200));

  test('get group details Admin Name', () => request(webapp).get('/api/groupDetails/getAdminsNames/IndexGroup').send('groupName=IndexGroup').expect(200));

  test('get group details Normal user names', () => request(webapp).get('/api/groupDetails/getNormalUsersNames/IndexGroup').send('groupName=IndexGroup').expect(200));

  test('get group details user id', () => request(webapp).get('/api/groupDetails/getUserId/IndexTestUser').send('userName=IndexTestUser').expect(200));

  test('get group details group id', () => request(webapp).get('/api/groupDetails/getGroupId/IndexGroup').send('groupName=IndexGroup').expect(200));

  test('get group details hide post id', () => request(webapp).get('/api/groupDetails/getHidePostIds/IndexTestUser').send('serName=IndexTestUser').expect(200));

  // post
  test('get post user id', () => request(webapp).get('/api/post/findUserId/IndexTestUser').send('serName=IndexTestUser').expect(200));

  // post details
  test('get post details user id', () => request(webapp).get('/api/postDetails/getUserId/IndexTestUser').send('serName=IndexTestUser').expect(200));
});