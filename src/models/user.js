const pool = require("../../config");
var bcrypt = require("bcrypt");
const e = require("express");

const expires_at = new Date(Date.now());

const getUsers = () => {
  return new Promise(function (resolve, reject) {
    pool
      .query(`SELECT * FROM users`, [])
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

const AddUser = (request, response) => {
  const { name, email, password, mobile, image_src, address, role_id } =
    request;
  const isactive = "1";
  const deleted_flag = "0";

  return new Promise(function (resolve, reject) {
    hashPassword(password)
      .then(function (hash) {
        return pool.query(
          "INSERT INTO users (name, email,password,mobile,image_src,address,role_id,isactive,deleted_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
          [
            name,
            email,
            hash,
            mobile,
            image_src,
            address,
            role_id,
            isactive,
            deleted_flag,
          ]
        );
      })
      .then(function (result) {
        resolve(result.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
function hashPassword(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}

const UpdateuserWithoutPassword = (data) => {
  const {
    user_id,
    name,
    email,
    password,
    mobile,
    address,
    role_id,
    image_src,
  } = data;
  if (company_id) {
    return new Promise(function (resolve, reject) {
      if (!user_id) {
        console.log("error: id missing");
        reject("error: id missing");
      } else {
        hashPassword(password)
          .then(function () {
            pool.query(
              "UPDATE users SET name = $1, email = $2 , image_src = $3 ,  mobile_no = $4 , address = $5 , role_id = $6  WHERE user_id = $7",
              [name, email, image_src, mobile, address, role_id, user_id]
            );
          })
          .then(function (result) {
            resolve(result.rows[0]);
          })
          .catch(function (err) {
            reject(err);
          });
      }
    });
  }
};

async function UserGetByUUID(user_uuid) {
  if (!user_uuid) {
    reject("error: id missing");
  } else {
    return new Promise((resolve) => {
      pool.query(
        "SELECT * FROM users WHERE user_uuid = $1",
        [user_uuid],
        (error, results) => {
          if (error) {
            throw error;
          }
          return resolve(results.rows[0]);
        }
      );
    });
  }
}

const Updateuser = (data) => {
  const {
    user_id,
    name,
    email,
    password,
    mobile,
    address,
    role_id,
    image_src,
  } = data;
  return new Promise(function (resolve, reject) {
    hashPassword(password)
      .then(function (hash) {
        pool.query(
          "UPDATE users SET name = $1, email = $2 , password = $3 , image_src = $4 ,  mobile = $5 , address = $6 , role_id = $7  WHERE user_id = $8",
          [name, email, hash, image_src, mobile, address, role_id, user_id]
        );
      })
      .then(function (result) {
        resolve(result);
      })
      .catch(function (err) {
        console.log("err", err);
        reject(err);
      });
  });
};

async function isUserExists(email) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }

        return resolve(results.rowCount > 0);
      }
    );
  });
}
async function getOneUser(email) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM users WHERE email = $1 ",
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }
        return resolve(results.rows[0]);
      }
    );
  });
}
const createUserSession = function (request, response) {
  const { token, id } = request;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO public.user_session( token, user_id ,expires_at)  VALUES ( $1, $2,$3);",
        [token, id, expires_at]
      )
      .then(function (result) {
        resolve(result.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
exports.hashPassword = hashPassword;

module.exports = {
  getUsers,
  AddUser,
  UpdateuserWithoutPassword,
  UserGetByUUID,
  Updateuser,
  isUserExists,
  getOneUser,
  createUserSession,
};
