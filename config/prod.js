#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs')

fs.readdir('/home/airmaildata/www/preprod/public/', (err, files)=>{
    files.map((file)=>{
        if(/precache-manifest/.test(file)) {
            var rm = spawn("rm", [`/home/airmaildata/www/preprod/public/${file}`]);

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
    var webpack = spawn("webpack", [`--config`, 'config/webpack.prod.js']);

    webpack.on('close', (code) => {
        spawn("rm", ['/home/airmaildata/www/preprod/public/index.html']);         
    });
})

/*

*/
