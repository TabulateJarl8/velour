# Velour

Velour is a web-based utility which generates customized, post-installation setup scripts for Fedora Linux. It provides a large selection of system tweaks/improvements, application installations, and other various configurations. The generated scripts are designed to be spin-agnostic and safe in cases where it's not applicable to your chosen Fedora distribution.

## Why does this exist?

<!-- TODO: why (frontend only, other codebase very type-unsafe/hard to maintain, other not freq. updated/deployed, relied on 3rd party hosting service to exist, etc) -->

## Acknowledgements

This project was highly inspired by and somewhat derived (at least in the initial release) from [k-mktr/fedora-things-to-do](https://github.com/k-mktr/fedora-things-to-do). Thank you to the creator and contributors of that project for the configuration snippets that I adapted to be used in my plugins.

## Disclaimer & Caution

Velour generates shell scripts that run as the root user and can make permanent, breaking system changes. While scripts are designed to be safe and spin-agnostic, they still run as the root user, can modify system configuration files, remove/install packages, enable/disable services, or anything else you can imagine might be able to break the system. While I try to test against unsafe/invalid scripts, nothing is perfect. **You are responsible for reviewing the generated script before running it**. Always read the script before executing it to understand what it is changing.

> Provided under the GNU General Public License v3.0. This program comes with ABSOLUTELY NO WARRANTY. See <https://www.gnu.org/licenses/gpl-3.0.html> for details.

<!-- TODO: only meant to target non-atomic desktop spins -->

<!-- TODO: tech stack? -->

<!-- TODO:
    - features section?
    - getting started with contributing?
    - disclaimer/caution?
 -->
