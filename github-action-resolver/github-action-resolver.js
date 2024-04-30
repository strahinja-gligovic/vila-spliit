const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;

const app = express();
const port = 5734; // You can use any port that is free on your system

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('Webhook received!');

    const process = exec('powershell.exe C:\\vila-spliit-backup\\RunRebuilder.ps1');

    process.on('error', (err) => {
        console.error(`Exec error: ${err}`);
        res.status(500).send('Script failed');
    });

    process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.send('Script executed');
    });

    // Set a timeout for the script execution
    setTimeout(() => {
        process.kill(); // This will terminate the script if it's still running
        res.status(408).send('Script execution timeout');
    }, 120000); 
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
