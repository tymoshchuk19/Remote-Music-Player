const mongoose = require('mongoose');

var hostSchema = new mongoose.Schema({
    ip: String
});

module.exports = mongoose.model('Hosts', hostSchema);