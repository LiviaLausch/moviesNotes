const { Router } = require("express");

const SessionsControlller = require("../controllers/SessionsController");

const sessionsController =  new SessionsControlller();

const sessionsRoutes = Router();

sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;