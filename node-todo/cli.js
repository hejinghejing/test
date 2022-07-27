#!/usr/bin/env node

const program = require('commander')
const api = require('./index.js')
const pkg = require('./package.json')

program.version(pkg.version)

//  子命令
program
    .command('add')
    .description('添加任务')
    .action((str, option) => {
        api.add(option.args)
    });

program
    .command('clear')
    .description('清理所有任务')
    .action(() => {
        api.clear()
    });

program
    .command('list')
    .description('展示所有任务')
    .action(() => {
        api.showAll()
    });

program.parse(process.argv);

