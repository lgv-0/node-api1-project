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
    if (req.body.name === undefined || req.body.bio === undefined)
    {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
        return;
    }

    const UserData = req.body;

    try
    {
        UserData.id = shortid();
        Users.push(UserData);
    }
    catch
    {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
        return;
    }

    res.status(201).json(UserData);
});

server.get("/api/users", (req, res)=>
{
    if (req.query.id !== undefined)
    {
        let Find;
        
        try
        {
            Users.filter((i)=>{return i.id === req.query.id})[0];
        }
        catch
        {
            res.status(500).json({ errorMessage: "The user information could not be retrieved." });
            return;
        }

        if (Find === undefined)
            res.status(404).json({error:"User not found"});
        else
            res.status(200).json(Find);
    }
    else
    {
        try
        {
            res.status(200).json(Users);
        }
        catch
        {
            res.status(500).json({ errorMessage: "The users information could not be retrieved." });
        }
    }
});

server.delete("/api/users", (req, res)=>
{
    if (req.query.id === undefined)
        res.status(400).json({error:"Invalid request paramaters"});
    else
    {
        let Deleted = null;

        try
        {
            Users = Users.filter((i)=>
            {
                if (i.id !== req.query.id)
                    return true;

                Deleted = i;
                return false;
            });
        }
        catch
        {
            res.status(500).json({ errorMessage: "The user could not be removed" });
        }

        if (Deleted === null)
            res.status(404).json({ message: "The user with the specified ID does not exist." });
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
        if (req.body.name === undefined || req.body.bio === undefined)
        {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
            return;
        }

        let FindUser = undefined;
        
        try
        {
            FindUser = Users.filter((i)=>{return i.id === req.query.id})[0];
        }
        catch
        {
            res.status(500).json({ errorMessage: "The user information could not be modified." });
            return;
        }
        
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