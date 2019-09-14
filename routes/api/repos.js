const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const { spawn } = require('child_process');
const getDirContent = require('../../utils/getDirContent');
const pathToRepos = require('../../utils/pathToRepos');

// @route    GET api/repos
// @desc     Возвращает массив репозиториев, которые имеются в папке
// @access   Public
router.get('/', getDirContent, (req, res) => {
    if (res.locals.err) {
        return res.send({ error: res.locals.err });
    }
    res.send({
        repos: res.locals.files
    });
});

// @route    GET /api/repos/:repositoryId/commits/:commitHash
// @desc     Возвращает массив коммитов в данной ветке (или хэше коммита) вместе с датами их создания
// @access   Public
router.get('/:repositoryId/commits/:commitHash', (req, res) => {
    const { repositoryId, commitHash } = req.params;
    const child = spawn('git', ['log', `${commitHash}`, '--pretty=format:"%H %s %cd"', '--date=format:%Y-%m-%d %H:%M'], {
        cwd: `${pathToRepos}/${repositoryId}`
    });

    let output = '';

    child.stdout.on('data', (data) => {
        output += data.toString();
    });
    child.stdout.on('end', () => {
        res.send({
            repositoryId,
            commitHash,
            commits: output.split('\n')
        });
    });
});

// @route    GET /api/repos/:repositoryId/commits/:commitHash/diff
// @desc     Возвращает diff коммита в виде строки
// @access   Public
router.get('/:repositoryId/commits/:commitHash/diff', (req, res) => {
    const { repositoryId, commitHash } = req.params;
    const child = spawn('git', ['diff', `${commitHash}`, `${commitHash}~`], {
        cwd: `${pathToRepos}/${repositoryId}`
    });

    let output = '';

    child.stdout.on('data', (data) => {
        output += data.toString();
    });

    child.stdout.on('end', () => {
        res.send({
            repositoryId,
            commitHash,
            diff: output
        });
    });
});

// @route    GET /api/repos/:repositoryId(/tree/:commitHash/:path)
// @desc     Возвращает содержимое репозитория по названию ветки (или хэшу комита).
//           Параметр repositoryId - название репозитория (оно же - имя папки репозитория).
//           То, что в скобках - опционально, если отсутствует и branchName, и path -
//           отдать актуальное содержимое в корне в главной ветке репозитория.
// @access   Public
// router.get('/:repositoryId(/tree)?/:commitHash?/:path([^/]*)?', (req, res) => {
router.get('/:repositoryId/tree?/:commitHash?/:path([^/]*)?', (req, res) => {
    const { repositoryId, commitHash = 'master', path } = req.params;
    const child = spawn('git', ['ls-tree', '--name-only', `${commitHash}`], {
        cwd: `${pathToRepos}/${repositoryId}/${path ? path : ''}`
    });

    let output = '';

    child.stdout.on('data', (data) => {
        output += data.toString();
    });
    child.stdout.on('end', () => {
        const outStr = output.replace(/\n/g, ', ');
        res.send({
            repositoryId,
            commitHash,
            content: outStr
        });
    });
});

// @route    GET /api/repos/:repositoryId/blob/:commitHash/:pathToFile
// @desc     Возвращает содержимое конкретного файла, находящегося по пути pathToFile в ветке
//           (или по хэшу коммита) branchName. С используемой памятью должно быть все в порядке.
// @access   Public
router.get('/:repositoryId/blob/:commitHash/:pathToFile([^/]*)', (req, res) => {
    const { repositoryId, commitHash, pathToFile } = req.params;
    const child = spawn('git', ['show', '--name-only', `${commitHash}:${pathToFile}`], {
        cwd: `${pathToRepos}/${repositoryId}`
    });

    let output = '';

    child.stdout.on('data', (data) => {
        output += data;
    });
    child.stdout.on('end', () => {
        res.send({
            repositoryId,
            commitHash,
            fileContent: Buffer.from(output)
        });
    });
});

// @route    DELETE /api/repos/:repositoryId
// @desc     Безвозвратно удаляет репозиторий
// @access   Public
router.delete('/:repositoryId', (req, res) => {
    const { repositoryId } = req.params;
    exec(`cd ${pathToRepos} && rm -rf ${repositoryId}`, (err, stdout, stderr) => {
        if (err) {
            exec(`cd ${pathToRepos} && rmdir /s /q ${repositoryId}`, (err, stdout, stderr) => {
                if (err) {
                    return res.json({ msg: err });
                }
                res.send({ msg: 'Successfully deleted!' });
            });
        }
    });
});

// @route    POST /api/repos/:repositoryId + { url: ‘repo-url’ }
// @desc     Добавляет репозиторий в список, скачивает его по переданной в теле запроса
//           ссылке и добавляет в папку со всеми репозиториями.
// @access   Public
router.post('/:repositoryId', (req, res) => {
    const { repositoryId } = req.params;
    const { url } = req.body;
    exec(`cd ${pathToRepos} && git clone ${url} ${repositoryId}`, (err, stdout, stderr) => {
        if (err) {
            return res.json({ msg: err });
        }
        res.send({ msg: 'Successfully added!' });
    });
});

module.exports = router;

