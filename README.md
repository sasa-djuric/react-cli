![React Cli Header](./assets/logo.svg)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![License](https://img.shields.io/npm/l/express.svg)](https://github.com/sasa-djuric/react-cli/blob/master/LICENSE)

Create react files with a single command

### Motivation

The motivation for creating this project was to reduce the time spent on creating files and boilerplate code and be more productive.

#### Examples

```sh
npx react component button
```

```sh
npx react c container header
```

```sh
npx react hook useInput
```

### Installation

For NPM

`npm install -g cr-react-cli`

For Yarn

`yarn global add -g cr-react-cli`

## Usage

### <code><strong>react init</strong></code>

Generates a [configuration file](#configuration) based on the prompt.
Configuration can be on global or project scope.

### <code><strong>react component</strong></code>

Arguments

| Argument | Description                                                                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type]   | Type of component defined in the configuration file                                                                                                               |
| \<name>  | Name for the component. If you want to make a sub-component for an existing component, you can input a name like this: existing-component-name/new-component-name |

</br>

Options

| Option                             | Alias              | Description                                                                                                  |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
| --class                            | -c                 | Create a class component                                                                                     |
| --typescript                       | -tp                | Use typescript                                                                                               |
| --style                            | -s                 | Create a style file                                                                                          |
| --story                            | N/A                | Create a [story](https://storybook.js.org/docs/react/get-started/introduction) file                          |
| --proptypes                        | -p                 | Include proptypes                                                                                            |
| --redux                            | -r                 | Include redux                                                                                                |
| --test                             | -t                 | Create a test file                                                                                           |
| --index                            | -i                 | Create an index file with default export                                                                     |
| <nobr>--file-name \<name></nobr>   | -fn                | Specify the file name. If this argument is provided, the [file naming config](#filenaming) will be ignored   |
| <nobr>--path \<destination></nobr> | N/A                | Specify the path for the file relative to the project source path defined in the project configuration entry |
| --no-typescript                    | <nobr>-notp</nobr> | Don't use typescript                                                                                         |
| --no-style                         | -nos               | Don't create a style file                                                                                    |
| --no-story                         | N/A                | Don't create story book file                                                                                 |
| --no-proptypes                     | -nop               | Don't include proptypes                                                                                      |
| --no-redux                         | -nor               | Don't include redux                                                                                          |
| --no-test                          | -not               | Don't create a test file                                                                                     |
| --no-index                         | -noi               | Don't create an index file                                                                                   |

### <code><strong>react hook</strong></code>

Arguments

| Argument | Description   |
| -------- | ------------- |
| \<name>  | Name for hook |

</br>

Options

| Option                             | Alias              | Description                                                                                                  |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
| --typescript                       | -t                 | Use typescript                                                                                               |
| --no-typescript                    | <nobr>-notp</nobr> | Don't use typescript                                                                                         |
| <nobr>--path \<destination></nobr> | N/A                | Specify the path for the file relative to the project source path defined in the project configuration entry |

## Configuration

The configuration file contains the next scopes (fields):

| Scope     | Type                                             |
| --------- | ------------------------------------------------ |
| project   | <code>[ProjectConfig](#projectconfig)</code>     |
| component | <code>[ComponentConfig](#componentconfig)</code> |
| style     | <code>[StyleConfig](#styleconfig)</code>         |
| storybook | <code>[StorybookConfig](#storybook)</code>       |
| test      | <code>[TestConfig](#testconfig)</code>           |
| hook      | <code>[HookConfig](#hookconfig)</code>           |

### <code>ProjectConfig</code>

| Option     | Type                                   | Description                                        |
| ---------- | -------------------------------------- | -------------------------------------------------- |
| path       | <code>string</code>                    | Project source path                                |
| typescript | <code>boolean</code>                   | Uses typescript                                    |
| lint       | <code>boolean</code>                   | Uses eslint if it's used to lint created files     |
| format     | <code>boolean</code>                   | Uses prettier if it's used to format created files |
| fileNaming | <code>[FileNaming](#filenaming)</code> | Define file naming                                 |

### <code>ComponentConfig</code>

| Option     | Type                                                             | Description                                                                                                  |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| class      | <code>boolean</code>                                             | Create a class component                                                                                     |
| style      | <code>boolean</code>                                             | Create a style file                                                                                          |
| story      | <code>boolean</code>                                             | Create a [story](https://storybook.js.org/docs/react/get-started/introduction) file                          |
| proptypes  | <code>boolean</code>                                             | Include proptypes                                                                                            |
| redux      | <code>boolean</code>                                             | Include redux                                                                                                |
| test       | <code>boolean</code>                                             | Create a test file                                                                                           |
| testId     | <code>boolean</code>                                             | Adds data-testid attribute on the element                                                                    |
| index      | <code>boolean</code>                                             | Create an index file                                                                                         |
| open       | <code>boolean</code>                                             | Open file in default editor after creating                                                                   |
| path       | <code>string</code>                                              | Specify the path for the file relative to the project source path defined in the project configuration entry |
| typescript | <code>boolean</code>                                             | Use typescript                                                                                               |
| inFolder   | <code>boolean</code>                                             | Save the file in its own folder                                                                              |
| fileNaming | <code>[FileNaming](#filenaming)</code>                           | Define file naming                                                                                           |
| override   | <code>[ComponentOverrideConfig](#componentconfigoverride)</code> | Override configuration of style, storybook, or test                                                          |

#### <code>ComponentOverrideConfig</code>

| Option    | Type                                       |
| --------- | ------------------------------------------ |
| style     | <code>[StyleConfig](#styleconfig)</code>   |
| storybook | <code>[StorybookConfig](#storybook)</code> |
| test      | <code>[TestConfig](#testconfig)</code>     |

### <code>StyleConfig</code>

| Option     | Type                                                                                                              | Description                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| type       | <code>css</code> \| <code>scss</code> \| <code>sass</code> \| <code>less</code> \| <code>styled-components</code> | Type of styling technology                                                                                   |
| modules    | <code>boolean</code>                                                                                              | Use css modules                                                                                              |
| path       | <code>string</code>                                                                                               | Specify the path for the file relative to the project source path defined in the project configuration entry |
| typescript | <code>boolean</code>                                                                                              | Use typescript (for css in js solutions)                                                                     |
| inFolder   | <code>boolean</code>                                                                                              | Save the file in its own folder                                                                              |
| fileNaming | <code>[FileNaming](#filenaming)</code>                                                                            | Define file naming                                                                                           |

### <code>StorybookConfig</code>

| Option     | Type                                   | Description                                                                                                  |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| path       | <code>string</code>                    | Specify the path for the file relative to the project source path defined in the project configuration entry |
| typescript | <code>boolean</code>                   | Use typescript                                                                                               |
| inFolder   | <code>boolean</code>                   | Save the file in its own folder                                                                              |
| fileNaming | <code>[FileNaming](#filenaming)</code> | Define file naming                                                                                           |

### <code>TestConfig</code>

| Option     | Type                                   | Description                                                                                                  |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| path       | <code>string</code>                    | Specify the path for the file relative to the project source path defined in the project configuration entry |
| typescript | <code>boolean</code>                   | Use typescript                                                                                               |
| inFolder   | <code>boolean</code>                   | Save the file in its own folder                                                                              |
| fileNaming | <code>[FileNaming](#filenaming)</code> | Define file naming                                                                                           |

### <code>HookConfig</code>

| Option     | Type                                   | Description                                                                                                  |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| open       | <code>boolean</code>                   | Open file in default editor after creating                                                                   |
| path       | <code>string</code>                    | Specify the path for the file relative to the project source path defined in the project configuration entry |
| typescript | <code>boolean</code>                   | Use typescript                                                                                               |
| inFolder   | <code>boolean</code>                   | Save the file in its own folder                                                                              |
| fileNaming | <code>[FileNaming](#filenaming)</code> | Define file naming                                                                                           |

</br>

#### <code>FileNaming</code>

| Option         | Type                                                                                  | Description                                                   |
| -------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| name           | <code>string</code>                                                                   | Specify name or naming type                                   |
| postfix        | <code>string</code>                                                                   | Define postfix or [postfix type](#postfix-type) for file name |
| postfixDevider | <code>string</code>                                                                   | Define postfix devider                                        |
| casing         | <code>camel</code> \| <code>pascal</code> \| <code>kebab</code> \| <code>snake</code> | Specify casing type                                           |

#### Name types

#### <code>Component</code>

| Type   | Description             |
| ------ | ----------------------- |
| {name} | Provided component name |

#### <code>Style</code>

| Type   | Description   |
| ------ | ------------- |
| {name} | Provided name |

#### <code>Story</code>

| Type   | Description   |
| ------ | ------------- |
| {name} | Provided name |

#### <code>Test</code>

| Type   | Description   |
| ------ | ------------- |
| {name} | Provided name |

#### Postfix types

#### <code>Component</code>

| Type            | Description             |
| --------------- | ----------------------- |
| {type}          | Value is compnent       |
| {componentType} | Specified type argument |

#### <code>Style</code>

| Type            | Description                       |
| --------------- | --------------------------------- |
| {type}          | Value is style                    |
| {componentType} | Specified component type argument |

### Example

```json
{
    "project": {
        "path": "./src",
        "typescript": true,
        "lint": false,
        "format": false,
        "fileNaming": {
            "casing": "kebab",
            "postfix": "",
            "postfixDevider": "."
        }
    },
    "component": {
        "default": {
            "style": true,
            "story": true,
            "test": true,
            "proptypes": true,
            "index": true,
            "defaultExport": true,
            "inFolder": true,
            "open": true,
            "fileNaming": {
                "casing": "camel"
            },
            "path": "/components",
            "class": false,
            "redux": false,
            "override": {
                "style": {
                    "type": "scss"
                }
            }
        },
        "container": {
            "style": true,
            "story": false,
            "test": true,
            "proptypes": true,
            "index": true,
            "inFolder": true,
            "open": true,
            "path": "/containers"
        }
    },
    "style": {
        "type": "styled-components",
        "modules": false,
        "path": "{componentPath}"
    },
    "storybook": {
        "path": "{componentPath}",
        "fileNaming": {
            "postfix": "story"
        }
    },
    "test": {
        "path": "../test",
        "fileNaming": {
            "postfix": "test"
        }
    },
    "hook": {
        "open": true,
        "path": "/hooks"
    }
}
```

## License

[MIT](https://github.com/sasa-djuric/react-cli/blob/master/LICENSE)
