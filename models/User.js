const mongoose = require('mongoose');
const User = new mongoose.Schema ({
                    email : 'string',
                    password : 'string',
                    checkRole : 'boolean'
                },{collection:'user'});
module.exports = mongoose.model('User',User);