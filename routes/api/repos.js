const express = require('express');
const router = express.Router();
const fs = require('fs');

const pathToRepos = process.argv[2];

function getDirectoryContent(req, res, next) {
    fs.readdir(pathToRepos , (err, data) => {
        if (err) { return next(err); }
        res.locals.filenames = data;
        next();
    });
}

// @route    GET api/repos
// @desc     Возвращает массив репозиториев, которые имеются в папке
// @access   Public
router.get('/', getDirectoryContent, function(req, res) {
    res.send(res.locals.filenames);
});

module.exports = router;
