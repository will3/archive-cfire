module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watchify: {
            editor: {
                src: './editor/main.js',
                dest: './site/public/javascripts/edit.js'
            },
            app: {
                src: './app/main.js',
                dest: './site/public/javascripts/app.js'
            }
        },
        nodemon: {
            dev: {
                script: './site/bin/www'
            }
        }
    });

    grunt.loadNpmTasks('grunt-watchify');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-keepalive');

    grunt.registerTask('default', ['watchify', 'nodemon', 'keepalive']);

};