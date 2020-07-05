#!/usr/bin/node
const Bimo = require('.')
const project = new Bimo({
  cwd: process.cwd(),
})
project.bim()
