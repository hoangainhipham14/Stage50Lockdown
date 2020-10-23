// Model imports
const User = require("../models/user");

exports.userSearch = (req, res) => {
  const searchphrase = req.body.searchphrase;

  // Execute search and sort by relevance score
  User.find(
    { $text: { $search: searchphrase } },
    { score: { $meta: "textScore" } },
    // Return only these fields
    { select: "firstName lastName username email" }
  )
    .sort({ score: { $meta: "textScore" } })
    .exec((err, results) => {
      console.log(results);
      if (err) {
        return res.json({
          error: err,
        });
      } else {
        return res.json({
          searchphrase: searchphrase,
          results: results,
        });
      }
    });
};
