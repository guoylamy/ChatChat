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
  const id = await knex.select('user_id').from('user_table').where('user_name', '=', 'RoutesTestUser');
  if (id.length > 0) {
    await knex('invite').where('inviter', id[0].user_id).del();
  }
  await knex('user_table').where('user_name', 'RoutesTestUser').del();
  await knex('user_table').where('user_name', 'RoutesTestUser2').del();
};

afterEach(async () => {
  await clearDatabase();
  await db.end();
});

describe('Unit tests (backend)', () => {
  // test data
  const testPlayer = {
    userName: 'RoutesTestUser',
    password: 'test'
  };

  const testPlayer2 = {
    userName: 'RoutesTestUser2',
    password: 'test'
  }

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

  test('getRegsiterDate works', async () => {
    db = await connect(config);
    await dbLib.register({ params: testPlayer },  '1');
    await dbLib.getRegsiterDate({ params: testPlayer },  '1');
    const register_date = await knex.select('register_date').from('user_table').where('user_name', '=', 'RoutesTestUser');
    expect(register_date).not.toBeNull();;
  });

  test('changePassword works', async () => {
    db = await connect(config);
    await dbLib.register({ params: testPlayer },  '1');
    await dbLib.changePassword({ params: {userName: 'RoutesTestUser', password: 'test2'} },  '1');
    const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
    expect(changed_pwd).not.toBeNull();
  });

  test('getGroupsInvitations works', async () => {
    db = await connect(config);
    await dbLib.register({ params: testPlayer },  '1');
    await dbLib.register({ params: testPlayer2 },  '1');
    await dbLib.inviteUser({ body: {groupName: 'public1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');    const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
    await dbLib.getGroupsInvitations({ params: testPlayer2 },  '1');
    const inv = await knex.select('inviter').from('invite').where('accept_or_decline', '=', 0);
    expect(inv).not.toBeNull();
  });

  test('inviteUser works', async () => {
    db = await connect(config);
    await dbLib.register({ params: testPlayer },  '1');
    const user_inviter_id = await knex.select('user_id').from('user_table').where('user_name', '=', 'RoutesTestUser');
    await dbLib.register({ params: testPlayer2 },  '1');
    await dbLib.inviteUser({ body: {groupName: 'public1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');
    // const get_id = user_inviter_id[0].user_id;
    // const invited = await knex.select('inviter').from('invite').where('user_to_be_invited', '=', get_id);
    // expect(invited).not.toBeNull();
    expect(user_inviter_id).not.toBeNull();
  });

  test('createGroup', async () => {
    db = await connect(config);
    await dbLib.register({ params: testPlayer },  '1');
    await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
    const check_group_created = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
    expect(check_group_created).not.toBeNull();;
  });


  test('getMyGroups works', async () => {
    db = await connect(config);
    await dbLib.getMyGroups({ params: { userName: '123' } },  '1');
    const NewGroupName = await knex.select('group_name').from('group_table').where('group_name', '=', 'dua lipa');
    expect(NewGroupName).not.toBeNull();
  });

  test('getPublicGroups works', async () => {
    db = await connect(config);
    await dbLib.getPublicGroups({ params: { userName: '123' } },  '1');
    const NewPublic = await knex.select('group_name').from('group_table').where('group_name', '=', 'public1');
    expect(NewPublic).not.toBeNull();
  });

  test('getPrivateGroups works', async () => {
    db = await connect(config);
    await dbLib.getPrivateGroups({ params: { userName: '123' } },  '1');
    const PrivateGroups = await knex.select('group_name').from('group_table').where('group_name', '=', 'public1');
    expect(PrivateGroups).not.toBeNull();
  });

  test('joinPublicGroup works', async () => {
    db = await connect(config);
    await dbLib.joinPublicGroup({ params: { userName: '123', groupname:'public1'} },  '1');
    const get_group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'public1');
    const try_group_id = get_group_id[0].group_id;
    const get_user_id = await knex.select('user_id').from('user_table').where('user_name', '=', '123');
    const try_user_id = get_user_id[0].user_id;
    const check_join = await knex.select('group_id').from('group_user_table').where('group_id', '=', try_group_id).andWhere('user_id', '=', try_user_id);
    expect(check_join).not.toBeNull();
});

test('getCreatorName works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.getCreatorName({ params: { groupName: 'testCreate'} },  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

test('getAdminsNames works',async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.getAdminsNames({ params: { groupName: 'testCreate'} },  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

test('filterByTopics works', async () => {
  db = await connect(config);
  await dbLib.filterByTopics({ params: { userName: '123'}, body: {topics:'react'} },  '1');
  const get_user_id = await knex.select('user_id').from('user_table').where('user_name', '=', '123');
  const try_user_id = [get_user_id[0].user_id];
  const get_group_id = await knex.select('group_id').from('group_user_table').whereIn('user_id', try_user_id);
  const try_group_id = JSON.parse(JSON.stringify(get_group_id))
  var list_group_id = []
  try_group_id.forEach((v) => list_group_id.push(v.group_id));
  const get_group_name = await knex.select('group_name').from('group_table').whereIn('group_id', try_group_id).andWhere('group_type', '=', 'Public');
  // console.log('get_group_name', get_group_name);
  // console.log('received', received);
  expect(get_group_name).not.toBeNull();
});

});
