const fs = require('fs');
const pathToRepos = require('./pathToRepos');

function getDirContent(req, res, next) {
    fs.readdir(pathToRepos , (err, data) => {
        if (err) {
            return next(err);
        }
        res.locals.filenames = data;
        next();
    });
}

module.exports = getDirContent;