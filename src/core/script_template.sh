#!/usr/bin/env bash

# ==============================================================================
# Velour Fedora Setup Script
# https://github.com/TabulateJarl8/velour
# Copyright (C) 2026  Connor Sample
#
# Acknowledgments & Credits:
# A significant portion of the preamble and initial setup logic in this script
# was adapted from "Fedora Things to Do" by Karl Danisz.
#
# Copyright (C) 2024-2025  Karl Danisz
# Copyright (C) 2024-2025  The "Fedora Things to Do" Contributors
#
# The contributors to "Fedora Things to Do" retain copyright over their
# respective contributions to the adapted code.
#
# Original Project: https://github.com/k-mktr/fedora-things-to-do
# Referenced commit hash: 8b904424a2b49807ba5dc46492a078c321312c00
#
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
# ==============================================================================

# Check if the script is run with sudo
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script with sudo"
    exit 1
fi

# bash options:
#   - exit on error
#   - error on unset variable
#   - report pipe errors
set -euo pipefail

# Funtion to echo colored text
color_echo() {
    local color="$1"
    local text="$2"
    case "$color" in
        "red")     echo -e "\033[0;31m$text\033[0m" ;;
        "green")   echo -e "\033[0;32m$text\033[0m" ;;
        "yellow")  echo -e "\033[1;33m$text\033[0m" ;;
        "blue")    echo -e "\033[0;34m$text\033[0m" ;;
        "purple")  echo -e "\033[0;35m$text\033[0m" ;;
        "cyan")    echo -e "\033[0;36m$text\033[0m" ;;
        *)         echo "$text" ;;
    esac
}

# Set variables
ACTUAL_USER=$SUDO_USER
ACTUAL_HOME=$(eval echo ~"$SUDO_USER")
LOG_FILE="/var/log/fedora_things_to_do.log"
INITIAL_DIR=$(pwd)
VELOUR_VERSION="__VELOUR_VERSION__"

# make shellcheck stop complaining about unused variables
export ACTUAL_USER
export ACTUAL_HOME

# Function to generate timestamps
get_timestamp() {
    date +"%Y-%m-%d %H:%M:%S"
}

# Function to log messages
log_message() {
    local message="$1"
    echo "$(get_timestamp) - $message" | tee -a "$LOG_FILE"
}

# Function to handle errors
handle_error() {
    local exit_code=$?
    local message="$1"
    if [ $exit_code -ne 0 ]; then
        color_echo "red" "ERROR: $message"
        exit $exit_code
    fi
}

# Function to prompt for reboot
prompt_reboot() {
    read -r -p "It is time to reboot the machine. Would you like to do it now? (y/n): " choice
    if [[ $choice == [yY] ]]; then
        color_echo "green" "Rebooting..."
        reboot
    else
        color_echo "red" "Reboot canceled."
    fi
}

# Function to backup configuration files
backup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        cp "$file" "$file.bak"
        handle_error "Failed to backup $file"
        color_echo "green" "Backed up $file"
    fi
}

clear
# banner generated from the Pagga figlet font (this is exactly 80 chars wide)
echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║   ░░░░░░░░░░░░░░░░░░░░░░░█░█░█▀▀░█░░░█▀█░█░█░█▀▄░░░░░░░░░░░░░░░░░░░░░░░░░░   ║"
echo "║   ░░░░░░░░░░░░░░░░░░░░░░░▀▄▀░█▀▀░█░░░█░█░█░█░█▀▄░░▀░░░░░░░░░░░░░░░░░░░░░░░   ║"
echo "║   ░░░░░░░░░░░░░░░░░░░░░░░░▀░░▀▀▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░░▀░░░░░░░░░░░░░░░░░░░░░░░   ║"
echo "║   ░█▀▀░█▀▀░█▀▄░█▀█░█▀▄░█▀█░░░█▀▀░█▀▀░▀█▀░█░█░█▀█░░░█▀▀░█▀▀░█▀▄░▀█▀░█▀█░▀█▀   ║"
echo "║   ░█▀▀░█▀▀░█░█░█░█░█▀▄░█▀█░░░▀▀█░█▀▀░░█░░█░█░█▀▀░░░▀▀█░█░░░█▀▄░░█░░█▀▀░░█░   ║"
echo "║   ░▀░░░▀▀▀░▀▀░░▀▀▀░▀░▀░▀░▀░░░▀▀▀░▀▀▀░░▀░░▀▀▀░▀░░░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░░░░▀░   ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Generated with Velour version $VELOUR_VERSION"
echo "This script automates setup steps after a fresh Fedora installation"
color_echo "blue" "https://github.com/TabulateJarl8/velour"
echo ""
color_echo "yellow" "Don't run this script if you didn't build it yourself or don't know what it does."
echo ""
read -r -p "Press Enter to continue or CTRL+C to cancel..."

color_echo "blue" "Disabling PackageKit temporarily to prevent RPM lock collisions..."
systemctl stop packagekit || true
systemctl mask packagekit || true

color_echo "blue" "Performing system upgrade... This may take a while..."
dnf upgrade -y

# {{script_body}}

# Before finishing, cd back to the directory where this script was called
cd "$INITIAL_DIR"

systemctl unmask packagekit || true

# Finish
echo "";
echo "╔═════════════════════════════════════════════════════════════════════════╗";
echo "║                                                                         ║";
echo "║   ░█░█░█▀▀░█░░░█▀▀░█▀█░█▄█░█▀▀░░░▀█▀░█▀█░░░█▀▀░█▀▀░█▀▄░█▀█░█▀▄░█▀█░█░   ║";
echo "║   ░█▄█░█▀▀░█░░░█░░░█░█░█░█░█▀▀░░░░█░░█░█░░░█▀▀░█▀▀░█░█░█░█░█▀▄░█▀█░▀░   ║";
echo "║   ░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀▀▀░░░░▀░░▀▀▀░░░▀░░░▀▀▀░▀▀░░▀▀▀░▀░▀░▀░▀░▀░   ║";
echo "║                                                                         ║";
echo "╚═════════════════════════════════════════════════════════════════════════╝";
echo "";
color_echo "green" "All steps completed. Enjoy!"

# Prompt for reboot
prompt_reboot
