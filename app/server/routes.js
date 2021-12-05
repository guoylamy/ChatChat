var config = require("./db-config.js");
var mysql = require("mysql");
var uuid = require("react-uuid");
const { user } = require("./db-config.js");
config.connectionLimit = 10;
// var connection = mysql.createPool(config);
// var connection = mysql.createConnection({multipleStatements: true});
var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    debug: false,
    multipleStatements: true
});
connection.connect();

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */
const register = (req, res) => {
  const username = req.params.username
  const password = req.params.password
  const user_id = uuid()
  const ifUserExists = `
    SELECT * FROM user_table WHERE user_name='${username}'
  `;
  connection.query(ifUserExists, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        if (rows.length === 0) {
            const query = `INSERT INTO user_table (user_id, user_name, password, register_date) VALUES ('${user_id}', '${username}', md5('${password}'), CURDATE())`
            connection.query(query, (err, rows, fields) => {
                if (err) console.log(err)
                else {
                    res.json(rows)
                }
            })
        }
        else {
            res.json(rows)
        }
    };
  });
};


const verifyLogin = (req, res) => {
  const username = req.params.username
  const password = req.params.password
  const query = `
    SELECT *
    FROM user_table
    WHERE user_name='${username}' AND password=md5('${password}')
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        console.log(rows)
        res.json(rows)
    };
  });
};

const getMyGroups = (req, res) => {
  const username = req.params.username
  // get user_id by user_table
  const query = ` SELECT group_name FROM group_table WHERE group_id in 
  (SELECT group_id FROM group_user_table WHERE user_id IN
    (SELECT user_id FROM user_table WHERE user_name='${username}))'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        res.json(rows)
    };
  });
};

const getPublicGroups = (req, res) => {
  const username = req.params.username
  // 
  const query = `SELECT group_name FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${username}')) AND group_type='Public';
    SELECT topics FROM group_topic_table WHERE group_id in 
    (SELECT group_id FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${username}')) AND group_type='Public')`
    // console.log(username)
  connection.query(query, [username, username], (err, rows, fields) => {
    if (err) console.log(err);
    else {
        res.json(rows)
        // console.log(rows)
    };
  });
};

const getPrivateGroups = (req, res) => {
  const username = req.params.username
  // 
  const query = `SELECT group_name FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${username}')) AND group_type='Private';
    SELECT topics FROM group_topic_table WHERE group_id in 
    (SELECT group_id FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${username}')) AND group_type='Private')
  `;
    // console.log(username)
  connection.query(query, [username, username], (err, rows, fields) => {
    if (err) console.log(err);
    else {
        res.json(rows)
        // console.log(rows)
    };
  });
}

const deletePublicGroups = (req, res) => {

  const query = ``
    // console.log(username)
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        res.json(rows)
        // console.log(rows)
    };
  });
}

const deletePrivateGroups = (req, res) => {

  const query = ``
    // console.log(username)
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        res.json(rows)
        // console.log(rows)
    };
  });
}

const joinPublicGroup = (req, res) => {
  const groupnName = req.params.groupname
  const userName = req.params.username
  //find group_id from group_table, find user_id in user_table, add one more row in group_user_table 
  const query = `
  SELECT group_id from group_table where (group_name='${groupnName}' and group_type='Public');
  select user_id from user_table where (user_name='${userName}')`
    // console.log(username)
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      if (rows[0].length !== 0 && rows[1].length != 0) {
        const query1 = `insert into group_user_table (group_id, user_id, is_admin) VALUES ('${rows[0][0].group_id}', '${rows[1][0].user_id}', 0);
      insert into group_topic_table (group_id, topics) VALUES ('${rows[0][0].group_id}', '')`
      connection.query(query1, (err, rows, fields) => {
      if (err) console.log(err);
      else {
          res.json(rows)
        // console.log(rows)
        };
      });
      }
    };
  });
}

const filterByTopics = (req, res) => {
  const topics = req.body.topics
  const username = req.params.username
  // result is two list, first one is group_name. second one is topics
  let results = [[], []]
  if (topics.length !== 0) {
      const query = `SELECT group_name FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${username}')) AND group_type='Public';
    SELECT topics FROM group_topic_table WHERE group_id in 
    (SELECT group_id FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN 
    (SELECT user_id FROM user_table WHERE user_name='${username}')) AND group_type='Public')`
      connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
          // to see if topics[i] is in the string topics
            for (var j = 0; j < rows[1].length; j++) {
              for (var i = 0; i < topics.length; i++) {
                // console.log(results[0], topics[i])
                if (!results[0].includes(rows[0][j].group_name) && rows[1][j].topics.indexOf(topics[i]) != -1) {
                  results[0].push(rows[0][j].group_name)
                  results[1].push(rows[1][j].topics)
                } 
              }
            }
            res.json(results)
        };
      });
      
  }
  else {
    res.json('empty')
  }
  
}

const createGroup = (req, res) => {
  const groupname = req.params.groupname
  const grouptype = req.params.grouptype
  const username = req.params.username
  const topics = req.body.topics
  const group_id = uuid()
  var creator_id = ''
  const getCreatorId = `SELECT user_id FROM user_table WHERE user_name='${username}'`
  connection.query(getCreatorId, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        creator_id = rows[0].user_id
        console.log(creator_id)
        const query = `INSERT INTO group_table (group_id, group_name, group_type, creator_id) VALUES ('${group_id}', '${groupname}', '${grouptype}', '${creator_id}')`;
        connection.query(query, (err, rows, fields) => {
          if (err) console.log(err);
          else {
            const query2 = `INSERT INTO group_topic_table (group_id, topics) VALUES ('${group_id}', '${topics}')`
            connection.query(query2, (err, rows, fields) => {
              if (err) console.log(err);
            });
          }
        });
        const query1 = `INSERT INTO group_user_table (group_id, user_id, is_admin) VALUES ('${group_id}', '${creator_id}', 1)`
        connection.query(query1, (err, rows, fields) => {
          if (err) console.log(err);
        });
        // need to add topics into group
        
    };
  });
  
  // we need to update group_table, group_user_table
  
};

// The exported functions, which can be accessed in index.js.
module.exports = {
    verifyLogin:verifyLogin,
    register:register,
    getMyGroups:getMyGroups,
    getPublicGroups:getPublicGroups,
    getPrivateGroups:getPrivateGroups,
    deletePublicGroups:deletePublicGroups,
    deletePrivateGroups:deletePrivateGroups,
    createGroup:createGroup,
    joinPublicGroup:joinPublicGroup,
    filterByTopics:filterByTopics
};
