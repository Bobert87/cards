// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({
        express: {
            options: {
                // Override defaults here

            },
            dev: {
                options: {
                    port:3001,
                    script: './app.js'
                }
            },
            prod: {
                options: {
                    script: 'path/to/prod/server.js',
                    node_env: 'production'
                }
            },
            test: {
                options: {
                    script: 'path/to/test/server.js'
                }
            }
        },
        watch: {
            express: {
                files:  [ 'app.js','src/core/**'],
                tasks:  [ 'express:dev' ],
                options: {
                    spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
                }
            }
        },
        loadCards:{
            dc:{
                cards:['punch','weakness','kick','vulnerability']
            }
        }
    });

    grunt.registerTask('loadCards','Loading Deck',function()
    {
        console.log(grunt.config('loadCards.dc.cards'));
    });

    grunt.registerTask('play', [ 'express:dev','loadCards', 'watch' ]);

    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    // we can only load these if they are in our package.json
    // make sure you have run npm install so our app can find these
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

};
