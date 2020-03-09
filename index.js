const express = require("express");
const shortid = require("shortid");

const server = express();
server.use(express.json());

let Users = [{
    "name": "test",
    "bio": "test2",
    "id": "eOZUEB8t"
}];

server.get("/", (req, res)=>
{
    res.status(200).json({msg:"Up"});
});

server.post("/api/users", (req, res)=>
{
    const UserData = req.body;
    UserData.id = shortid();

    Users.push(UserData);

    res.status(201).json(UserData);
});

server.get("/api/users", (req, res)=>
{
    if (req.query.id !== undefined)
    {
        let Find = Users.filter((i)=>{return i.id === req.query.id})[0];

        if (Find === undefined)
            res.status(404).json({error:"User not found"});
        else
            res.status(200).json(Find);
    }
    else
        res.status(200).json(Users);
});

server.delete("/api/users", (req, res)=>
{
    if (req.query.id === undefined)
        res.status(400).json({error:"Invalid request paramaters"});
    else
    {
        let Deleted = null;

        Users = Users.filter((i)=>
        {
            if (i.id !== req.query.id)
                return true;

            Deleted = i;
            return false;
        });

        if (Deleted === null)
            res.status(404).json({error:"User not found"});
        else
            res.status(200).json(Deleted);
    }
});

server.patch("/api/users", (req, res)=>
{
    if (req.query.id === undefined)
        res.status(400).json({error:"Invalid request paramaters"});
    else
    {
        let FindUser = Users.filter((i)=>{return i.id === req.query.id})[0];
        
        if (FindUser === undefined)
        {
            res.status(404).json({error:"User not found"});
            return;
        }

        FindUser.name = req.body.name;
        FindUser.bio = req.body.bio;

        res.status(200).json(FindUser);

        return;
    }
})

server.listen(5000, ()=>{console.log("Running")});