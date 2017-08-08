# doc-publisher

## Description

This NPM module is for publishing local skill documents into a parent 'Quest'. It requires both a 'README.md' file to be in the calling project's root directory.
It also requires a certain directory structure containing the index file for the skills being published: '/docs/index.md'

## Usage

To use this module, run `npm install doc-publisher`

Usage example in code:

```
const docPublisher = require('doc-publisher');
const pkginfo = require('pkginfo')(module, 'dependencies');

const dependencies = Object.keys(module.exports.dependencies);
let dependencyKeys = dependencies.filter((key) => {
  return key.startsWith('skill');
});

docPublisher(dependencyKeys);
```
