module.exports = function(grunt) {
    'use strict';
    grunt.registerMultiTask('fontface', 'Custom fontface task', function() {
        var done = this.async();
        var path = require('path');
        this.requiresConfig([ this.name, this.target, 'src' ].join('.'));
        this.requiresConfig([ this.name, this.target, 'dest' ].join('.'));
        this.requiresConfig([ this.name, this.target, 'pathToLib' ].join('.'));

        this.data.pathToLib = this.data.pathToLib || '/home/denis/fonts/';
        var that = this;
        

        var files = grunt.file.expand({}, this.data.src);
        if (!files.length) {
            grunt.log.writeln('Files not found.'.grey);
            done();
            return;
        }

        // Create output directory
        grunt.file.mkdir(this.data.dest);
        
        grunt.utils.async.forEach(files, function(file, next) {
            
            var baseName = path.basename(file).split('.').length?path.basename(file).split('.').shift():path.basename(file);
            
            var args = [
                file,
                that.data.dest+baseName
            ];
            grunt.utils.spawn({
                cmd: that.data.pathToLib + 'convert.sh',
                args: args
            }, function(err, json, code) {
                
                if (code === 127) {
                    grunt.log.errorlns('Please install fontforge and all other requirements.');
                    grunt.warn('fontforge not found', code);
                }
                else if (err || json.stderr) {
                    // We skip some informations about the bin
                    // and the "No glyphs" warning because fontforge shows it when font contains only one glyph
                    var notError = /\s?(Copyright|License |with many parts BSD |Executable based on sources from|Library based on sources from|Based on source from git|Warning: Font contained no glyphs)/;
                    var lines = (err && err.stderr || json.stderr).split('\n');
                    // write lines for verbose mode
                    var warn = [];
                    lines.forEach(function(line) {
                        if (!line.match(notError)) {
                            warn.push(line);
                        } else {
                            grunt.verbose.writeln("fontforge output ignored: ".grey + line);
                        }
                    });
                    if (warn.length) {
                        grunt.warn(warn.join('\n'));
                        allDone();
                    }
                }

                var result = JSON.parse(json.stdout);
                fontName = path.basename(result.file);
                glyphs = result.names;

                done();
            });
            //grunt.file.copy(file, path.join(tempDir, path.basename(file)));
            next();
        }, done);
        return;
        
        //doSomethingAsync.call(this, done);
    });
};