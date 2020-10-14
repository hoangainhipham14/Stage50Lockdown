/* 
Generates the information surrounding a link that a user can use to access 
a project even if it is private
*/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectLinkSchema = Schema({
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
    },
    // Set this as a static expiry time wont work (In mins)
    requiredTime: {
        type: Number,
        required: true,
    }
});

const ProjectLink = mongoose.model('ProjectLink', projectLinkSchema);

module.exports = ProjectLink;