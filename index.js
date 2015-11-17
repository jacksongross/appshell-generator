#! /usr/bin/env node

var shell = require('shelljs');
var jsonfile = require('jsonfile');
var os = require('os');
var fs = require('fs');

var file = 'shellfile.json';

Array.prototype.includes = function(element) {
    return this.indexOf(element) > -1;
};

function isValidEnvironment(platforms) {
    var env = os.platform();
    var isMac = /^darwin/.test(env);
    var isWin = /^win/.test(env);
    var isLinux = /^linux/.test(env);

    if (!isMac && platforms.includes('ios')) return false;
    if (!isWin && platforms.includes('windows')) return false;
    return true;
};

jsonfile.readFile(file, function(err, config) {
    if (err) throw "Couldn't find shellfile.json. Please make sure it is in the current working directory.";
    if (!isValidEnvironment(config.platform)) {
        console.log("Unable to build app shells for all platforms for this OS or environment.");
        console.log("See: https://cordova.apache.org/docs/en/5.1.1/guide/cli/index.html#link-1")
        process.exit(0);
    }

    var displayName = config.displayName || config.name;
    shell.exec('cordova create "' + config.name + '" ' + config.identifier + ' "' + displayName + '"');

    shell.exec('rm -rf ' + config.name + '/www');
    shell.exec('node $(npm config get prefix)/lib/node_modules/appshell-generator/node_modules/@blinkmobile/appcache-fetcher/index.js ' + config.answerspace + ' ' + config.name + '/www');
    shell.exec('cp build.json ' + config.name + '/');


    shell.cd(config.name);

    // move the cordova hooks to lib and insert line into config.xml
    shell.mkdir('lib');
    shell.exec('cp $(npm config get prefix)/lib/node_modules/appshell-generator/lib/* lib/');

    var contents = fs.readFileSync('config.xml', "utf8");
    if (contents) {
        var lines = contents.split('\n');
        var linesArray = [];
        lines.forEach(function(line) {
            if (line.indexOf('</widget>') === 0) {
                line = '<hook type="before_build" src="lib/hot-reload.js" />\n' +
                    '<hook type="before_build" src="lib/content-security.js" />\n' +
                    line;
            }
            linesArray.push(line);
        });
        var file = linesArray.join('\n');
        fs.writeFileSync('config.xml', file, 'utf8');
    }

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

    shell.exec('cordova build --device --release --buildConfig ');

    console.log('done!');
});