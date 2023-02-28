const login = (req, res) => {
    const body = req.body
    const user = USERS.filter(user => user.email === body.email)

    if (user.length === 0) {
        return res.status(404).send('User does not exist');
    }

    const joonkoUser = user[0]
    if (joonkoUser.password !== body.password) {
        return res.status(401).send('Invalid password');
    }

    res.cookie('_user_session', JSON.stringify({ email: joonkoUser.email }));

    return res.status(200).send('OK');
}

module.exports = login;