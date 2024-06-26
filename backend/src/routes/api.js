const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');
const serviceController = require('../controllers/serviceController');
const dogController = require('../controllers/dogController');
const reviewController = require('../controllers/reviewController');
const applicationController = require('../controllers/applicationController');
const { upload } = require('../controllers/applicationController');
const { uploadDog } = require('../controllers/dogController');

// Példa GET kérés kezelése
router.get('/example', (req, res) => {
    res.json({ message: 'Ez egy példa válasz a GET kérésre.' });
  });

//Időpontfoglalással kapcsolatos Útvonalak
router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointment/:id', appointmentController.getAppointmentById);
router.post('/appointment', appointmentController.createAppointment);
router.post('/appointment/:id/cancel', appointmentController.cancelAppointment);
router.post('/appointment/:id/reschedule', appointmentController.rescheduleAppointment);
router.put('/appointment/:id/status', appointmentController.updateAppointmentStatus);

//Felhaszálóval kapcsolatos Útvonalak
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.post('/user/', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

// Service routes
router.get('/services', serviceController.getAllServices);
router.get('/service/:id', serviceController.getServiceById);
router.post('/service', serviceController.createService);
router.put('/service/:id', serviceController.updateService);
router.delete('/service/:id', serviceController.deleteService);

// Dog routes
router.get('/dogs', dogController.getAllDogs);
router.get('/dog/:id', dogController.getDogById);
router.post('/dog', uploadDog.single('picture'), dogController.createDog);
router.put('/dog/:id', uploadDog.single('picture'), dogController.updateDog);
router.delete('/dog/:id', dogController.deleteDog);
router.get('/dog/:id/picture', dogController.getDogPicture);

// Review routes
router.get('/reviews', reviewController.getReviews);
router.get('/review/:id', reviewController.getReviewById);
router.post('/review', reviewController.createReview);
router.put('/review/:id', reviewController.updateReview);
router.delete('/review/:id', reviewController.deleteReview);
router.put('/review/:id/status', reviewController.updateReviewStatus);

// Application routes
router.post('/application', upload.single('cv'), applicationController.createApplication);
router.get('/applications', applicationController.getApplications);
router.get('/application/:id', applicationController.getApplicationById);
router.put('/application/:id', upload.single('cv'), applicationController.updateApplication);
router.delete('/application/:id', applicationController.deleteApplication);
router.put('/application/:id/status', applicationController.updateApplicationStatus);
router.get('/application/:id/cv', applicationController.getApplicationCv);

module.exports = router;