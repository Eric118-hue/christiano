#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs')

fs.readdir('/mnt/hgfs/empire/var/www/macentrale/leg2/public/', (err, files)=>{
    files.map((file)=>{
        if(/precache-manifest/.test(file)) {
            var rm = spawn("rm", [`/mnt/hgfs/empire/var/www/macentrale/leg2/public/${file}`]);

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
        spawn("rm", ['/mnt/hgfs/empire/var/www/macentrale/leg2/public/index.html']);         
    });
})

/*

*/
