const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");



async function createIssue(req, res) {
   const { id } = req.params;
   const { tittle, description } = req.body;

   try{
    const issue = new Issue({
        tittle,
        description,
        repository : id,
    });

    await issue.save();

    res.status(201).json(issue);
   }catch(err){
        console.error("Error during Issue creation :", err.message);
        res.send(500).send("Server Error");
}
}


async function  updateIssueById(req, res){
   const { id } = req.params;
   const { tittle, description, status} = req.body;
   try{
    const issue = await Issue.findById(id);

    if(!issue) {
        return res.status(404).json({ error: "issue not found!" });
    };

    issue.tittle = tittle;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json(issue, { message: "Issue updated"});
   } catch(err){
        console.error("Error during Issue updation :", err.message);
        res.send(500).send("Server Error");
}
};

async function  deleteIssueById(req, res){
   const { id } = req.params;
   
   try{
    const issue = await Issue.findByIdAndDelete(id);

    if(!issue) {
        return res.status(404).json({ error: "issue not found!" });
    };

    res.json({ message: "Issue deleted"});
   } catch(err){
        console.error("Error during Issue deletion :", err.message);
        res.send(500).send("Server Error");
}
};

async function  getAllIssues(req, res){
    const { id } = req.params;
  
   try{
    const issue = await Issue.find({repository: id});

    if(!issue) {
        return res.status(404).json({ error: "issue not found!" });
    };

    res.status(200).json(issue);
   } catch(err){
        console.error("Error during Issue fetching :", err.message);
        res.send(500).send("Server Error");
}
};

async function  getIssueById(req, res){
    const { id } = req.params;

   try{
    const issue = await Issue.findById(id);

    if(!issue) {
        return res.status(404).json({ error: "issue not found!" });
    };

    res.json(issue);
   } catch(err){
        console.error("Error during Issue updation :", err.message);
        res.send(500).send("Server Error");
}
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}