// Model imports
const User = require("../models/user");
const Project = require("../models/project");
// const { search } = require("../routes/auth");

exports.userSearch = (req, res) => {
  const searchphrase = req.body.searchphrase;

  // Execute search and sort by relevance score
  User.find(
    { $text: { $search: searchphrase } },
    { score: { $meta: "textScore" } },
    // Return only these fields
    { select: "firstName lastName username profilePrivate" }
  )
    // .sort({ score: { $meta: "textScore" } })
    .exec((err, results) => {
      if (err) {
        return res.json({
          error: err,
        });
      } else {

        console.log(results);

        let publicUsers = [];
        results.forEach((result) => {
          if(result.profilePrivate == false){
            publicUsers.push(result);
          }
        });
        
        return res.json({
          searchphrase: searchphrase,
          results: publicUsers,
        });
      }
    });
};

exports.projectSearch = (req, res) => {
  const searchphrase = req.body.searchphrase;

  // Execute search and sort by relevance score
  Project.find(
    { $text: { $search: searchphrase } },
    { score: { $meta: "textScore" } },
    // Return only these fields
    { select: "title about username itemIsPublic" }
  )
    .sort({ score: { $meta: "textScore" } })
    .exec((err, results) => {
      if (err) {
        return res.json({
          searchphrase: searchphrase,
          error: err,
        });
      } else {
        let publicresults = [];
        results.forEach((result) => {
          if (result.itemIsPublic) {
            publicresults.push(result);
          }
        });
        return res.json({
          searchphrase: searchphrase,
          results: publicresults,
        });
      }
    });
};
