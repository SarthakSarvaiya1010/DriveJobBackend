require("dotenv").config();
var Jobs = require("../models/jobs");

const listJobs = async function (req, res) {
  Jobs.getJobs()
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

const createJobs = async function (req, res) {
  console.log("req.body", req.body);
  const { name, driver_id, assign_status, description } = req.body;
  Jobs.AddJobs({
    name,
    driver_id,
    assign_status,
    description,
  })
    .then(async function (result) {
      return res.status(200).json({
        message: "Succesfully! job Added",
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

const updateJobs = (req, res) => {
  Jobs.JobGetByJobID(req?.params?.job_id)
    .then(async function (result) {
      if (result) {
        Jobs.UpdateJob({
          job_id: result.job_id,
          name: req.body.name,
          driver_id: req.body.driver_id,
          assign_status: req.body.assign_status,
          description: req.body.description,
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
        return res.status(400).json({
          message: "user not exist",
          statusCode: "400",
        });
      }
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: "400",
      });
    });
};
module.exports = {
  listJobs,
  createJobs,
  updateJobs,
};
