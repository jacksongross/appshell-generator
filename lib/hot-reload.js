var exec = require('child_process').exec;

module.exports = function(ctx) {

    var fs = ctx.requireCordovaModule('fs');
    var path = ctx.requireCordovaModule('path');
    var deferral = ctx.requireCordovaModule('q').defer();
    var configFile = path.join(ctx.opts.projectRoot, '../shellfile.json');

    var contents = fs.readFileSync(configFile, "utf8");
    var config = JSON.parse(contents);

    exec('rm -rf www', function(error, stdout, stderr) {
        if (error) {
            console.log(error);
            deferral.reject('Updating www failed!');
        } else {
            exec('node $(npm config get prefix)/lib/node_modules/appshell-generator/node_modules/@blinkmobile/appcache-fetcher/index.js ' + config.answerspace + ' www/', function(error, stdout, stderr) {
                if (error) {
                    console.log(error);
                    deferral.reject('Retrieving answerspace failed!');
                } else {
                    console.log(stdout, stderr);
                    deferral.resolve();
                }
            });
        }
    });

    return deferral.promise;
};