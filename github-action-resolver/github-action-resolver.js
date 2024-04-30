const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;

const app = express();
const port = 5734; // You can use any port that is free on your system

app.use(bodyParser.json());

let logs;
let process;
app.post('/webhook', (req, res) => {
    console.log('Webhook received!');

    process = exec('powershell.exe C:\\vila-spliit-backup\\RunRebuilder.ps1');

    process.on('error', (err) => {
        console.error(`Exec error: ${err}`);
        res.status(500).send('Script failed');
    });

    process.stdout.on('data', (data) => {
        console.log(data);
        logs += '\n' + data;
    });

    process.stderr.on('data', (data) => {
        console.log(data);
        logs += '\n' + data;
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    return res.send('redeploy started')
});

app.get('/status', (req, res) => {
    console.log('reporting status');
    if (process?.exitCode !== null) {
        return res.send({ status: 'complete' });
    }
    res.send({ status: logs ?? 'empty' });
    logs = '';
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
