const mongoose = require('mongoose')

// const imageSchema = new mongoose.Schema({
//     _userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User' 
//     },
    
//     fileName: {
//         type: String,
//         trim: true,
//         required: true
//     },
 
//     image: {
//         type: String,
//         trim: true,
//         required: true
//     }
// }, {
//     timestamps: true
// });

const imageSchema = new mongoose.Schema({ 
    fileName: String,  
    file: 
    { 
        data: Buffer, 
        contentType: String 
    } 
}); 

const ImageSchema = mongoose.model('ImageSchema', imageSchema);

module.exports = ImageSchema;