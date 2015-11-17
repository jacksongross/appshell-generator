module.exports = function(ctx) {

    var fs = ctx.requireCordovaModule('fs');
    var path = ctx.requireCordovaModule('path');
    var deferral = ctx.requireCordovaModule('q').defer();
    var indexFile = path.join(ctx.opts.projectRoot, 'www/index.html');

    fs.readFile(indexFile, {
        encoding: 'utf-8'
    }, function(err, data) {
        if (err) {
            deferral.reject('Reading file failed');
        } else {
            if (data.indexOf('<meta http-equiv="Content-Security-Policy"') > 0) {
                console.log('Content Security Policy exists.');
                deferral.resolve()
            } else {
                var lines = data.split('\n');
                var linesArray = [];
                lines.forEach(function(line) {
                    if (line.indexOf('<head>') === 0) {
                        line = line + '\n' + '<meta http-equiv="Content-Security-Policy" content="default-src * \'unsafe-eval\' \'unsafe-inline\'; script-src * \'unsafe-eval\' \'unsafe-inline\'; style-src * \'unsafe-inline\'; img-src *; media-src *; font-src *" />';
                    }
                    linesArray.push(line);
                });
                var file = linesArray.join('\n');

                fs.writeFile(indexFile, file, function(err) {
                    if (err) {
                        return console.log(err);
                        deferral.reject('Writing to file failed!');
                    }

                    console.log("The file was updated!");
                    deferral.resolve();
                });
            }
        }
    });

    return deferral.promise;
};