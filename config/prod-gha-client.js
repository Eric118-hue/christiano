#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs')
const config = require('../cenv-gha-client');

fs.readdir(config.laravel.public, (err, files)=>{
    files.map((file)=>{
        if(/precache-manifest/.test(file)) {
            var rm = spawn("rm", [config.laravel.public+file]);

            rm.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            rm.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });

            rm.on('close', (code) => {
                
            });
        }
    })
    var webpack = spawn("webpack", [`--config`, 'config/webpack.gha-client.prod.js']);

    webpack.on('close', (code) => {
        spawn("rm", [config.laravel.public+'index.html']);         
    });
})

/*

*/
