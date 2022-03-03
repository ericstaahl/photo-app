const debug = require('debug')('books:auth');
const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    if (!req.headers.authorization) {
        debug('Authorization header missing');
        return res.status(401).send({
            status: "fail",
            data: "Authorization required",
        });
    };
    const [authSchema, token] = req.headers.authorization.split(' ');
    // If authschema isn't equal to "bearer" a different form of authentication is trying to be used
    if (authSchema.toLowerCase() !== "bearer") {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization is required for access'
        });
    };
    //POTENTIAL TODO: add check for expirty date?
    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization is required for access'
        });
    };
    next();
};

module.exports = {
    validateToken
};
