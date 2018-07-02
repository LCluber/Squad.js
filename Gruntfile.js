module.exports = function(grunt){

  require('time-grunt')(grunt);

  var projectName = 'Squad';
  var projectNameLC = projectName.toLowerCase();

  var port            = 3010;
  var host            = 'localhost';

  var srcDir          = 'src/';
  var compiledSrcDir  = srcDir + 'ts/build/';
  var compiledES5Dir  = compiledSrcDir + 'es5/';
  var compiledES6Dir  = compiledSrcDir + 'es6/';
  var distDir         = 'dist/';
  var webDir          = 'website/';
  var publicDir       = webDir + 'public/';
  var nodeDir         = 'node_modules/';
  var docDir          = 'doc/';

  var banner    = '/** MIT License\n' +
    '* \n' +
    '* Copyright (c) 2015 Ludovic CLUBER \n' +
    '* \n' +
    '* Permission is hereby granted, free of charge, to any person obtaining a copy\n' +
    '* of this software and associated documentation files (the "Software"), to deal\n' +
    '* in the Software without restriction, including without limitation the rights\n' +
    '* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n' +
    '* copies of the Software, and to permit persons to whom the Software is\n' +
    '* furnished to do so, subject to the following conditions:\n' +
    '*\n' +
    '* The above copyright notice and this permission notice shall be included in all\n' +
    '* copies or substantial portions of the Software.\n' +
    '*\n' +
    '* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n' +
    '* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' +
    '* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n' +
    '* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n' +
    '* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n' +
    '* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n' +
    '* SOFTWARE.\n' +
    '*\n' +
    '* http://' + projectNameLC + 'js.lcluber.com\n' +
    '*/\n';


  grunt.option('stack', true);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      lib:{
        src: [  distDir        + '*',
                compiledES5Dir + '*',
                compiledES6Dir + '*'
              ]
      },
      doc:{
        src: [  docDir + '*'
              ]
      },
      websass:{
        src: [  webDir + 'sass/build/*',
                publicDir + 'css/*'
        ]
      },
      webjs: {
        src: [  publicDir + 'js/*'
        ]
      },
      webmisc: {
        src: [  publicDir + 'fonts/*'
        ]
      }
    },
    typedoc: {
  		build: {
  			options: {
  				out: docDir,
  				target: 'es6',
          name: projectName + '.js - Documentation'
  			},
  			src: [srcDir + 'ts/*.ts']
  		}
  	},
    jshint: {
      options: {

      },
      web: [ webDir + 'js/**/*.js']
    },
    sass: {
      lib: {
        options: {
          trace:true
        },
        files: [{
          expand: true,
          cwd: srcDir + 'style/',
          src: ['*.scss'],
          dest: srcDir + 'style/build/',
          ext: '.css'
        }]
      },
      web: {
        options: {
          trace:true
        },
        files: [{
          expand: true,
          cwd: webDir + 'sass/',
          src: ['*.scss'],
          dest: webDir + 'sass/build/',
          ext: '.css'
        }]
      }
    },
    csslint: {
      dist: {
        options: {
          import: false
        },
        src: [webDir + 'sass/build/**/*.css']
      }
    },
    cssmin:{
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          src: webDir  + 'sass/build/**/*.css',
          dest: publicDir + 'css/style.min.css'
        }]
      }
    },
    pug: {
      lib: {
        options: {
          namespace   : 'JST',
          separator   : '\n\n',
          amd         : false,
          client      : false,
          pretty      : true,
          self        : false,
          debug       : false,
          compileDebug: true
        },
        files: [ {
          cwd: srcDir + 'template/',
          src: ['**/*.pug', '!**/_*.pug'],
          dest: srcDir + 'template/build',
          expand: true,
          ext: '.htm'
        } ]
      }
    },
    htmlmin: {
      static: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: webDir + 'static',
        src: ['**/*.htm'],
        dest: webDir + 'static/'
      }
    },
    // tslint: {
    //   options: {
    //     configuration: 'config/tslint.json',
    //     force: false
    //   },
    //   lib: {
    //     files: [{
    //       expand: true,
    //       cwd: srcDir,
    //       src: [ srcDir + '**/*.ts' ]
    //     }]
    //   }
    // },
    ts: {
      options: {
        fast: 'never'
        //rootDir: srcDir + 'ts/'
      },
      es6: {
        tsconfig: 'tsconfig.json',
        src: [ srcDir + 'ts/**/*.ts', '!node_modules/**/*.ts' ]
      },
      es5: {
        tsconfig: 'tsconfig.es5.json',
        src: [ srcDir + 'ts/**/*.ts', '!node_modules/**/*.ts' ]
      }
    },
    rollup: {
      es6:{
        options: {
          format:'es',
          // moduleName: projectName,
          banner: banner
          // sourceMap: 'inline'
        },
        files: [ {
          src : compiledES6Dir + projectNameLC + '.js',
          dest : distDir + projectNameLC + '.js'
        } ]
      },
      iife:{
        options: {
          format:'iife',
          moduleName: projectName,
          banner: banner
          // sourceMap: 'inline'
        },
        files: [ {
          src : compiledES5Dir + projectNameLC + '.js',
          dest : distDir + projectNameLC + '.iife.js'
        } ]
      }
    },
    uglify: {
      libIife: {
        options: {
          sourceMap: true,
          sourceMapName: compiledSrcDir + 'sourcemap.map',
          banner: banner,
          mangle: {
            reserved: [projectName]
          },
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            unsafe: false,
            conditionals:true,
            comparisons:true,
            booleans:true,
            loops:true,
            unused: true,
            hoist_funs:true,
            if_return:true,
            join_vars:true,
            warnings: true,
            drop_console: false,
            keep_fargs: false,
            keep_fnames: false
          }
        },
        src: distDir + projectNameLC + '.iife.js',
        dest: distDir + projectNameLC + '.iife.min.js'
      },
      web: {
        options: {
          sourceMap: true,
          sourceMapName: srcDir + 'sourcemap.map',
          banner: '',
          mangle: {
            reserved: ['jQuery']
          },
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            unsafe: false,
            conditionals:true,
            comparisons:true,
            booleans:true,
            loops:true,
            unused: true,
            hoist_funs:true,
            if_return:true,
            join_vars:true,
            warnings: true,
            drop_console: false,
            keep_fargs: false,
            keep_fnames: false
          }
        },
        files: [{
          src  : [
            nodeDir + 'jquery-easing/jquery.easing.1.3.js',
            distDir + projectNameLC + '.iife.js',
            webDir + 'js/*.js'
          ],
          dest : publicDir + 'js/main.min.js'
        }]
      }
    },
    concat:{
      declaration: {
        options: {
          separator: '',
          stripBanners: false,
          banner: banner
        },
        src: compiledES6Dir + '*.d.ts',
        dest: distDir + projectNameLC + '.d.ts'
      },
      libpug: {
        options: {
          separator: ''
        },
        src: [srcDir + 'template/**/*.pug'
            ],
        dest: webDir + 'views/_' + projectNameLC +'.pug'
      },
      libhtm: {
        options: {
          separator: '',
          stripBanners: false,
          banner: banner
        },
        src: [srcDir + 'template/build/**/*.htm'
            ],
        dest: distDir + projectNameLC + '.htm'
      },
      libcss: {
        options: {
          separator: '',
          stripBanners: false,
          banner: banner
        },
        src: [srcDir + 'style/build/**/*.css'
            ],
        dest: distDir + projectNameLC + '.css'
      },
      webjs: {
        options: {
          separator: '',
          stripBanners: true,
          banner: ''
        },
        src: [  nodeDir   + 'socket.io-client/dist/socket.io.js',
                nodeDir   + 'jquery/dist/jquery.min.js',
                nodeDir   + 'bootstrap/dist/js/bootstrap.min.js',
                publicDir + 'js/main.min.js'
            ],
        dest: publicDir + 'js/main.min.js'
      },
      webcss: {
        options: {
          separator: '',
          stripBanners: true,
          banner: ''
        },
        src: [nodeDir + 'font-awesome/css/font-awesome.min.css',
              nodeDir + 'bootstrap/dist/css/bootstrap.min.css',
              distDir + projectNameLC + '.css',
              publicDir + 'css/style.min.css'
            ],
        dest: publicDir + 'css/style.min.css'
      }
    },
    strip_code: {
      options: {
        //import { IBase64Service } from '../services/base64.service';
        // /// <reference path="../config/typings/index.d.ts" />
        patterns: [ /import.*';/g,
                    /export { .* } from '.*';/g,
                    /\/\/\/ <reference path=.*\/>/g
                  ]
      },
      declaration: {
        src: distDir + projectName + '.d.ts'
      }
    },
    copy: {
      server: {
        files: [
          { expand: true,
            cwd: srcDir + 'server/',
            src: ['*'],
            dest: distDir,
            filter: 'isFile'
          }
        ]
      },
      fonts:{
        expand: true,
        cwd: nodeDir + 'bootstrap/dist/',
        src: ['fonts/**/*'],
        dest: publicDir,
        filter: 'isFile'
      },
      fontAwesome:{
        expand: true,
        cwd: nodeDir + 'font-awesome/',
        src: ['fonts/**/*'],
        dest: publicDir,
        filter: 'isFile'
      }
    },
    nodemon: {
      dev: {
        script: 'bin/www',
        options: {
          //nodeArgs: ['--debug'],
          delay:1000,
          watch: ['website/routes', 'website/app.js'],
          ext: 'js,scss'
        }
      }
    },
    open: {
      all: {
        path: 'http://' + host + ':' + port
      }
    },
    watch: {
      libts: {
        files: [ srcDir + 'ts/**/*.ts', '!' + srcDir + 'ts/build/*'],
        tasks: ['dist'],
      },
      libpug: {
        files: srcDir + 'template/**/*.pug',
        tasks: ['dist'],
      },
      libsass: {
        files: srcDir + 'style/**/*.scss',
        tasks: ['dist'],
      },
      webpug:{
        files: webDir + 'views/**/*.pug'
      },
      webjs: {
        files: webDir + 'js/**/*.js',
        tasks: ['webjs'],
      },
      websass: {
        files: [webDir + 'sass/**/*.scss', '!' + webDir + 'sass/build/*'],
        tasks: ['websass'],
      },
      options: {
        interrupt: true,
        spawn: false,
        livereload: true,
        livereloadOnError:false
      }
    },
    // run watch and nodemon at the same time
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: [ 'nodemon', 'watch', 'open' ]
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-copy' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-csslint' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-pug' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );
  grunt.loadNpmTasks( 'grunt-contrib-htmlmin' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-strip-code' );
  grunt.loadNpmTasks( 'grunt-concurrent' );
  grunt.loadNpmTasks( 'grunt-nodemon' );
  grunt.loadNpmTasks( 'grunt-open' );
  grunt.loadNpmTasks( 'grunt-tslint' );
  grunt.loadNpmTasks( 'grunt-ts' );
  grunt.loadNpmTasks( 'grunt-rollup' );
  grunt.loadNpmTasks( 'grunt-typedoc' );

  grunt.registerTask( 'lib',
                      'build the library in the dist/ folder',
                      [ //'tslint:lib',
                        'clean:lib',
                        //lib es6
                        'ts:es6',
                        'rollup:es6',
                        //lib es5
                        'ts:es5',
                        'rollup:iife',
                        'uglify:libIife',
                        //declaration
                        'concat:declaration',
                        'strip_code:declaration',
                        //template
                        'sass:lib',
                        'pug:lib',
                        'concat:libhtm', 'concat:libcss', 'concat:libpug',
                        'copy:server'
                      ]
                    );

  grunt.registerTask( 'doc',
                      'Compile lib documentation',
                      [ 'clean:doc',
                        'typedoc'
                       ]
                    );

  grunt.registerTask( 'serve',
                      'launch server, open website and watch for changes',
                      [ 'concurrent' ]
                    );

  grunt.registerTask( 'websass',
                      'Compile website css',
                      [ 'clean:websass',
                        'sass:web',
                        'cssmin',
                        'concat:webcss'
                       ]
                    );

  grunt.registerTask( 'webjs',
                      'Compile website js',
                      [ 'jshint:web',
                        'clean:webjs',
                        'uglify:web',
                        'concat:webjs'
                       ]
                    );

  grunt.registerTask( 'webmisc',
                      'Compile website misc',
                      [ 'clean:webmisc',
                        'copy:fonts',
                        'copy:fontAwesome'
                       ]
                    );

  grunt.registerTask( 'website',
                      'build the website in the website/ folder',
                      function() {
                        grunt.task.run('webjs');
                        grunt.task.run('websass');
                        grunt.task.run('webmisc');
                      }
                    );

  grunt.registerTask( 'dist',
                      'build library and website',
                      function() {
                        //build lib
                        grunt.task.run('lib');
                        //build site
                        grunt.task.run('website');
                        //build documentation
                        grunt.task.run('doc');
                      }
                    );

  grunt.registerTask( 'default',
                      'build library, website, launch server, open website and watch for changes.',
                      function() {
                        //build library and website
                        grunt.task.run('dist');
                        // launch server and watch for changes
                        grunt.task.run('serve');
                      }
                    );

};
