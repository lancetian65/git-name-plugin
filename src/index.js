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
      const currentHead = fs.existsSync(
        path.join(fs.realpathSync(process.cwd()), '.git/HEAD')
      );
      const prevHead = fs.existsSync(
        path.join(fs.realpathSync(process.cwd()), '../git/HEAD')
      );

      if (!prevHead && !currentHead) {
        new WebpackError(
          "GitNamePlugin: current directory it's not a git repository"
        );
      }
      try {
        const gitPath = currentHead
          ? fs.readFileSync(
              path.join(fs.realpathSync(process.cwd()), '.git/HEAD'),
              'utf-8'
            )
          : fs.readFileSync(
              path.join(fs.realpathSync(process.cwd()), '../.git/HEAD'),
              'utf-8'
            );
        const gitHEAD = gitPath.trim();
        const environment = gitHEAD.split('/')[2];
        if (this.envs.includes(environment)) {
          new DefinePlugin({ ENV: JSON.stringify(environment) }).apply(
            compiler
          );
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
