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
        mochaTest: {
            test: {
                src: ['./core/test/**/*.js']
            }
        },
        nodemon: {
            dev: {
                script: './site/bin/www'
            }
        },
        watch: {
            js: {
                options: {
                    spawn: false
                },
                files: ['**/*.js'],
                tasks: ['mochaTest']
            }
        },
        concurrent: {
            dev: ['mochaTest', 'nodemon', 'watchify'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-watchify');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['watchify', 'nodemon']);
};