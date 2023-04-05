const pool = require("../../config");

const getJobs = () => {
  console.log("getJobs");
  return new Promise(function (resolve, reject) {
    pool
      .query(`SELECT * FROM jobs`, [])
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (err) {
        console.log("err", err);
        reject(err);
      });
  });
};

const AddJobs = (request, response) => {
  const { name, driver_id, assign_status, description } = request;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO jobs (name, driver_id,assign_status,description) VALUES ($1,$2,$3,$4)",
        [name, driver_id, assign_status, description]
      )
      .then(function (result) {
        resolve(result.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

async function JobGetByJobID(job_id) {
  if (!job_id) {
    reject("error: id missing");
  } else {
    return new Promise((resolve) => {
      pool.query(
        "SELECT * FROM Jobs  WHERE job_id = $1",
        [job_id],
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

const UpdateJob = (data) => {
  const { name, driver_id, Assign_status, Description, job_id } = data;

  return new Promise(function (resolve, reject) {
    pool
      .query(
        "UPDATE users SET name = $1, driver_id = $2 , Assign_status = $3 ,  Description = $4   WHERE job_id = $5",
        [name, driver_id, Assign_status, Description, job_id]
      )

      .then(function (result) {
        resolve(result.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

module.exports = {
  getJobs,
  AddJobs,
  JobGetByJobID,
  UpdateJob,
};
