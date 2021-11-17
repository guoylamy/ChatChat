var config = require("./db-config.js");
var mysql = require("mysql");
var uuid = require("react-uuid")
config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */
const register = (req, res) => {
  const username = req.params.username
  const password = req.params.password
  const user_id = uuid()
  const ifUserExists = `
    SELECT * FROM user where user_name='${username}'
  `;
  connection.query(ifUserExists, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        if (rows.length === 0) {
            const query = `insert into user (user_id, user_name, password) values ('${user_id}', '${username}', '${password}')`
            connection.query(query, (err, rows, fields) => {
                if (err) console.log(err)
                else {
                    res.json(rows)
                    // console.log(rows)
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
  const password = req.params.pasword
  const query = `
    SELECT *
    FROM user
    where username='${username}' and password='${password}'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
        res.json(rows)
    };
  });
};
// The exported functions, which can be accessed in index.js.
module.exports = {
    verifyLogin:verifyLogin,
    register:register
};
