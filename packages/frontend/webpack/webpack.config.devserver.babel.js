// @flow
import { HotModuleReplacementPlugin } from 'webpack';
import DashboardPlugin from 'webpack-dashboard/plugin';
import merge from 'webpack-merge';
import WriteFilePlugin from 'write-file-webpack-plugin';
import { port as backendPort } from 'tbd-backend-name/env';
import chalk from 'chalk';
import webpackDev from './webpack.config.dev.babel';
import outputDir from '../lib';

const port = process.env.PORT || 3000;

if (backendPort === port) {
  throw new Error('The ports for backend and frontend are the same');
}

const frontendUrl = `http://localhost:${port}/`;
const backendUrl = `http://localhost:${backendPort}/`;

console.log(chalk.green(`The backend should be running on ${backendUrl}`));
console.log(chalk.green(`The frontend will be run on ${frontendUrl}`));

export default function(env, argv) {
  const open = argv.auto ? JSON.parse(argv.auto) : true;

  return merge.smartStrategy({
    entry: 'prepend',
    plugins: 'append',
  })(webpackDev, {
    entry: [
      `webpack-dev-server/client?${frontendUrl}`,
      'webpack/hot/only-dev-server',
    ],

    devServer: {
      https: false,
      open,
      openPage: '',
      overlay: true,
      compress: true,
      stats: 'errors-only',
      publicPath: '/bundles',
      lazy: false,
      port,
      hot: true,
      historyApiFallback: false,
      inline: false,
      contentBase: outputDir,
      watchContentBase: true,
      proxy: {
        '/**/*': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },

    plugins: [
      new WriteFilePlugin({
        test: /\.((woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?)|(html|ejs)$/,
        useHashIndex: true,
      }),

      new DashboardPlugin(),

      new HotModuleReplacementPlugin({
        // multiStep: true,
        // ADD multiStep BACK WHEN FIXED (https://github.com/webpack/webpack/issues/6693)
      }),
    ],
  });
}
