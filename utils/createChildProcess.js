const { spawn } = require('child_process');

/**
 * Создает дочерний процесс, используя spawn
 *
 * @param  {string} command - команда
 * @param  {array} options - опции
 * @param  {string} cwd - директория исполнения
 * @param  {string} outputType - тип данных ответа
 * @param  {object} res - http response
 * @param  {string} [page] - страницы для пагинации
 * @param  {string} [limit] - количество позиций на странице
 * @return {undefined} - функция ничего не возвращает
 *
 */
function createChildProcess(command, options, cwd, outputType, res, page, limit) {
    const child = spawn(command, [...options], { cwd });

    let output = '';
    let error = null;

    child.stdout.on('data', (data) => {
        output += data.toString();
    });
    child.stderr.on('data', (data) => {
        error = data.toString();
    });
    child.stdout.on('end', () => {
        if (error) {
            res.send({
                error
            });
        } else {
            switch (outputType) {
                case 'array':
                    output = output.split('\n');
                    break;
                case 'blob':
                    output = Buffer.from(output);
                    break;
                case 'commaString':
                    const outStr = output.replace(/\n/g, ', ');
                    output = outStr.slice(0, outStr.length - 2);
                    break;
            }
            if (page && limit && Array.isArray(output)) {
                const skip = (page - 1) * limit;
                output = output.slice(skip, skip+limit);
            }
            res.send({
                output
            });
        }
    });
}

module.exports = createChildProcess;