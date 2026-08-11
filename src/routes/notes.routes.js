const { Router } = require('express')
const routes = Router()
const resourcesController = require('../controllers/supabase.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const uploadResource = require('../middleware/resourceUpload.middleware')
routes.post('/' , requireAuth , uploadResource.single('file') , resourcesController.createResource)
routes.get('/' , requireAuth , resourcesController.getAllResources)
routes.get(
    "/:id",
    requireAuth,
    resourcesController.getSingleResource
);
module.exports = routes;