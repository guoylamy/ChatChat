var config = require("./db-config.js");
var mysql = require("mysql");
var uuid = require("react-uuid");
config.connectionLimit = 10;
var connection = mysql.createPool(config);
// var connection = mysql.createConnection({multipleStatements: true});
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
            const query = `INSERT INTO user_table (user_id, user_name, password) VALUES ('${user_id}', '${username}', '${password}')`
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
    WHERE user_name='${username}' AND password='${password}'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
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
  const query = ` SELECT group_name FROM group_table WHERE group_id IN 
  (SELECT group_id FROM group_user_table WHERE user_id IN
    (SELECT user_id FROM user_table WHERE user_name='${username}')) AND group_type='Public'
  `;
    console.log(username)
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        res.json(rows)
        console.log(rows)
    };
  });
};

const createGroup = (req, res) => {
  const groupname = req.params.groupname
  const grouptype = req.params.grouptype
  const username = req.params.username
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
        });
        const query1 = `INSERT INTO group_user_table (group_id, user_id, is_admin) VALUES ('${group_id}', '${creator_id}', 1)`
        connection.query(query1, (err, rows, fields) => {
          if (err) console.log(err);
        });
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
    createGroup:createGroup
};
