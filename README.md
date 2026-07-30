<div align="center">
  <img src="icons/icon.svg" width="100" />
  
  <h1>Velour</h1>

  <p align="center">

[![GitHub Release](https://img.shields.io/github/v/release/TabulateJarl8/velour)](https://github.com/TabulateJarl8/velour/releases/latest) ![Project License](https://img.shields.io/github/license/TabulateJarl8/velour) [![GitHub Sponsors](https://img.shields.io/badge/Sponsor-%40TabulateJarl8-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/TabulateJarl8)

  </p>
</div>

## Overview

Velour is a web-based utility which generates customized, post-installation setup scripts for Fedora Linux. It provides a large selection of system tweaks/improvements, application installations, and other various configurations. The generated scripts are designed to be spin-agnostic and safe in cases where it's not applicable to your chosen Fedora distribution.

**Note**: Velour is currently designed to target non-atomic desktop spins of Fedora.

<h3 align="center">Try it now: <a href="https://velour.tabulate.tech">Launch Velour</a></h3>

## Features

- **Live Preview**: features a live, syntax-highlighted preview of the generated script using Shiki, allowing the user to review the generated code before downloading or sharing.

- **Plugin Search**: a global plugin/option search is available, allowing for the user to quickly locate what they're looking for.

- **Dependency Resolution**: features plugin dependency resolution with cycle detection via BFS, allowing plugins to include other plugins without having to worry about duplicates or ordering in the generated script.

- **Reproducable Configs**: Velour configs can be easily shared with others by using the "Copy Permalink" feature. You can also upload a previously generated script to restore the options that were used to generate that script.

- **Unit Testing**: Most (and hopefully soon enough, all) files in the project are fully unit tested with 100% coverage.
  - **Bash Validation**: I've written a custom "fuzzer" unit test suite that checks a wide subspace of config option permutations and runs the generated bash through `shellcheck`, reducing the chance that any user input or combination of options can produce invalid bash scripts.

- **Input Validation**: plugins can take advantage of the robust input validation system, where the UI will prevent the download of any script that doesn't match a plugin's input validation schema, providing the user with a tasteful error message explaining the problem.

## Motivation

Velour is built to be a serverless, strongly-typed, and robust alternative to an existing Fedora setup script generator. By switching to a fully frontend (with TypeScript) model, Velour is able to provide a smoother experience that is easier to maintain, all while not relying on third-party server dependencies and being heavily tested and validated. Learn more on the [Architecture & Motivation Wiki Page](https://github.com/TabulateJarl8/velour/wiki/Architecture-&-Motivation).

<!-- TODO: tech stack? -->

<!-- TODO: contributing -->

## Acknowledgements

This project was highly inspired by and somewhat derived (at least in the initial release) from [k-mktr/fedora-things-to-do](https://github.com/k-mktr/fedora-things-to-do). Thank you to the creator and contributors of that project for the configuration snippets that I adapted to be used in my plugins.

## Disclaimer & Caution

Velour generates shell scripts that run as the root user and can make permanent, breaking system changes. While scripts are designed to be safe and spin-agnostic, they still run as the root user, can modify system configuration files, remove/install packages, enable/disable services, or anything else you can imagine might be able to break the system. While I try to test against unsafe/invalid scripts, nothing is perfect. **You are responsible for reviewing the generated script before running it**. Always read the script before executing it to understand what it is changing.

> Provided under the GNU General Public License v3.0. This program comes with ABSOLUTELY NO WARRANTY. See <https://www.gnu.org/licenses/gpl-3.0.html> for details.
