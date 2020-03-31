const Dev = require('../models/Dev');

module.exports = {
    async store(request, response){
        const {user} = request.headers;
        const {devId} = request.params;
        
        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev){
            return response.status(400).json( {error: 'Dev not exist.'} );
        }

        // Verify is user logged and already dislike 
        if (loggedDev.dislikes.includes(targetDev._id)){
            return response.json( loggedDev );
        }

        // Include user on the liked list users
        loggedDev.dislikes.push(targetDev._id);
        await loggedDev.save();

        return response.json( loggedDev );
    }
};
