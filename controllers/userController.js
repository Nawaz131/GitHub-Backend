

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId, ReturnDocument } = require("mongodb");

const dotenv = require("dotenv");

dotenv.config();
const uri = process.env.MONGODB_URL;

let client;

async function connectClient() {
    if(!client) {
        client = new MongoClient(uri, {});
        await client.connect();
        console.log("MongoDB Client Connected");
    }
}

//Start for SingUp from here 
async function SignUp(req, res) {
    // res.send("SignUp in!");
    const {username, password, email} = req.body;
    try{
        await connectClient();
        const db = client.db("gitHubclone");  
        const usersCollection = db.collection("users");
        
        const user = await usersCollection.findOne({username});
        if(user){
            return res.status(400).json({message: "User already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories : [],
            followUsers : [],
            starRepos : []
        }

        const result = await usersCollection.insertOne(newUser); 

        const token = jwt.sign({id:result.insertedId}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
        res.json({token});
    }catch(err){
        console.error("Error during signup: ", err.message);
        res.status(500).send("Server error");
    }
};    //Stop SingUp code till here

//Start login code from here
async function login(req, res){    
    const {email, password} = req.body;
    try{
        await connectClient();

        const db = client.db("gitHubclone");  
        const usersCollection = db.collection("users");
        
        const user = await usersCollection.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid Creadentials!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
             return res.status(400).json({message: "Invalid Creadentials!"});
        }

         const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
         res.json({token, userId:user._id});
    }catch(err){
        console.log("Error during login:", err.message);
        res.status(500).send("Server Error!");
    };
};    //Till end login code here

//All user from here 
async function getAllUsers(req, res){
   try{
        await connectClient();
        const db = client.db("gitHubclone");  
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);
   }catch(err){
        console.log("Error during Fetching:", err.message);
        res.status(500).send("Server Error!");
   }
}  //All user code till here


//UserProfilr code from here 
async function getUserProfile(req, res){
    const currentID = req.params.id;

    try{
        await connectClient();
        const db = client.db("gitHubclone");  
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(currentID),
        });

        if(!user){
            return res.status(404).json({message: "User not Found!"});
        }
         res.send(user);
    }catch(err){
        console.log("Error during Fetching:", err.message);
        res.status(500).send("Server Error!");
   }
}   // till here UserProfile


//Update code from here
async function updateUserProfile(req, res){
    const currentID = req.params.id;
    const { email, password } = req.body;

    try{
     await connectClient();
        const db = client.db("gitHubclone");
        const usersCollection = db.collection("users");

        let updateFields = {};

        if (email) {
            updateFields.email = email;
        }
        
        if(password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }
        const result = await usersCollection.findOneAndUpdate({
            _id: new ObjectId(currentID),
        },
        { $set: updateFields },
        {returnDocument: "after"}
    );
    if(!result.value){
        return res.status(404).json({  message: "User not found!"});
    }
    }catch(err){
        console.log("Error during Updating:", err.message);
        res.status(500).send("Server Error!");
    }
}  //till here for update code


//Delete code from here 
async function deleteUserProfile(req, res){
    const currentID = req.params.id;

    try{
        await connectClient();
        const db = client.db("gitHubclone");  
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({
             _id: new ObjectId(currentID),
        });

        if(result.deleteCount == 0){
            return res.status(404).json({  message: "User not found!" });
        }

        res.json({ message: "User Profilr Deleted!"});
    }catch(err){
        console.log("Error during Updating:", err.message);
        res.status(500).send("Server Error!");
    }
}   //till here for delete code

module.exports = {
    getAllUsers,
    login,
    SignUp,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};