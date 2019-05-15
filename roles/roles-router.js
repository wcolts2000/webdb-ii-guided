const knex = require("knex");
const router = require("express").Router();

const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);

router.get("/", (req, res) => {
  // get the roles from the database
  db("roles")
    .then(roles => res.status(200).json(roles))
    .catch(error => res.status(500).json(error));
});

router.get("/:id", (req, res) => {
  // retrieve a role by id
  db("roles")
    .where({ id: req.params.id })
    .first() // allows us to return the first object in the set that is returned from the where method
    .then(role => {
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    })
    .catch(error => res.status(500).json(error));
  // res.send("Write code to retrieve a role by id");
});

router.post("/", (req, res) => {
  // add a role to the database
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: "Must provide a name value" });
  } else {
    db("roles")
      .insert({ name }, "id")
      .then(ids => {
        const [id] = ids;

        // NOTE we may just want to return the id only instead of the example below for performance reasons
        db("roles") // example of nesting our db call to return the entire newly created object instead of just the id
          .where({ id })
          .first()
          .then(role => res.status(201).json(role));
      })
      .catch(error => res.status(500).json(error));
  }
  // res.send("Write code to add a role");
});

router.put("/:id", (req, res) => {
  // update roles
  db("roles")
    .where({ id: req.params.id })
    .update(req.body, "id")
    .then(count => {
      if (count > 0) {
        db("roles")
          .where({ id: req.params.id })
          .first()
          .then(role => {
            res.status(200).json(role);
          });
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
  // res.send("Write code to modify a role");
});

router.delete("/:id", (req, res) => {
  // remove roles (inactivate the role)
  db("roles")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    })
    .catch(error => res.status(500).json(error));
  // res.send("Write code to remove a role");
});

module.exports = router;
