/* 
Generates the information surrounding a link that a user can use to access 
a project even if it is private
*/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectLinkSchema = Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    _projectId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project' 
    },
    link: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date,
        required: true,
        default: Date.now,
        // Set 60 min expiration time to reduce risk
        expires: 3600
    }
});

const ProjectLink = mongoose.model('ProjectLink', projectLinkSchema);

module.exports = ProjectLink;