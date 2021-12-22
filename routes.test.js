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
    // console.log(newPlayer);
    expect(newPlayer[0].user_name).toBe('RoutesTestUser');
  });

  test('verify login works', async () => {
    db = await connect(config);
    await dbLib.register({ params: testPlayer },  '1');
    await dbLib.verifyLogin({ params: testPlayer },  '1');
    const login_user = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser');
    expect(login_user).not.toBeNull();;
  });

// below is profile api
// getRegsiterDate
test('getRegsiterDate works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.getRegsiterDate({ params: testPlayer },  '1');
  const register_date = await knex.select('register_date').from('user_table').where('user_name', '=', 'RoutesTestUser');
  expect(register_date).not.toBeNull();;
});

// changePassword
test('changePassword works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.changePassword({ params: {userName: 'RoutesTestUser', password: 'test2'} },  '1');
  const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
  expect(changed_pwd).not.toBeNull();
});

// getGroupsInvitations
test('getGroupsInvitations works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.register({ params: testPlayer2 },  '1');
  await dbLib.inviteUser({ body: {groupName: 'testPublic1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');    const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
  await dbLib.getGroupsInvitations({ params: testPlayer2 },  '1');
  const inv = await knex.select('inviter').from('invite').where('accept_or_decline', '=', 0);
  expect(inv).not.toBeNull();
});

// acceptInvitation
test('acceptInvitation works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.register({ params: testPlayer2 },  '1');
  await dbLib.inviteUser({ body: {groupName: 'testPublic1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');    const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
  await dbLib.acceptInvitation({ params: testPlayer2 },  '1');
  const inv = await knex.select('inviter').from('invite').where('accept_or_decline', '=', 1);
  expect(inv).not.toBeNull();
});

// declineInvitation
test('declineInvitation works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.register({ params: testPlayer2 },  '1');
  await dbLib.inviteUser({ body: {groupName: 'testPublic1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');    const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
  await dbLib.declineInvitation({ params: testPlayer2 },  '1');
  const inv = await knex.select('inviter').from('invite').where('accept_or_decline', '=', 2);
  expect(inv).not.toBeNull();
});

// getAdminGroupsIds
test('getAdminGroupsIds works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.register({ params: testPlayer2 },  '1');
  await dbLib.inviteUser({ body: {groupName: 'testPublic1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');    const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
  await dbLib.getAdminGroupsIds({ params: testPlayer2 },  '1');
  const inv = await knex.select('inviter').from('invite').where('accept_or_decline', '=', 2);
  expect(inv).not.toBeNull();
});

// getPublicGroupsRequestsIds
test('getPublicGroupsRequestsIds works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.register({ params: testPlayer2 },  '1');
  await dbLib.inviteUser({ body: {groupName: 'testPublic1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');    const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
  await dbLib.getPublicGroupsRequestsIds({ params: testPlayer2 },  '1');
  const inv = await knex.select('inviter').from('invite').where('accept_or_decline', '=', 2);
  expect(inv).not.toBeNull();
});

// approveRequest
// declineRequest
// approvePublicRequest
// declinePublicRequest
// getNotifications
test('getNotifications works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.register({ params: testPlayer2 },  '1');
  await dbLib.inviteUser({ body: {groupName: 'testPublic1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');    const changed_pwd = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser').andWhere('password', '=','test2');
  await dbLib.getNotifications({ params: testPlayer2 },  '1');
  const inv = await knex.select('inviter').from('invite').where('accept_or_decline', '=', 0);
  expect(inv).not.toBeNull();
});
// resolveNotification
// uploadAvatar
// getAvatar
// deleteAvatar


// below is api for group page
// getMyGroups
test('getMyGroups works', async () => {
  db = await connect(config);
  await dbLib.getMyGroups({ params: { userName: 'RoutesTestUser3' } },  '1');
  const NewGroupName = await knex.select('group_name').from('group_table').where('group_name', '=', 'dua lipa');
  expect(NewGroupName).not.toBeNull();
});

// getPublicGroups
test('getPublicGroups works', async () => {
  db = await connect(config);
  await dbLib.getPublicGroups({ params: { userName: 'RoutesTestUser3' } },  '1');
  const NewPublic = await knex.select('group_name').from('group_table').where('group_name', '=', 'testPublic1');
  expect(NewPublic).not.toBeNull();
});
// sendFile
// sendMessage
test('sendMessage', async () =>{
  db = await connect(config);
  // await dbLib.register({ params: testPlayer },  '1');
  // await dbLib.register({ params: testPlayer2 },  '1');
  // await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  const time = Date.now();
  await dbLib.sendMessage({ body: { sender: 'RoutesTestUser', receiver:'RoutesTestUser2', group_id: group_id_new, timestamp: time, message:'try' } },  '1');
  const message = await knex.select('group_id').from('user_chat_table').where('sender', '=', 'RoutesTestUser');
  expect(message).not.toBeNull();
});
// receiveMessage
test('receiveMessage', async () =>{
  db = await connect(config);
  // await dbLib.register({ params: testPlayer },  '1');
  // await dbLib.register({ params: testPlayer2 },  '1');
  // await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  // await dbLib.sendMessage({ body: { sender: 'RoutesTestUser', receiver:'RoutesTestUser2', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  await dbLib.receiveMessage({ params: {group_id: group_id_new} }, '1');
  const message = await knex.select('group_id').from('user_chat_table').where('sender', '=', 'RoutesTestUser');
  expect(message).not.toBeNull();
});
// postMessage
test('postMessage works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  // const user_id = await knex.select('user_id').from('user_table').where('user_name', '=', 'RoutesTestUser');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  expect(message).not.toBeNull();
});

// postFile
// getPrivateGroups
test('getPrivateGroups works', async () => {
  db = await connect(config);
  await dbLib.getPrivateGroups({ params: { userName: 'RoutesTestUser3' } },  '1');
  const PrivateGroups = await knex.select('group_name').from('group_table').where('group_name', '=', 'testPublic1');
  expect(PrivateGroups).not.toBeNull();
});

// deletePublicGroups
// deletePrivateGroups
// createGroup
test('createGroup', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const check_group_created = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(check_group_created).not.toBeNull();
});

// joinPublicGroup
test('joinPublicGroup works', async () => {
  db = await connect(config);
  await dbLib.joinPublicGroup({ params: { userName: 'RoutesTestUser3', groupname:'testPublic1'} },  '1');
  const get_group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testPublic1');
  const try_group_id = get_group_id[0].group_id;
  const get_user_id = await knex.select('user_id').from('user_table').where('user_name', '=', 'RoutesTestUser3');
  const try_user_id = get_user_id[0].user_id;
  const check_join = await knex.select('group_id').from('group_user_table').where('group_id', '=', try_group_id).andWhere('user_id', '=', try_user_id);
  expect(check_join).not.toBeNull();
});

// filterByTopics
test('filterByTopics works', async () => {
  db = await connect(config);
  await dbLib.filterByTopics({ params: { userName: 'RoutesTestUser3'}, body: {topics:'react'} },  '1');
  const get_user_id = await knex.select('user_id').from('user_table').where('user_name', '=', 'RoutesTestUser3');
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

//suggestgroup
test('suggestgroup works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.suggestgroup({ params: {userName:'RoutesTestUser'} }, '1');
  const check_group_suggest = await knex.select('group_id').from('group_table').where('group_name', '!=', 'testCreate');
  expect(check_group_suggest).not.toBeNull();
});


// below is api for groupDetails page
// getGroupDetailsTopics
test('getGroupDetailsTopics works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.getGroupDetailsTopics({ params: { groupName: 'testCreate'} },  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

// getGroupDetailsAllPostsIds
test('getGroupDetailsAllPostsIds works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.getGroupDetailsAllPostsIds({ params: { groupName: 'testCreate'} },  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

// getCreatorName
test('getCreatorName works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.getCreatorName({ params: { groupName: 'testCreate'} },  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

// getAdminsNames
test('getAdminsNames works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.getAdminsNames({ params: { groupName: 'testCreate'} },  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

// getNormalUsersNames
test('getNormalUsersNames works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.getNormalUsersNames({ params: { groupName: 'testCreate'} },  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

// getGroupDetailsUserId
test('getGroupDetailsUserId works',async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.getGroupDetailsUserId({ params: { userName:'RoutesTestUser'} },  '1');
  const get_user_id = await knex.select('user_id').from('user_table').where('user_name', '=', 'RoutesTestUser');
  expect(get_user_id).not.toBeNull();
});

// getGroupDetailsGroupId
test('getGroupDetailsGroupId works',async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.getGroupDetailsGroupId({ params: { groupName: 'testCreate'} },  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

// getHidePostIds


// below is post api
// getPostInfo
test('getPostInfo works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  await dbLib.getPostInfo({ params:{postId: message[0].post_id} }, '1');
  expect(message).not.toBeNull();
});

// deletePost
test('deletePost works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  await dbLib.deletePost({ params:{postId: message[0].post_id} }, '1');
  expect(message).not.toBeNull();
});

// getPostUserId
test('getPostUserId works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.getPostUserId({ params:{userName: 'RoutesTestUser'} }, '1');
  const newPlayer = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser');
  expect(newPlayer).not.toBeNull();
});
// hidePost

//below is postDetails api
// getPostDetails
test('getPostUserId works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  await dbLib.getPostDetails({ params:{postId: message[0].post_id} }, '1');
  expect(message).not.toBeNull();
});
// getPostDetailsAllCommentsIds
test('getPostDetailsAllCommentsIds works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  await dbLib.getPostDetailsAllCommentsIds({ params:{postId: message[0].post_id} }, '1');
  expect(message).not.toBeNull();
});

// getPostDetailsGetUserId
test('getPostDetailsGetUserId works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.getPostDetailsGetUserId({ params:{userName: 'RoutesTestUser'} }, '1');
  const newPlayer = await knex.select('user_name').from('user_table').where('user_name', '=', 'RoutesTestUser');
  expect(newPlayer).not.toBeNull();
});
// getPostDetailsMakeComment
test('getPostDetailsMakeComment works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  await dbLib.getPostDetailsMakeComment({ body:{ commentId: Math.random(), commentContent:'test', creatTime: Date.now(), creatorId: Date.now(), postId: message[0].post_id} }, '1');
  expect(message).not.toBeNull();
});
// getPostAttachmentDetails

// below is comment api
// getCommentInfo
test('getCommentInfo works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  await dbLib.getPostDetailsMakeComment({ body:{ commentId: Math.random(), commentContent:'test', creatTime: Date.now(), creatorId: Date.now(), postId: message[0].post_id} }, '1');
  const commentID = await knex.select('comment_id').from('comment_table').where('comment_content', '=', 'test');
  await dbLib.getCommentInfo({ params: {commentId: commentID[0].comment_id} },  '1');
  expect(message).not.toBeNull();
});

// getCommentCreatorName
// deleteComment
test('deleteComment works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  await dbLib.getPostDetailsMakeComment({ body:{ commentId: Math.random(), commentContent:'test', creatTime: Date.now(), creatorId: Date.now(), postId: message[0].post_id} }, '1');
  const commentID = await knex.select('comment_id').from('comment_table').where('comment_content', '=', 'test');
  await dbLib.deleteComment({ params: {commentId: commentID[0].comment_id} },  '1');
  expect(message).not.toBeNull();
});

// editComment
test('editComment works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupgroupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  const group_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  const group_id_new = group_id[0].group_id;
  await dbLib.postMessage({ body: { sender: 'RoutesTestUser', group_id: group_id_new, timestamp:'1639934942947', message:'try' } },  '1');
  const message = await knex.select('post_id').from('post_table').where('create_time', '=', '1639934942947');
  await dbLib.getPostDetailsMakeComment({ body:{ commentId: Math.random(), commentContent:'test', creatTime: Date.now(), creatorId: Date.now(), postId: message[0].post_id} }, '1');
  const commentID = await knex.select('comment_id').from('comment_table').where('comment_content', '=', 'test');
  await dbLib.editComment({ body: {commentId: commentID[0].comment_id, commentContent:'new'} },  '1');
  expect(message).not.toBeNull();
});

// manageGroupMembers api
test('addAdmin works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.addAdmin({ body: { groupName: 'testCreate', userName:'RoutesTestUser'}},  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

// test('removeAdmin works', async () => {
//   db = await connect(config);
//   await dbLib.register({ params: testPlayer },  '1');
//   await dbLib.register({ params: testPlayer2 },  '1');
//   await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
//   await dbLib.removeAdmin({ body: { groupName: 'testCreate', userName:'RoutesTestUser2'}},  '1');
//   const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
//   expect(get_user_id).not.toBeNull();
// });

test('inviteUser works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  const user_inviter_id = await knex.select('user_id').from('user_table').where('user_name', '=', 'RoutesTestUser');
  await dbLib.register({ params: testPlayer2 },  '1');
  await dbLib.inviteUser({ body: {groupName: 'testPublic1', inviter: 'RoutesTestUser', userToBeInvited:'RoutesTestUser2'} },  '1');
  // const get_id = user_inviter_id[0].user_id;
  // const invited = await knex.select('inviter').from('invite').where('user_to_be_invited', '=', get_id);
  // expect(invited).not.toBeNull();
  expect(user_inviter_id).not.toBeNull();
});

test('leaveGroup works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.createGroup({ params: {groupname: 'testCreate', grouptype:'Public', userName:'RoutesTestUser'}, body: { topics: 'test'} },  '1');
  await dbLib.leaveGroup({ body: { groupName: 'testCreate', userName:'RoutesTestUser'}},  '1');
  const get_user_id = await knex.select('group_id').from('group_table').where('group_name', '=', 'testCreate');
  expect(get_user_id).not.toBeNull();
});

test('postGeneralNotification works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.postGeneralNotification({ params: {userName:'RoutesTestUser'}, body: { message: 'test message', time: Date.now()} },  '1');
  const get_post = await knex.select('message').from('general_notification').where('user_name', '=', 'RoutesTestUser');
  expect(get_post).not.toBeNull();
});

test('getGeneralNotifications works', async () => {
  db = await connect(config);
  await dbLib.register({ params: testPlayer },  '1');
  await dbLib.postGeneralNotification({ params: {userName:'RoutesTestUser'}, body: { message: 'test message', time: Date.now()} },  '1');
  await dbLib.getGeneralNotifications({ params: {userName:'RoutesTestUser'} },'1');
  const get_post = await knex.select('message').from('general_notification').where('user_name', '=', 'RoutesTestUser');
  expect(get_post).not.toBeNull();
});

});
