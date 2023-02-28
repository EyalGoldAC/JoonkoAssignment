const express = require('express');
const { OPEN_JOBS } = require('../constants/jobs');
const USERS = require('../constants/users');
const { validationResult, body } = require('express-validator');
//const { validateRequest } = require('../middlewares/validate-request');
//const { login } = require('../controllers/login')
//const { getJobs } = require('../controllers/jobs')

const router = express.Router();

const login = (req, res) => {
    const body = req.body

    const users = USERS.filter(user => user.email === body.email)
    if (users.length === 0) {
        return res.status(404).send('User does not exist');
    }

    const joonkoUser = users[0]
    if (joonkoUser.password !== body.password) {
        return res.status(401).send('Invalid password');
    }

    res.cookie('_user_session', JSON.stringify({ email: joonkoUser.email }));

    return res.status(200).send('OK');
}

const getJobs = (req, res) => {
    const cookie = req.cookies._user_session;
    if (cookie === undefined) {
        return res.status(401).send('Cookie does not exist');
    }

    const cookieJson = JSON.parse(req.cookies._user_session);
    const user = USERS.filter(user => user.email === cookieJson.email)
    if (user.length === 0) {
        return res.status(401).send('User does not exist');
    }

    const departments = user[0].departments
    const jobs = OPEN_JOBS.filter(job => departments.includes(job.department))

    res.status(200).json({
        jobs
    })
}

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }

    next();
}

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .contains('joonko.co')
            .withMessage('Please use a Joonko email address'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    login
);

router.route("/jobs").get(getJobs)

module.exports = router;