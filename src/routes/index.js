const { Router } = require("express");

const usersRoutes = require("./user.routes");
const notesRoutes = require("./notes.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/notes", notesRoutes);

module.exports = routes;