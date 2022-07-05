#!/usr/bin/env node
const {program} = require('commander');

program
    .command('build')
    // .alias('build')
    .description('build a new bundle')
    .action(() => {
        console.log('hello world!');
        // console.log(process);
    });
// program
//     .command('build <type> [name] [otherParams...]')
//     .alias('build')
//     .description('build a new bundle')
//     .action((type, name, otherParams) => {
//         console.log('type', type);
//         console.log('name', name);
//         console.log('other', otherParams);
//         console.log('hello world!');
//     });

program.parse(process.argv);
