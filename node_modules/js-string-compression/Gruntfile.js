module.exports = function (grunt) {
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        preserveComments: 'some',
      },
      build: {
        src: 'src/jsscompress.js',
        dest: 'build/jsscompress.min.js',
      },
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['tests/**/*.js'],
      },
    },
  });

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('test', ['mochaTest']);
};