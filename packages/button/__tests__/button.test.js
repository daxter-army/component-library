'use strict';

const button = require('../lib/Button');
const assert = require('assert').strict;

assert.strictEqual(button(), 'Hello from button');
console.info('button tests passed');
