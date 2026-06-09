const express = require("express");
const userRouter = require("./user.router");   //from user.router
const repoRouter = require("./repo.router");    //from repo.router
const issueRouter = require("./issue.router");   //from issue.router

const mainRouter = express.Router();

mainRouter.use(userRouter);     //from user.router
mainRouter.use(repoRouter);     //from repo.router
mainRouter.use(issueRouter);     //from issue.router

mainRouter.get("/", (req, res) =>{
    res.send("Welcome!");
});
module.exports = mainRouter;