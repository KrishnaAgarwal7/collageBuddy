const { Router } = require('express') 
  const routes = Router()

const authMiddleware = require('../middleware/auth.middleware')
const adminMiddleware = require('../middleware/admin.middleware')
const eventController = require('../controllers/event.controller')
routes.get('/' , eventController.getEvents)
routes.post('/' , authMiddleware.requireAuth , adminMiddleware.adminOnly , eventController.createEvent)
routes.patch('/:id' , authMiddleware.requireAuth , adminMiddleware.adminOnly , eventController.updateEvent)
routes.delete('/:id' , authMiddleware.requireAuth , adminMiddleware.adminOnly , eventController.deleteEvent)
module.exports = routes