#! /usr/bin/env node

var shell = require('shelljs');
var jsonfile = require('jsonfile');

var file = 'shellfile.json';

jsonfile.readFile(file, function(err, config) {
    if (err) throw "Couldn't find shellfile.json. Please make sure it is in the current working directory.";

    shell.exec('cordova create ' + config.name + ' ' + config.identifier + ' "' + config.displayName || config.name + '"');

    shell.exec('rm -rf ' + config.name+ '/www');
    shell.exec('node $(npm config get prefix)/lib/node_modules/ac-appshell-generator/node_modules/@blinkmobile/appcache-fetcher/index.js ' + config.answerspace + ' ' + config.name + '/www');

    shell.cd(config.name);

    config.platform.forEach(function(platform) {
        shell.exec('cordova platform add ' + platform);
    });

    config.plugins.forEach(function(plugin) {
        shell.exec('cordova plugin add ' + plugin);
    });

    shell.mkdir('resources');

    if (config.icon) shell.cp(config.icon, 'resources/icon.png');
    if (config.splash) shell.cp(config.splash, 'resources/splash.png');
    shell.exec('ionic resources');

    shell.exec('cordova build');
    console.log('done!');
});