/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const mysql = require('mysql');
const uuid = require('react-uuid');
const config = require('./db-config');
// const { user } = require('./db-config');

config.connectionLimit = 10;
// var connection = mysql.createPool(config);
// var connection = mysql.createConnection({multipleStatements: true});
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  debug: false,
  multipleStatements: true,
});
connection.connect();

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */
const register = (req, res) => {
  const { userName } = req.params;
  const { password } = req.params;
  const userId = uuid();
  const ifUserExists = `
    SELECT * FROM user_table WHERE user_name='${userName}'
  `;
  connection.query(ifUserExists, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (rows.length === 0) {
      const query = `INSERT INTO user_table (user_id, user_name, password, register_date) VALUES ('${userId}', '${userName}', ('${password}'), CURDATE())`;
      connection.query(query, (err, rows, _fields) => {
        if (err) {
          // console.log(err);
        } else if (res === '1') {
          // console.log('res', res);
          return JSON.stringify(rows);
        } else {
          res.json(rows);
        }
      });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const verifyLogin = (req, res) => {
  const { userName } = req.params;
  const { password } = req.params;
  const query = `
    SELECT *
    FROM user_table
    WHERE user_name='${userName}' AND password='${password}'
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      // console.log('verify login rows', rows);
      return JSON.stringify(rows);
    } else {
      res.json(rows);
    }
  });
};

const ifUserNameExists = (req, res) => {
  const { userName } = req.params;

  const query = `
    SELECT *
    FROM user_table
    WHERE user_name='${userName}'
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      return JSON.stringify(rows);
    } else {
      // console.log(rows);
      res.json(rows);
    }
  });
};

const getRegsiterDate = (req, res) => {
  const { userName } = req.params;
  const query = `
    SELECT register_date
    FROM user_table
    WHERE user_name='${userName}'
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      return JSON.stringify(rows);
    } else {
      res.json(rows);
    }
  });
};

const changePassword = (req, res) => {
  const { userName } = req.params;
  const { password } = req.params;
  const query = `
    update user_table set password='${password}' where user_name='${userName}'
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getGroupsInvitations = (req, res) => {
  const { userName } = req.params;
  // 1. get user id, 2. get group_id from invite table
  const query = `
  select group_id, group_name from group_table where group_id in 
  (select group_id from invite where user_to_be_invited in 
    (select user_id from user_table where user_name='${userName}') and accept_or_decline=0)
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      // console.log(rows)
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const acceptInvitation = (req, res) => {
  const { userName } = req.params;
  const { groupId } = req.params;
  // update accept_or_decline as 1, inviter_get_notified as 1
  const query = `
  update invite set accept_or_decline=1, inviter_get_notified=1 where user_to_be_invited in 
    (select user_id from user_table where user_name='${userName}') and group_id='${groupId}';
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const declineInvitation = (req, res) => {
  const { userName } = req.params;
  const { groupId } = req.params;
  // update accept_or_decline as 2, inviter_get_notified as 1
  // update group_user_table
  const query = `
  update invite set accept_or_decline=2, inviter_get_notified=1 where user_to_be_invited in 
    (select user_id from user_table where user_name='${userName}') and group_id='${groupId}'
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getAdminGroupsIds = (req, res) => {
  const { userName } = req.params;
  // 1. get groups where user is admin,
  // 2. get user_to_be_invited from the invite according to group_id and inviter_get_notified
  const query = `
  select user_name, tmp2.group_name, tmp2.user_to_be_invited, tmp2.group_id from user_table join
  (select group_name, tmp.user_to_be_invited, tmp.group_id from group_table join
  (select user_to_be_invited, group_id from invite where group_id in 
    (select group_id from group_user_table where user_id in 
    (select user_id from user_table where user_name='${userName}') and is_admin=1) and accept_or_decline=1) tmp
    on group_table.group_id=tmp.group_id) tmp2 
    on user_table.user_id=tmp2.user_to_be_invited
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getPublicGroupsRequestsIds = (req, res) => {
  const { userName } = req.params;
  const query = `
  select tmp2.user_id, tmp2.user_name, tmp2.group_id, group_table.group_name from
    (select user_table.user_id, user_table.user_name, tmp.group_id from
    (select user_id, group_id from join_public_table where group_id in 
    (select group_id from group_user_table where user_id in 
    (select user_id from user_table where user_name='${userName}') and is_admin=1) and notified=0) tmp
    join user_table on tmp.user_id=user_table.user_id) tmp2
    join group_table on group_table.group_id=tmp2.group_id
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const approveRequest = (req, res) => {
  const { userId } = req.params;
  const { groupId } = req.params;
  // 1. get groups where user is admin,
  // 2. get user_to_be_invited from the invite according to group_id and inviter_get_notified
  const query = `
    insert into group_user_table (group_id, user_id, is_admin) values('${groupId}', '${userId}', 0);
    delete from invite where user_to_be_invited='${userId}' and group_id='${groupId}'
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const declineRequest = (req, res) => {
  const { userId } = req.params;
  const { groupId } = req.params;
  const query = `
    delete from invite where user_to_be_invited='${userId}' and group_id='${groupId}'
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const approvePublicRequest = (req, res) => {
  const { userId } = req.params;
  const { groupId } = req.params;
  const query = `
    insert into group_user_table (group_id, user_id, is_admin) values('${groupId}', '${userId}', 0);
    update join_public_table set notified=1 where (user_id='${userId}' and group_id='${groupId}')
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const declinePublicRequest = (req, res) => {
  const { userId } = req.params;
  const { groupId } = req.params;
  const query = `
    update join_public_table set notified=2 where (user_id='${userId}' and group_id='${groupId}')
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const getNotifications = (req, res) => {
  const { userName } = req.params;
  const query = `
  select tmp.group_id, group_table.group_name, tmp.notified , tmp.user_id from group_table join
 (select group_id, notified, user_id from join_public_table where user_id in 
    (select user_id from user_table where user_name='${userName}')) tmp
  on tmp.group_id=group_table.group_id
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const resolveNotification = (req, res) => {
  const { userId } = req.params;
  const { groupId } = req.params;
  const query = `
  delete from join_public_table where user_id='${userId}' and group_id='${groupId}'
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const getMyGroups = (req, res) => {
  const { userName } = req.params;
  // get user_id by user_table
  const query = ` SELECT group_name FROM group_table WHERE group_id in 
  (SELECT group_id FROM group_user_table WHERE user_id IN
    (SELECT user_id FROM user_table WHERE user_name='${userName}))'
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      return JSON.stringify(rows);
    } else {
      res.json(rows);
    }
  });
};

const getPublicGroups = (req, res) => {
  const { userName } = req.params;
  const orderType = req.params.order;
  let query;
  //
  if (orderType === '2') { // order by newest message
    query = `(select g.group_name, t.topics, max(p.create_time) as createTime
    from group_user_table u inner join group_table g on u.group_id = g.group_id inner join group_topic_table t on g.group_id = t.group_id inner join post_table p on p.group_id = g.group_id
    where g.group_type = 'Public' and u.user_id IN (SELECT user_id FROM user_table WHERE user_name='${userName}')
    group by g.group_id, g.group_name, t.topics)
    UNION
    (select g.group_name, t.topics, 0 as createTime
    from group_user_table u inner join group_table g on u.group_id = g.group_id inner join group_topic_table t on g.group_id = t.group_id
    where g.group_type = 'Public' and u.user_id IN (SELECT user_id FROM user_table WHERE user_name='${userName}')
    and g.group_id NOT IN (SELECT distinct group_id FROM post_table)
    group by g.group_id, g.group_name, t.topics)
    order by createTime desc;`;
  } else if (orderType === '3') { // Number of Posts
    query = `(select g.group_name as group_name, t.topics as topics, count(p.post_id) as postNum 
    from group_user_table u inner join group_table g on u.group_id = g.group_id inner join group_topic_table t on g.group_id = t.group_id inner join post_table p on p.group_id = g.group_id
    where g.group_type = 'Public' and u.user_id IN (SELECT user_id FROM user_table WHERE user_name='${userName}')
    group by g.group_id, g.group_name, t.topics)
    UNION
    (select g.group_name, t.topics, 0 as postNum
    from group_user_table u inner join group_table g on u.group_id = g.group_id inner join group_topic_table t on g.group_id = t.group_id
    where g.group_type = 'Public' and u.user_id IN (SELECT user_id FROM user_table WHERE user_name='${userName}')
    and g.group_id NOT IN (SELECT distinct group_id FROM post_table)
    group by g.group_id, g.group_name, t.topics)
    order by postNum desc;`;
  } else if (orderType === '4') { // Number of Members
    query = `select g.group_name as group_name, t.topics as topics
    from group_user_table u inner join group_table g on u.group_id = g.group_id inner join group_topic_table t on g.group_id = t.group_id
    where g.group_type = 'Public' and u.user_id IN (SELECT user_id FROM user_table WHERE user_name='${userName}')
    group by u.group_id, g.group_name, t.topics
    order by count(u.user_id) desc;`;
  } else {
    query = `SELECT g.group_name, t.topics FROM group_table g inner join group_topic_table t on t.group_id=g.group_id
    WHERE g.group_id IN 
      (SELECT group_id FROM group_user_table WHERE user_id IN 
        (SELECT user_id FROM user_table WHERE user_name='${userName}')) AND group_type='Public';`;
  }

  connection.query(query, [userName, userName], (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      return JSON.stringify(rows);
    } else {
      res.json(rows);
    }
  });
};

const getPrivateGroups = (req, res) => {
  const { userName } = req.params;
  //
  const query = `SELECT group_name FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${userName}')) AND group_type='Private';
    SELECT topics FROM group_topic_table WHERE group_id in 
    (SELECT group_id FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${userName}')) AND group_type='Private')
  `;
    // console.log(userName)
  connection.query(query, [userName, userName], (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      return JSON.stringify(rows);
    } else {
      res.json(rows);
    }
  });
};

const deletePublicGroups = (_req, res) => {
  const query = '';
  // console.log(userName)
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const deletePrivateGroups = (_req, res) => {
  const query = '';
  // console.log(userName)
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const joinPublicGroup = (req, res) => {
  const groupnName = req.params.groupname;
  const { userName } = req.params;

  const query = `
  insert into join_public_table (user_id, group_id, notified) values
  ((select user_id from user_table where user_name='${userName}'), 
  (select group_id from group_table where group_name='${groupnName}'),
  0)
  `;
  // console.log(userName)
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      return JSON.stringify(rows);
    } else {
      res.json(rows);
    }
  });
};

const filterByTopics = (req, res) => {
  const { topics } = req.body;
  const { userName } = req.params;
  // result is two list, first one is group_name. second one is topics
  const results = [[], []];
  if (topics.length !== 0) {
    const query = `SELECT group_name FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${userName}')) AND group_type='Public';
    SELECT topics FROM group_topic_table WHERE group_id in 
    (SELECT group_id FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${userName}')) AND group_type='Public')`;
    connection.query(query, (err, rows, _fields) => {
      if (err) {
        // console.log(err);
      } else {
        // to see if topics[i] is in the string topics
        for (let j = 0; j < rows[1].length; j += 1) {
          for (let i = 0; i < topics.length; i += 1) {
            // console.log(results[0], topics[i])
            if (!results[0].includes(rows[0][j].group_name)
                 && rows[1][j].topics.indexOf(topics[i]) !== -1) {
              results[0].push(rows[0][j].group_name);
              results[1].push(rows[1][j].topics);
            }
          }
        }
        if (res === '1') {
          // console.log('routes res===1 return', JSON.stringify(results));
          return JSON.stringify(results);
        }

        res.json(results);
      }
    });
  } else {
    res.json('empty');
  }
};

const suggestgroup = (req, res) => {
  const { userName } = req.params;
  const query = ` SELECT group_table.group_name, group_topic_table.topics
  FROM group_table inner join group_topic_table on group_table.group_id=group_topic_table.group_id
  WHERE group_table.group_type='Public' and group_table.group_id not in 
  (SELECT group_id FROM group_user_table WHERE user_id IN
    (SELECT user_id FROM user_table WHERE user_name='${userName}'))
  ORDER BY group_topic_table.topics desc
  LIMIT 1
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      return JSON.stringify(rows);
    } else {
      res.json(rows);
    }
  });
};

const getAllPublicGroups = (_req, res) => {
  const query = `
  select group_name from group_table where group_type='Public'
  `;

  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else if (res === '1') {
      return JSON.stringify(rows);
    } else {
      res.json(rows);
    }
  });
};

const createGroup = (req, res) => {
  const { groupname } = req.params;
  const { grouptype } = req.params;
  const { userName } = req.params;
  const { topics } = req.body;
  const groupId = uuid();
  let creatorId = '';
  const getCreatorId = `SELECT user_id FROM user_table WHERE user_name='${userName}'`;
  connection.query(getCreatorId, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(res);
      }
      creatorId = rows[0].user_id;
      // console.log(creator_id);
      const query = `INSERT INTO group_table (group_id, group_name, group_type, creator_id) VALUES ('${groupId}', '${groupname}', '${grouptype}', '${creatorId}')`;
      connection.query(query, (err, _rows, _fields) => {
        if (err) {
          // console.log(err);
        } else {
          const query2 = `INSERT INTO group_topic_table (group_id, topics) VALUES ('${groupId}', '${topics}')`;
          connection.query(query2, (err, _rows, _fields) => {
            if (err) {
              // console.log(err);
            }
          });
        }
      });
      const query1 = `INSERT INTO group_user_table (group_id, user_id, is_admin) VALUES ('${groupId}', '${creatorId}', 1)`;
      connection.query(query1, (err, _rows, _fields) => {
        if (err) {
          // console.log(err);
        }
      });
      // need to add topics into group
    }
  });
  // we need to update group_table, group_user_table
};

const getGroupDetailsTopics = (req, res) => {
  const { groupName } = req.params;
  // find id in group table and
  const query = `select topics from group_topic_table where group_id in 
  (select group_id from group_table where group_name='${groupName}') limit 1`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(res);
      }
      res.json(rows);
    }
  });
};

const getGroupDetailsAllPostsIds = (req, res) => {
  const { groupName } = req.params;
  // find id in group table and
  const query = `select post_id, flag, create_time from post_table where group_id in 
  (select group_id from group_table where group_name='${groupName}')
  order by create_time desc`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(res);
      }
      res.json(rows);
    }
  });
};

const getPostInfo = (req, res) => {
  const { postId } = req.params;
  // find id in group table and
  const query = `select post_table.*, user_table.user_name from post_table
  inner join user_table on post_table.creator_id=user_table.user_id
  where post_table.post_id='${postId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const deletePost = (req, res) => {
  const { postId } = req.params;
  const query = `
  delete from comment_table where post_id='${postId}';
  delete from post_table where post_id='${postId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getPostUserId = (req, res) => {
  const { userName } = req.params;
  const query = `
  select user_id from user_table where user_name='${userName}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const hidePost = (req, res) => {
  const { userId } = req.body;
  const { postId } = req.body;
  // find id in group table and
  const query = `
  insert into hide_post_table (post_id, user_id) values ('${postId}', '${userId}')`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const getGroupId = (req, res) => {
  const { postId } = req.params;
  // find id in group table and
  const query = `select group_id from post_table where post_id='${postId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      // console.log(rows)
      res.json(rows);
    }
  });
};

const getAdminsList = (req, res) => {
  const { groupId } = req.params;
  // find id in group table and
  const query = `select user_id from group_user_table where group_id='${groupId}' and is_admin=1`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      // console.log(rows)
      res.json(rows);
    }
  });
};

const getFlagValue = (req, res) => {
  const { postId } = req.params;
  // find id in group table and
  const query = `select flag from post_table where post_id='${postId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      // console.log(rows)
      res.json(rows);
    }
  });
};

const updateFlagStatus = (req, res) => {
  const { postId } = req.params;
  const { flag } = req.params;
  // find id in group table and
  let query;
  if (flag === 'true') {
    query = `update post_table set flag=0 where post_id='${postId}'`;
  } else {
    query = `update post_table set flag=1 where post_id='${postId}'`;
  }
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      // console.log(rows)
      res.json(rows);
    }
  });
};

const getPostDetails = (req, res) => {
  const { postId } = req.params;
  // find id in group table and
  const query = `select post_table.post_content, post_table.create_time, post_table.message_type, post_table.mimetype, user_table.user_name from post_table
  inner join user_table on post_table.creator_id=user_table.user_id
  where post_table.post_id='${postId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getPostAttachmentDetails = (req, res) => {
  const { postId } = req.params;
  // find id in group table and
  const query = `select *
  from post_attachment
  where post_id='${postId}'
  order by attachement_id asc`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const getCommentsIdsByHashTags = (req, res) => {
  const { hashTags } = req.body;
  const { postId } = req.body;
  const query = `
  select comment_id, hash_tags from comment_table where post_id='${postId}'
  `;
  const result = [];
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // loop through hashTags, to see if hash_tags from rows contain one of hashhTags
      for (let i = 0; i < hashTags.length; i += 1) {
        for (let j = 0; j < rows.length; j += 1) {
          // console.log(rows[j].hash_tags, hashTags[i])
          if (rows[j].hash_tags.includes(hashTags[i])) {
            result.push(rows[j].comment_id);
          }
        }
      }
      // console.log(result);
      res.json(result);
    }
  });
};

const getPostDetailsAllCommentsIds = (req, res) => {
  const { postId } = req.params;
  // find id in group table and
  const query = `select comment_table.* from comment_table 
  join post_table on comment_table.post_id=post_table.post_id 
  where post_table.post_id='${postId}'
  order by create_time desc`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getPostDetailsGetUserId = (req, res) => {
  const { userName } = req.params;
  const query = `select user_id from user_table where user_name='${userName}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getPostDetailsMakeComment = (req, res) => {
  const { commentId } = req.body;
  const { commentContent } = req.body;
  const { creatTime } = req.body;
  const { creatorId } = req.body;
  const { postId } = req.body;
  const { hashTags } = req.body;
  const query = `insert into comment_table (comment_id, comment_content, create_time, creator_id, post_id, hash_tags)
  values
  ('${commentId}', '${commentContent}', '${creatTime}', '${creatorId}', '${postId}', '${hashTags}')
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getCommentInfo = (req, res) => {
  const { commentId } = req.params;
  const query = `select * from comment_table where comment_id='${commentId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getCommentCreatorName = (req, res) => {
  const { creatorId } = req.params;
  const query = `select user_name from user_table where user_id='${creatorId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      res.json(rows);
    }
  });
};

const deleteComment = (req, res) => {
  const { commentId } = req.params;
  const query = `delete from comment_table where comment_id='${commentId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const editComment = (req, res) => {
  const { commentId } = req.body;
  const { commentContent } = req.body;
  const query = `update comment_table set comment_content='${commentContent}' 
  where comment_id='${commentId}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const uploadAvatar = (req, res) => {
  if (!req.file) {
    res.status(404).json({ error: 'missing avatar content' });
    return;
  }
  const query = 'UPDATE user_table SET avatar=?, mimetype=? WHERE user_name=?';
  // eslint-disable-next-line max-len
  connection.query(query, [req.file.buffer, req.file.mimetype, req.params.userName], (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows);
      res.status(200).json(rows);
    }
  });
};

const getAvatar = (req, res) => {
  const query = `SELECT * FROM user_table WHERE user_name = '${req.params.userName}'`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows);
      res.status(200).json(rows);
    }
  });
};

const deleteAvatar = (req, res) => {
  const query = 'UPDATE user_table SET avatar=null, mimetype=null WHERE user_name=?';
  connection.query(query, [req.params.userName], (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows);
      res.status(200).json(rows);
    }
  });
};

const deleteAccount = (req, res) => {
  const { userName } = req.params;
  const query = `delete from user_table where user_name='${userName}'`;
  connection.query(query, [req.params.userName], (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows);
      res.status(200).json(rows);
    }
  });
};

const sendFile = (req, res) => {
  if (!req.params.group_id || !req.params.timestamp || !req.params.sender
    || !req.params.receiver || !req.params.type || req.file === undefined) {
    res.status(404).json({ error: 'missing groupid or timestamp or sender or message' });
    return;
  }
  const query = 'INSERT INTO user_chat_table (group_id, timestamp, sender, receiver, message, message_type, mimetype) VALUES (?, ?, ?, ?, ?, ?, ?)';
  // eslint-disable-next-line max-len
  connection.query(query, [req.params.group_id, req.params.timestamp, req.params.sender, req.params.receiver, req.file.buffer, req.params.type, req.file.mimetype], (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      res.status(200).json(rows);
    }
  });
};

const sendMessage = (req, res) => {
  if (!req.body.group_id || !req.body.timestamp || !req.body.sender
    || !req.body.receiver || req.body.message === undefined) {
    res.status(404).json({ error: 'missing groupid or timestamp or sender or message' });
    return;
  }
  const query = 'INSERT INTO user_chat_table (group_id, timestamp, sender, receiver, message, message_type, mimetype) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [req.body.group_id, req.body.timestamp, req.body.sender, req.body.receiver, Buffer.from(req.body.message, 'binary'), 'string', 'text/plain'], (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.status(200).json(rows);
    }
  });
};

const receiveMessage = (req, res) => {
  const query = `SELECT * FROM user_chat_table WHERE group_id = '${req.params.group_id}' ORDER BY timestamp`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.status(200).json(rows);
    }
  });
};

const postMessage = (req, res) => {
  if (!req.body.group_id || !req.body.timestamp
    || !req.body.sender || req.body.message === undefined) {
    res.status(404).json({ error: 'missing groupid or timestamp or sender or message or group_id' });
    return;
  }
  const postId = uuid();
  const query = 'INSERT INTO post_table (post_id, creator_id, group_id, create_time, post_content, message_type, mimetype, hash_tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [postId, req.body.sender, req.body.group_id, req.body.timestamp, Buffer.from(req.body.message, 'binary'), 'string', 'text/plain', req.body.hashtag], (err, _rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows);
      if (res === '1') {
        return JSON.stringify(postId);
      }
      res.status(200).json(postId);
    }
  });
};

const postFile = (req, res) => {
  if (req.file === undefined) {
    res.status(404).json({ error: 'missing post attachment' });
    return;
  }
  const query = 'INSERT INTO post_attachment (post_id, post_content, message_type, mimetype) VALUES (?, ?, ?, ?)';
  // eslint-disable-next-line max-len
  connection.query(query, [req.params.post_id, req.file.buffer, req.params.type, req.file.mimetype], (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      res.status(200).json(rows);
    }
  });
};

const getCreatorName = (req, res) => {
  const { groupName } = req.params;
  // from group_table to find creator
  const query = `select user_name from user_table where user_id in (
  select creator_id from group_table where group_name='${groupName}')`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows);
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getAdminsNames = (req, res) => {
  const { groupName } = req.params;
  // from group_table to get group_id, from group_user_table to get admins id,
  const query = `
  select user_name from user_table where user_id in (
  select user_id from group_user_table where (group_id in
  (select group_id from group_table where group_name='${groupName}')) 
  and (is_admin='1') 
  and user_id not in (
  select creator_id from group_table where group_name='${groupName}'))`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows);
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getNormalUsersNames = (req, res) => {
  const { groupName } = req.params;
  const query = `
  select user_name from user_table where user_id in 
  (select user_id from group_user_table where group_id in 
  (select group_id from group_table where group_name='${groupName}') and is_admin='0')
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getGroupDetailsUserId = (req, res) => {
  const { userName } = req.params;
  const query = `
  select user_id from user_table where user_name='${userName}'
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getGroupDetailsGroupId = (req, res) => {
  const { groupName } = req.params;
  const query = `
  select group_id from group_table where group_name='${groupName}'
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getHidePostIds = (req, res) => {
  const { userName } = req.params;
  const query = `
  select post_id from hide_post_table where user_id in 
  (select user_id from user_table where user_name='${userName}')
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows)
      res.json(rows);
    }
  });
};

const getPostsIdsByHashTags = (req, res) => {
  const { hashTags } = req.body;
  const { groupId } = req.body;
  const query = `
  select post_id, hash_tags from post_table where group_id='${groupId}'
  `;
  const result = [];
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // loop through hashTags, to see if hash_tags from rows contain one of hashhTags
      for (let i = 0; i < hashTags.length; i += 1) {
        for (let j = 0; j < rows.length; j += 1) {
          // console.log(rows[j].hash_tags, hashTags[i])
          if (rows[j].hash_tags.includes(hashTags[i])) {
            result.push(rows[j].post_id);
          }
        }
      }
      // console.log(result)
      res.json(result);
    }
  });
};

const addAdmin = (req, res) => {
  const { groupName } = req.body;
  const { userName } = req.body;
  //
  const query = `
    update group_user_table set is_admin = '1' where group_id in 
    (select group_id from group_table where group_name='${groupName}') and user_id 
    in (select user_id from user_table where user_name='${userName}')
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const removeAdmin = (req, res) => {
  const { groupName } = req.body;
  const { userName } = req.body;
  //
  const query = `
    update group_user_table set is_admin = '0' where group_id in 
    (select group_id from group_table where group_name='${groupName}') 
    and user_id in (select user_id from user_table where user_name='${userName}')
  `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const inviteUser = (req, res) => {
  const { groupName } = req.body;
  const { inviter } = req.body;
  const { userToBeInvited } = req.body;
  // find group_id,
  const query = `
  insert into invite(inviter, user_to_be_invited, group_id, accept_or_decline, inviter_get_notified) values 
  ((select user_id from user_table where user_name='${inviter}'),
  (select user_id from user_table where user_name='${userToBeInvited}'),
  (select group_id from group_table where group_name='${groupName}'),
  0,
  0
   )`;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      // console.log(rows);
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const leaveGroup = (req, res) => {
  const { groupName } = req.body;
  const { userName } = req.body;
  // if the userName is the creator of this group, we need to remove it
  // from group_user_table and group_table
  // console.log(groupName, userName)
  const query = `
    delete from group_user_table where (
      group_id in (select group_id from group_table where group_name='${groupName}')
      and
      user_id in (select user_id from user_table where user_name='${userName}'));
      delete from group_table where (
        group_name ='${groupName}'
      and
      creator_id in (select user_id from user_table where user_name='${userName}')
      )
      
      `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      if (res === '1') {
        return JSON.stringify(rows);
      }
      res.json(rows);
    }
  });
};

const getNewPostCreatorNameAndGroupName = (req, res) => {
  const { creatorId } = req.params;
  const { groupId } = req.params;
  const query = `
    select user_name from user_table where user_id = '${creatorId}';
    select group_name from group_table where group_id = '${groupId}'
      `;
  connection.query(query, (err, rows, _fields) => {
    if (err) {
      // console.log(err);
      res.status(404).json({ error: `${err}` });
    } else {
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  verifyLogin,
  register,
  ifUserNameExists,

  // below is profile api
  getRegsiterDate,
  changePassword,
  getGroupsInvitations,
  acceptInvitation,
  declineInvitation,
  getAdminGroupsIds,
  getPublicGroupsRequestsIds,
  approveRequest,
  declineRequest,
  approvePublicRequest,
  declinePublicRequest,
  getNotifications,
  resolveNotification,
  uploadAvatar,
  getAvatar,
  deleteAvatar,
  deleteAccount,

  // below is api for group page
  getMyGroups,
  getPublicGroups,
  sendFile,
  sendMessage,
  receiveMessage,
  postMessage,
  postFile,
  getPrivateGroups,
  deletePublicGroups,
  deletePrivateGroups,
  createGroup,
  joinPublicGroup,
  filterByTopics,
  suggestgroup,
  getAllPublicGroups,

  // below is api for groupDetails page
  getGroupDetailsTopics,
  getGroupDetailsAllPostsIds,
  getCreatorName,
  getAdminsNames,
  getNormalUsersNames,
  getGroupDetailsUserId,
  getGroupDetailsGroupId,
  getHidePostIds,
  getPostsIdsByHashTags,

  // below is post api
  getPostInfo,
  deletePost,
  getPostUserId,
  hidePost,
  getGroupId,
  getAdminsList,
  getFlagValue,
  updateFlagStatus,

  // below is postDetails api
  getPostDetails,
  getPostDetailsAllCommentsIds,
  getPostDetailsGetUserId,
  getPostDetailsMakeComment,
  getPostAttachmentDetails,
  getCommentsIdsByHashTags,

  // below is comment api
  getCommentInfo,
  getCommentCreatorName,
  deleteComment,
  editComment,

  // below is manageGroupMembers api
  addAdmin,
  removeAdmin,
  inviteUser,
  leaveGroup,

  // below is NewPost api
  getNewPostCreatorNameAndGroupName,
};
