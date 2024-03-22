# Crowdbotics CLI

The Crowdbotics CLI is a powerful command-line tool designed to streamline the management of your Crowdbotics applications. It provides a suite of commands to help developers efficiently create, manage, and deploy React Native and Django modules and applications.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Available Commands](#available-commands)
- [Support](#support)
- [License](#license)
- [About Crowdbotics](#about-crowdbotics)

## Installation

To install the Crowdbotics CLI, you need to have Node.js (version 18.0 or higher) installed on your system. You can then install the CLI globally using npm:

```bash
npm install -g crowdbotics
```

## Setting up your Dev Environment

The following must be available in your system:

- [node](https://nodejs.org/en)
- [yarn](https://yarnpkg.com/)
- [python](https://www.python.org/)
- [pipenv](https://pypi.org/project/pipenv/)
- [urllib3](https://urllib3.readthedocs.io/en/stable/) without this the project will not run in ```macOS``` environments

Node `v18.18.0` (LTS) recommended.

Please see the [Crowdbotics documentation](https://docs.crowdbotics.com/docs/set-up-your-dev-env) for detailed instructions on how to setup your environment.


## Usage

After installation, you can run the CLI from anywhere on your system using the `cb` command. The CLI provides a range of commands to manage your Crowdbotics application.

### Available Commands

- `cb parse`: Parse and validate your modules.
- `cb demo`: Generate a local React Native and Django demo app.
- `cb add`: Install a module in the demo app.
- `cb remove`: Remove a module from the demo app.
- `cb create`: Create a new module of a given type.
- `cb commit`: Update an existing module from the demo source code.
- `cb init`: Initialize a blank modules repository.
- `cb upgrade`: Upgrade your existing app's scaffold to the latest version.
- `cb help`: Show the help page with available commands.
- `cb login`: Login to your Crowdbotics account (Requires 2FA authentication).
- `cb logout`: Logout of your Crowdbotics account.
- `cb publish`: Publish your modules to your organization's private catalog.
- `cb modules`: Manage modules for your organization.

For detailed information about each command and its options, run:

```bash
cb help
```

## Support

For support using the Crowdbotics CLI or to report bugs, please visit the [Crowdbotics Support page](https://app.crowdbotics.com/dashboard/user/support).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About Crowdbotics

Crowdbotics provides a platform to build web and mobile applications with the ease of visual development tools and the power of traditional code. For more information, visit [crowdbotics.com](https://www.crowdbotics.com).
```