const express = require("express");
const router = express.Router();
const jobscontroller = require("../controllers/jobs.controller");
const imageUploader = require("../helpers/imageUploader");
router.get(
  "/Jobs",
  jobscontroller.listJobs,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.post(
  "/jobs",
  imageUploader.upload.single("image_src"),
  jobscontroller.createJobs,
  async (req, res, next) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res
      .status(400)
      .send({ message: error.message, status: "failed", statusCode: "400" });
  }
);

router.put(
  "/edit/Jobs/:job_id",
  imageUploader.upload.single("image_src"),
  jobscontroller.updateJobs,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
