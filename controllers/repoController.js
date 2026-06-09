const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


async function createRepository(req, res){
    const { owner, name, issues, contents, description, visibility } = req.body;

    try{
        if(!name) {
            return res.status(400).json({error: "Repository name is required!"});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid User ID!"});
        }

        const newRepository = new Repository({
            name, 
            description,
            visibility,
            owner,
            contents,
            issues,
        });

        const result = await newRepository.save();

        res.status(201).json({
            message: "Repository created!",
            repositoryID: result._id,
        }); 
    }catch(err){
        console.error("Error during repository creation :", err.message);
        res.status(500).send("Server Error");
    }
}

async function getAllRepositories(req, res){
    try{
        const repositories = await Repository.find({})
            .populate("owner")
            .populate("issues");

        res.json(repositories);
    }catch(err){
        console.error("Error during repository creation :", err.message);
        res.status(500).send("Server Error");
    }
}

async function fetchRepositoryById(req, res){
    const { id } = req.params;

    try{
        const repository =await Repository.find({_id: id})
            .populate("owner")
            .populate("issues");

         res.json(repository);
    }catch(err){
        console.error("Error during fetching repository :", err.message);
        res.status(500).send("Server Error");
}
}


async function fetchRepositoryByName(req, res){
    const { name } = req.params;

    try{
        const repository = await Repository.find({name})
            .populate("owner")
            .populate("issues");

         res.json(repository);
    }catch(err){
        console.error("Error during fetching repository :", err.message);
        res.status(500).send("Server Error");
}
}

async function fetchRepositoriesForCurrentUser(req, res){
    const {userId} = req.params;

    try{
        const repositories = await Repository.find({ owner: userId });

        if(!repositories || repositories.length == 0){
            return res.status(404).json({ error: "User repositories not found!"});
        }

        res.json({ message: "Repositories found!", repositories});
    }catch(err){
        console.error("Error during fetching user repositories :", err.message);
        res.status(500).send("Server Error");
}
}



async function updateRepositoryById(req, res) {
   const { id } = req.params;
   const { contents, description } = req.body;

   try{
    const repository = await Repository.findById(id);
    if(!repository){
        return res.status(404).json({ error : "Repository not found!"});
    }

    repository.contents.push(contents);
    repository.description = description;

    const updateRepository = await repository.save();

    res.json({
        message: "repository updated successfully!",
        reposotory: updateRepository,
    })
   }catch(err){
        console.error("Error during updating repository :", err.message);
        res.status(500).send("Server Error");
}
}




async function toggleVIsibilityById(req, res) {
    const { id } = req.params;

   try{
    const repository = await Repository.findById(id);
    if(!repository){
        return res.status(404).json({ error : "Repository not found!"});
    }

    repository.visibility = !repository.visibility;

    const updateRepository = await repository.save();

    res.json({
        message: "repository visibility toggled successfully!",
        reposotory: updateRepository,
    })
   }catch(err){
        console.error("Error during toggling visibility :", err.message);
        res.status(500).send("Server Error");
}
}

async function deleteRepositoryById(req, res) {
    const { id } = req.params;
    try{
        const repository = await Repository.findByIdAndDelete(id);
    if(!repository){
        return res.status(404).json({ error : "Repository not found!"});
    }

    res.json({ message: "Repository deleted successfully!"});
    }catch(err){
        console.error("Error during deleting Repository :", err.message);
        res.status(500).send("Server Error");
}
}

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVIsibilityById,
    deleteRepositoryById,
};