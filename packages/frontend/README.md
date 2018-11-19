# Tom's Shuttle Service - Frontend

[![Dependency Status](https://img.shields.io/david/vikr01/toms-shuttles.svg?label=dependencies&path=packages/frontend)](https://david-dm.org/vikr01/toms-shuttles?path=packages/frontends)
[![DevDependency Status](https://img.shields.io/david/dev/vikr01/toms-shuttles.svg?label=devDependencies&path=packages/frontend)](https://david-dm.org/vikr01/toms-shuttles?path=packages/frontend&type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/vikr01/toms-shuttles/badge.svg?targetFile=packages/frontend/package.json)](https://snyk.io/test/github/vikr01/toms-shuttles?targetFile=packages/frontend/package.json)

## Getting Started

Make sure your current working directory is this folder.

If you're in [the root of the project](../..), the command would be:

```bash
cd packages/frontend
```

Alternatively, you can use `yarn workspace toms-shuttles-frontend <command>` instead of `yarn <command>` for any command documented below.

## Run in Development Mode

First, you'll need to make sure the `backend` is running so that API calls can be proxied to it. See [the backend's instructions for how to start its server](../backend).

To start the development server, run:

```bash
yarn dev
```

### Choosing a specific port

To specify a port, set an environment variable `PORT` first:

```bash
export PORT=4000
```

In this case, the server will be launched on [port 4000](http://localhost:3000).

Alternatively, you can set your `PORT` environment variable in the `.env` file generated from [`.env.example`](./.env.example) after installation.

```bash
# .env file
PORT=4000
```

## Create Production Build

Build the package by running:

```bash
yarn build
```

You can then use the path to the production files as the public directory (or copy them over).

For use with express:

```javascript
import assets from 'toms-shuttles-frontend';
import express from 'express';

const app = express();
// set express routes here
app.use(express.static(assets));
```
