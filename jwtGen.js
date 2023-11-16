const jwt = require("jsonwebtoken");
require("dotenv").config();


function jwtGenMentor(userId){
    const payload = {
        user:userId
    }

    return jwt.sign(payload,process.env.JWT_MENTOR, {expiresIn:'1hr'})
}
function jwtGenMentee(userId){
    const payload = {
        user:userId
    }

    return jwt.sign(payload,process.env.JWT_MENTEE, {expiresIn:'1hr'})
}


module.exports = {jwtGenMentor,jwtGenMentee};
