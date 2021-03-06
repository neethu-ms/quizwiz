const express = require("express");
const router = express.Router();
const database = require("../db/database");
module.exports = () => {
  //Set cookies
  router.post("/", (req, res) => {
    database.getUserWithUsername(req.body.userName).then(data => {
      if (data.rowCount !== 0) {
        req.session.user_name = req.body.userName;
        res.json(data.rows[0]);
      } else {
        database
          .addUser(req.body.userName)
          .then(() => {
            req.session.user_name = req.body.userName;
            res.json(data.rows[0]);
          })
          .catch(err => res.status(500).json({ error: err.message }));
      }
    });
  });

  return router;
};
