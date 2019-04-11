#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const ncp = require('ncp').ncp;
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const cp = require('child_process');

const pageJs = 'page-javascript';
const npm = 'npm';

const deleteFolder = (filePath) => {
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath);
    files.forEach(file => {
      const nextFolderPath = path.resolve(filePath, `./${file}`);
      const state = fs.statSync(nextFolderPath);
      if (state.isDirectory()) {
        deleteFolder(nextFolderPath)
      } else {
        fs.unlinkSync(nextFolderPath);
      }
    });
    fs.rmdirSync(filePath);
  }
};
const createFolder = (answer, cb) => {
  const p = path.resolve(process.cwd(), `./${answer.folder}`);
  const flag = fs.existsSync(p);
  if (!flag) {
    cb(p);
  } else {
    const pStatus = fs.readdirSync(p);
    if (pStatus.length === 0) {
      fs.rmdirSync(p);
      cb(p);
    } else {
      console.log(chalk.red(`folder：${answer.folder} is not empty!`));
    }
  }
}

const version = require('./package').version;
program
  .version(version, '-v, --version')
  .usage('[options]')
  .option('-l, --scaffold-list', 'show scaffold list')
  .option('-s, --select-scaffold', 'show scaffold select list')
  .parse(process.argv);

if (program.scaffoldList) {
  const text = `Scaffold：
  1, page(js)
  2, npm
  `;
  console.log(text)
} else if (program.selectScaffold) {
  inquirer.prompt([{
    type: 'list',
    name: 'scaffold',
    message: 'scaffold list:',
    choices: [{
      name: 'page(js)',
      value: pageJs,
      short: pageJs,
    }, {
      name: npm,
      value: npm,
      short: npm,
    }]
  }]).then(choice => {
    // Use user feedback for... whatever!!
    switch (choice.scaffold) {
      case pageJs:
        inquirer.prompt({
          type: 'input',
          name: 'folder',
          message: 'folder name:'
        }).then(answer => {
          createFolder(answer, (p) => {
            fs.mkdirSync(p);
            console.log(chalk.green('Digging...'));
            process.chdir(p);
            cp.execSync('npm i @zhouyk/javascript-web-framework', {
              stdio: 'inherit'
            });
            ncp(path.join(p, 'node_modules/@zhouyk/javascript-web-framework'), p, function (err) {
              if (err) {
                return console.error(chalk.red(err));
              }
              process.chdir(p);
              //deleteFolder('./node_modules/@zhouyk');
              cp.execSync('npm i', {
                stdio: 'inherit'
              });
              console.log(chalk.green('Done! Enjoy your work!'));
            })
          })
        });
      break;
      case npm:
        inquirer.prompt({
          type: 'input',
          name: 'folder',
          message: 'folder name:'
        }).then(answer => {
          createFolder(answer, (p) => {
            fs.mkdirSync(p);
            console.log(chalk.green('Digging...'));
            process.chdir(p);
            cp.execSync('npm i @zhouyk/npm-scaffold', {
              stdio: 'inherit'
            });
            ncp(path.join(p, 'node_modules/@zhouyk/npm-scaffold'), p, function (err) {
              if (err) {
                return console.error(chalk.red(err));
              }
              process.chdir(p);
              cp.execSync('npm i', {
                stdio: 'inherit'
              });
              cp.execSync('npm init', {
                stdio: 'inherit'
              });
              console.log(chalk.green('Done! Enjoy your work!'));
            })
          });
        });
    }

  });
} else {
  program.outputHelp();
}
