require("dotenv").config();
var User = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const listUser = async function (req, res) {
  User.getUsers()
    .then(async function (result) {
      return res.status(200).json(result);
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: 400,
      });
    });
};

const createUser = async function (req, res) {
  const base64Data = req?.file
    ? Buffer.from(req?.file?.buffer).toString("base64")
    : null;
  let image_src = base64Data;

  let { name, email, password, mobile, address, role_id } = req.body;
  User.AddUser({
    name,
    email,
    password,
    mobile,
    address,
    role_id,
    image_src,
  })
    .then(async function (result) {
      return res.status(200).json({
        message: "Succesfully! user Added",
        statusCode: "200",
      });
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: 400,
      });
    });
};
const TestcreateUser = async function (req, res) {
  console.log("TestcreateUser", req?.body);
  const base64Data = req?.file
    ? Buffer.from(req?.file?.buffer).toString("base64")
    : null;
  let image_src = base64Data;

  let { name, email, password, mobile, address, role_id } = req.body;
  User.AddUser({
    name,
    email,
    password,
    mobile,
    address,
    role_id,
    image_src,
  })
    .then(async function (result) {
      return res.status(200).json({
        message: "Succesfully! user Added",
        statusCode: "200",
      });
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: 400,
      });
    });
};

const updateUser = (req, res) => {
  User.UserGetByUUID(req?.params?.user_uuid)
    .then(async function (result) {
      if (result) {
        const base64Data = req?.file
          ? Buffer.from(req?.file?.buffer).toString("base64")
          : null;
        let image_src = base64Data;
        if (result.password === req.body.password) {
          User.UpdateuserWithoutPassword({
            user_id: result.user_id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile,
            address: req.body.address,
            role_id: req.body.role_id,
            image_src: image_src ? image_src : null,
          })
            .then(async function (result) {
              return res.status(200).json({
                status: "success",
                statusCode: "200",
                message: "success! user data updated suucessfully",
              });
            })
            .catch(function (error) {
              return res.status(400).json({
                message: error,
                statusCode: "400",
              });
            });
        } else {
          const base64Data = req?.file
            ? Buffer.from(req?.file?.buffer).toString("base64")
            : null;
          let image_src = base64Data;
          User.Updateuser({
            user_id: result.user_id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile,
            address: req.body.address,
            role_id: req.body.role_id,
            image_src: image_src,
          })
            .then(async function (result) {
              return res.status(200).json({
                status: "success",
                statusCode: "200",
                message: "success! user data updated suucessfully",
              });
            })
            .catch(function (error) {
              return res.status(400).json({
                message: error,
                statusCode: "400",
              });
            });
        }
      } else {
        return res.status(400).json({
          message: "user not exist",
          statusCode: "400",
        });
      }
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: "500",
      });
    });
};
const Login = (req, res) => {
  console.log("req.body", req.body);
  const { email, password } = req.body;
  console.log("email, password", email, password);
  User.isUserExists(email).then((isExists) => {
    if (!isExists) {
      return res.status(400).json({
        status: "failed",
        message: "user not exist!",
        statusCode: "400",
      });
    }
    User.getOneUser(email).then(
      (user) => {
        bcrypt.compare(
          password,
          user.password,
          function (error, isvalidpassword) {
            if (error) {
              throw error;
            }
            if (!isvalidpassword) {
              return res.status(401).json({
                status: "failed",
                message: "invalid password!",
                statusCode: "401",
              });
            } else {
              var token = jwt.sign(
                {
                  id: user.user_id,
                },
                process.env.API_SECRET,
                {
                  expiresIn: 86400,
                }
              );
              const id = user.user_id;
              const name = user.name;
              const email = user.email;
              const role_id = user.role_id;

              User.createUserSession({ token, id })
                .then(function () {
                  res.cookie(`Cookie token name`, {
                    secret: "yoursecret",
                    cookie: { maxAge: 6000 },
                  });
                  res.status(200).send({
                    message: "Login successfully",
                    status: "true",
                    statusCode: "200",
                    name: name,
                    email: email,
                    role_id: role_id,
                    accessToken: token,
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
                  });
                });
            }
          }
        );
      },
      (error) => {
        res.status(400).json({
          status: "false",
          statusCode: "400",
          message: "Error while login.",
        });
      }
    );
  });
};

module.exports = {
  listUser,
  createUser,
  updateUser,
  Login,
  TestcreateUser,
};
