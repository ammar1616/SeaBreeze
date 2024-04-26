exports.isAccountant = (req, res, next) => {
    if (req.user.role !== 'accountant') {
        return res.status(403).json({ error: 'Not Authorized. You are not a accountant' });
    }
    next();
};

exports.isSecretary = (req, res, next) => {
    if (req.user.role !== 'secretary') {
        return res.status(403).json({ error: 'Not Authorized. You are not an secretary' });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not Authorized. You are not an admin' });
    }
    next();
};

exports.notAccountant = (req, res, next) => {
    if (req.user.role === 'accountant') {
        return res.status(403).json({ error: 'Not Authorized. You are an accountant' });
    }
    next();
};

exports.notSecretary = (req, res, next) => {
    if (req.user.role === 'secretary') {
        return res.status(403).json({ error: 'Not Authorized. You are an secretary' });
    }
    next();
};

exports.notAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return res.status(403).json({ error: 'Not Authorized. You are an admin' });
    }
    next();
};