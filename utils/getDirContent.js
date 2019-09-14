const fs = require('fs');
const pathToRepos = require('./pathToRepos');

function getDirContent(req, res, next) {
    fs.readdir(pathToRepos, (err, data) => {
        if (err) {
            res.locals.err = err;
            next();
        }
        res.locals.files = data;
        next();
    });
}

module.exports = getDirContent;