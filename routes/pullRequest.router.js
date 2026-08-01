const express = require("express");
const pullRequestController = require("../controllers/pullRequestController");

const pullRequestRouter = express.Router();

pullRequestRouter.post(
  "/pull-request/create/:repoId",
  pullRequestController.createPullRequest
);

pullRequestRouter.get(
  "/pull-request/all",
  pullRequestController.getAllPullRequests
);

pullRequestRouter.get(
  "/pull-request/repository/:repoId",
  pullRequestController.getRepositoryPullRequests
);

pullRequestRouter.put(
  "/pull-request/update/:id",
  pullRequestController.updatePullRequest
);

pullRequestRouter.delete(
  "/pull-request/delete/:id",
  pullRequestController.deletePullRequest
);

module.exports = pullRequestRouter;