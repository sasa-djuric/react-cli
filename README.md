![React Cli Header](./assets/logo.svg)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![License](https://img.shields.io/npm/l/express.svg)](https://github.com/sasa-djuric/react-cli/blob/master/LICENSE)

A command-line interface tool for generating react files.

### Visit official documentation website [reactcli.org](https://reactcli.org)

## Motivation

The motivation for creating this project was to reduce the time spent on creating files and boilerplate code and be more productive.

## Getting started

### 1. Install the React CLI

Install React CLI from your command line.

```bash
npm install -g cr-react-cli
```

### 2. Initialize configuration

To setup React CLI by your preferences, run the init command to generate a [config file](https://reactcli.org/docs/config/overview).

```bash
npx react-cli init
```

After the init command is executed, you will be asked questions about your project. After you answer all questions, in case that you choose the project scope for the config file, the react.config.json file will be generated at the root of your project.

### 3. Use it

React CLI can be used with several aliases like: cr-react-cli, react-cli, react, rct.
Run component, context or hook commands to generate boilerplate files.

```bash
npx react component menu
npx react context menu
npx react hook useMenu
```

## License

[MIT](https://github.com/sasa-djuric/react-cli/blob/master/LICENSE)
