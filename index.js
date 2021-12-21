const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const http = require('http');
const multer = require('multer');
const path = require('path');
const routes = require('./routes');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
const port = process.env.PORT || 8081;
app.use(cors({ credentials: true, origin: `http://localhost:${port}` }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './app/client/build')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${port}`,
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    // console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    // console.log(`message in group: ${data}`);
    socket.to(data).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    // console.log("User Disconnected", socket.id);
  });
});

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get('/api/register/:userName/:password', routes.register);
app.get('/api/login/:userName/:password', routes.verifyLogin);
app.get('/api/login/:userName', routes.ifUserNameExists);

// profile page api
app.get('/api/profile/getmygroups/:userName', routes.getMyGroups);
app.get('/api/profile/getRegsiterDate/:userName', routes.getRegsiterDate);
app.post('/api/profile/changePassword/:userName/:password', routes.changePassword);
app.get('/api/profile/getGroupsInvitations/:userName', routes.getGroupsInvitations);
app.post('/api/profile/acceptInvitation/:userName/:groupId', routes.acceptInvitation);
app.post('/api/profile/declineInvitation/:userName/:groupId', routes.declineInvitation);
app.get('/api/profile/getAdminGroupsIds/:userName', routes.getAdminGroupsIds);
app.get('/api/profile/getPublicGroupsRequestsIds/:userName', routes.getPublicGroupsRequestsIds);
app.post('/api/profile/approveRequest/:userId/:groupId', routes.approveRequest);
app.post('/api/profile/declineRequest/:userId/:groupId', routes.declineRequest);
app.post('/api/profile/approvePublicRequest/:userId/:groupId', routes.approvePublicRequest);
app.post('/api/profile/declinePublicRequest/:userId/:groupId', routes.declinePublicRequest);
app.get('/api/profile/getNotifications/:userName', routes.getNotifications);
app.get('/api/profile/getFlaggedNotifications/:userName', routes.getFlaggedNotifications);
app.delete('/api/profile/resolveNotification/:userId/:groupId', routes.resolveNotification);
app.post('/api/profile/uploadavatar/:userName', upload.single('fileUpload'), routes.uploadAvatar);
app.get('/api/profile/getavatar/:userName', routes.getAvatar);
app.delete('/api/profile/deleteavatar/:userName', routes.deleteAvatar);
app.delete('/api/profile/deleteAccount/:userName', routes.deleteAccount);

// group page api
app.get('/api/grouppage/public/:userName/:order', routes.getPublicGroups);
app.get('/api/grouppage/private/:userName', routes.getPrivateGroups);
app.delete('/api/grouppage/public/:userName', routes.deletePublicGroups);
app.delete('/api/grouppage/private/:userName', routes.deletePrivateGroups);
app.post('/api/grouppage/join/:groupname/:userName', routes.joinPublicGroup);
app.post('/api/grouppage/filter/:userName', routes.filterByTopics);
app.post('/api/grouppage/:groupname/:grouptype/:userName', routes.createGroup);
// app.get("/grouppage/filter/:userName", routes)
app.get('/api/grouppage/suggestgroup/:userName', routes.suggestgroup);
app.get('/api/grouppage/getAllPublicGroups', routes.getAllPublicGroups);

// group details api
app.get('/api/groupDetails/topics/:groupName', routes.getGroupDetailsTopics);
app.get('/api/groupDetails/allpostsids/:groupName', routes.getGroupDetailsAllPostsIds);
app.get('/api/groupDetails/getCreatorName/:groupName', routes.getCreatorName);
app.get('/api/groupDetails/getAdminsNames/:groupName', routes.getAdminsNames);
app.get('/api/groupDetails/getNormalUsersNames/:groupName', routes.getNormalUsersNames);
app.get('/api/groupDetails/getUserId/:userName', routes.getGroupDetailsUserId);
app.get('/api/groupDetails/getGroupId/:groupName', routes.getGroupDetailsGroupId);
app.get('/api/groupDetails/getHidePostIds/:userName', routes.getHidePostIds);
app.post('/api/groupDetails/getPostsIdsByHashTags', routes.getPostsIdsByHashTags);

// post api
app.get('/api/post/:postId', routes.getPostInfo);
app.delete('/api/post/deletePost/:postId', routes.deletePost);
app.get('/api/post/findUserId/:userName', routes.getPostUserId);
app.post('/api/post/hidePost', routes.hidePost);
app.get('/api/post/getGroupId/:postId', routes.getGroupId);
app.get('/api/post/getAdminsList/:groupId', routes.getAdminsList);
app.get('/api/post/getFlagValue/:postId', routes.getFlagValue);
app.post('/api/post/updateFlagStatus/:postId/:flag/:userId', routes.updateFlagStatus);

// postDetails api
app.get('/api/postDetails/:postId', routes.getPostDetails);
app.get('/api/postDetails/allCommentsIds/:postId', routes.getPostDetailsAllCommentsIds);
app.get('/api/postDetails/getUserId/:userName', routes.getPostDetailsGetUserId);
app.post('/api/postDetails/makeComment', routes.getPostDetailsMakeComment);
app.get('/api/postDetails/attachments/:postId', routes.getPostAttachmentDetails);
app.post('/api/postDetails/getCommentsIdsByHashTags', routes.getCommentsIdsByHashTags);

// comment api
app.get('/api/comment/:commentId', routes.getCommentInfo);
app.get('/api/comment/getCreatorName/:creatorId', routes.getCommentCreatorName);
app.delete('/api/comment/deleteComment/:commentId', routes.deleteComment);
app.post('/api/comment/editComment', routes.editComment);

// manageGroupMembers api
app.post('/api/manageGroupMembers/addAdmin', routes.addAdmin);
app.post('/api/manageGroupMembers/removeAdmin', routes.removeAdmin);
app.post('/api/manageGroupMembers/inviteUser', routes.inviteUser);
app.post('/api/manageGroupMembers/leaveGroup', routes.leaveGroup);

// NewPost api
app.get('/api/newPost/:creatorId/:groupId', routes.getNewPostCreatorNameAndGroupName);

app.post('/api/sendfile/:group_id/:timestamp/:sender/:type/:receiver', upload.single('fileUpload'), routes.sendFile);
app.post('/api/sendmessage', routes.sendMessage);
app.get('/api/receivemessage/:group_id', routes.receiveMessage);
app.post('/api/postmessage', routes.postMessage);
app.post('/api/postfile/:post_id/:type', upload.single('fileUpload'), routes.postFile);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './app/client/build/index.html'));
});
// Default response for any other request
app.use((req, res) => {
  res.status(404);
});
server.listen(port, () => {
  // console.log(`Server listening on PORT ${port}`);
});

module.exports = app;
