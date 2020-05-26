/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Authors Simen Brekken @simenbrekken, Einar Löve @einarlove
*/

'use strict';

/** @typedef {import("./Compiler")} Compiler */

const WebpackError = require('webpack/lib/WebpackError');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const fs = require('fs');
const path = require('path');
class GitNamePlugin {
  constructor(params = { envs: ['dev', 'test', 'prod'] }) {
    this.envs = params.envs;
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('GitNamePlugin', (compilation) => {
      const currentHeadPath = path.join(
        fs.realpathSync(process.cwd()),
        '.git/HEAD'
      );
      const prevHeadPath = path.join(
        fs.realpathSync(process.cwd()),
        '../.git/HEAD'
      );
      const currentHead = fs.existsSync(currentHeadPath);
      const prevHead = fs.existsSync(prevHeadPath);

      if (!prevHead && !currentHead) {
        new WebpackError(
          "GitNamePlugin: current directory it's not a git repository"
        );
      }
      try {
        const gitPath = currentHead
          ? fs.readFileSync(currentHeadPath, 'utf-8')
          : fs.readFileSync(prevHeadPath, 'utf-8');
        const gitHEAD = gitPath.trim();
        const gitBranchName = gitHEAD.split('/')[2];
        let env;
        this.envs.forEach((value) => {
          if (new RegExp(value).test(gitBranchName)) {
            env = value;
          }
        });
        if (env) {
          new DefinePlugin({ ENV: JSON.stringify(env) }).apply(compiler);
        } else {
          new WebpackError('GitNamePlugin: no branch name equal to envs');
        }
      } catch (error) {
        compilation.errors.push(
          new WebpackError('GitNamePlugin: access file .git/HEAD faild')
        );
      }
    });
  }
}

module.exports = GitNamePlugin;
