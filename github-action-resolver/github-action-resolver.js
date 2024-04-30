const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;

const app = express();
const port = 5734; // You can use any port that is free on your system

app.use(bodyParser.json());

let logs;
let complete = false;

app.post('/webhook', (req, res) => {
    console.log('Webhook received!');

    const process = exec('powershell.exe C:\\vila-spliit-backup\\RunRebuilder.ps1');

    process.on('error', (err) => {
        console.error(`Exec error: ${err}`);
        res.status(500).send('Script failed');
    });

    process.stdout.on('data', (data) => {
        const log = `stdout: ${data}`
        console.log(log);
        logs += '\n' + log;
    });

    process.stderr.on('data', (data) => {
        const log = `stderr: ${data}`
        console.log(log);
        logs += '\n' + log;
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.send(`Script executed \n ${logs}`);
        complete = true;
    });
});

app.get('/status', (req, res) => {
    if (complete) {
        res.send('complete');
        complete = false;
        return;
    }
    res.send(logs ?? 'empty');
    logs = '';
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
