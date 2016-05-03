'use strict';

/*!
 * delete <https://github.com/jonschlinkert/delete>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Promise = require('bluebird');
var fileExists = require('fs-exists-sync');
var del = require('./');

describe('delete:', function() {
  describe('async:', function() {
    beforeEach(function(cb) {
      fs.writeFile('a.txt', 'This is a test.', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it('should delete files asynchronously', function(cb) {
      fs.exists('a.txt', function(exists) {
        assert(exists);

        del('a.txt', function(err) {
          if (err) return cb(err);
          assert(!fileExists('a.txt'));
          cb();
        });
      });
    });

    it('should expose array of deleted files in the callback', function(cb) {
      fs.exists('a.txt', function(exists) {
        assert(exists);

        del('a.txt', function(err, files) {
          if (err) return cb(err);
          assert(!fileExists('a.txt'));
          assert.equal(files.indexOf(path.resolve('a.txt')), 0);
          cb();
        });
      });
    });

    it('should not add files that did not exist to the array', function(cb) {
      fs.exists('a.txt', function(exists) {
        assert(exists);

        del(['a.txt', 'fosoososo'], function(err, files) {
          if (err) return cb(err);
          assert(!fileExists('a.txt'));
          assert.equal(files.length, 1);
          assert.equal(files.indexOf(path.resolve('a.txt')), 0);
          cb();
        });
      });
    });

    it('should delete a glob of files asynchronously', function(cb) {
      fs.exists('a.txt', function(exists) {
        assert(exists);

        del(['*.txt'], function(err) {
          if (err) return cb(err);
          assert(!fileExists('a.txt'));
          cb();
        });
      });
    });

    it('should not delete the cwd:', function(cb) {
      del('.', function(err) {
        if (err) err.message.should.equal('Whoooaaa there! If you\'re sure you want to do this, define `options.force` to delete the current working directory.');
        cb();
      });
    });

    it('should not delete parent directories:', function(cb) {
      del('../', function(err) {
        if (err) err.message.should.equal('Yikes!! Take care! `options.force` must be defined to delete files or folders outside the current working directory.');
        cb();
      });
    });
  });

  describe('sync:', function() {
    it('should delete files synchronously', function() {
      fs.writeFileSync('a.txt', 'This is a test.');
      assert(fileExists('a.txt'));

      del.sync('a.txt');
      assert(!fileExists('a.txt'));
    });

    it('should use the sync method when no callback is given.', function() {
      fs.writeFileSync('a.txt', 'This is a test.');
      assert(fileExists('a.txt'));

      del('a.txt');
      assert(!fileExists('a.txt'));
    });

    it('should delete a glob of files synchronously', function() {
      fs.writeFileSync('a.txt', 'This is a test.');
      assert(fileExists('a.txt'));

      del.sync(['*.txt']);
      assert(!fileExists('a.txt'));
    });

    it('should not delete the current working directory', function() {
      (function() {
        del.sync('.');
      }).should.throw('Whoooaaa there! If you\'re sure you want to do this, define `options.force` to delete the current working directory.');
    });

    it('should not delete parent directories.', function() {
      (function() {
        del.sync('../');
      }).should.throw('Yikes!! Take care! `options.force` must be defined to delete files or folders outside the current working directory.');
    });
  });

  describe('promise:', function() {
    beforeEach(function(cb) {
      fs.writeFile('a.txt', 'This is a test.', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    afterEach(function(cb) {
      fs.exists('a.txt', function(exists) {
        assert(!exists);
        cb();
      });
    });

    it('should delete files with `del.promise`.', function(cb) {
      fs.exists('a.txt', function(exists) {
        assert(exists);
        del.promise('a.txt')
          .then(function() {
            fs.exists('a.txt', function(exists) {
              assert(!exists);
              cb();
            });
          });
      });
    });

    it('should delete a glob of files with `del.promise`.', function(cb) {
      fs.exists('a.txt', function(exists) {
        assert(exists);
        del.promise(['*.txt'])
          .then(function() {
            fs.exists('a.txt', function(exists) {
              assert(!exists);
              cb();
            });
          });
      });
    });
  });
});
