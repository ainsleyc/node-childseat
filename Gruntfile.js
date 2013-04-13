module.exports = function (grunt) {

  grunt.initConfig({
    cafemocha: {
      src: [ 'test/**/*.js' ],
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec',
        globals: [
        ]
      }
    },
    watch: {
      files: [ 'Gruntfile.js', 'test/**/*.js', './**/*.js' ],
      tasks: [ 'cafemocha' ]
    }
  });

  grunt.loadNpmTasks('grunt-cafe-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [ 'cafemocha', 'watch' ]);

};
