const axios = require('axios');
const Dev = require('../models/Dev')

module.exports = {
    async index(request, response){
        const { user } = request.headers;

        const loggedDev = await Dev.findById(user);

        // Find all the users that not liked or disliked before and not yourself
        const users = await Dev.find({
            $and:[
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes}},
                { _id: { $nin: loggedDev.dislikes}},
            ],
        })

        return response.json(users);
    },

    async store(request, response){
        const { username } = request.body;

        // Check if user exists
        const userExists = await Dev.findOne({ user: username });
        if (userExists){
            console.log(`${username} already exist.`);
            return response.json(userExists);
        }

        // Create user if not exists
        const responseGitHub = await axios.get(`https://api.github.com/users/${username}`);
       
        //return response.json(responseGitHub.data)
       
        const { name, bio, avatar_url: avatar} = responseGitHub.data;

        const dev = await Dev.create({ 
            name,
            user: username,
            bio,
            avatar
         })

        console.log(`${username} was created.`);
        return response.json(dev);
    }
};
