'use strict';

const label = require('../lib/Label');
const assert = require('assert').strict;

assert.strictEqual(label(), 'Hello from label');
console.info('label tests passed');
