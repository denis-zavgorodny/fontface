module.exports = function(grunt) {
    'use strict';
    grunt.loadTasks('/home/denis/fonts/');
    grunt.initConfig({
        fontface: {
            test1: {
                src: '*.otf',
                dest: 'font-build/',
                pathToLib: '/home/denis/fonts/'
            },
            
        },
    });
    
    //grunt.loadTasks('tasks');


    grunt.registerTask('default', ['fontface']);

};