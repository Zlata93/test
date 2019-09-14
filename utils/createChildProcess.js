const { spawn } = require('child_process');

function createChildProcess(command, options, cwd, outputType, res) {
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
            res.send({
                output
            });
        }
    });
}

module.exports = createChildProcess;