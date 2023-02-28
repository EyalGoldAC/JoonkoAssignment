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

module.exports = getJobs;