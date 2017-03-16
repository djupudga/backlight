# Backlight

## About
A small cli for increasing/decreasing screen backlight. Works with
`intel_backlight`. You may need to modify the file locations for this
script to work on your computer.

The increments are 5% so it is best used by mapping screen brightness keys
to individual commands.

## Installation
You can either install directly from github or using npm/yarn. It is probably
easiest to become root and install for all users.

### Clone and install
Clone this repo and  install using `yarn` or `npm`.

```
sudo su
git clone https://github.com/djupudga/backlight.git
cd backlight
npm install
```

### NPM install method
```
sudo su
npm install -g https://github.com/djupudga/backlight.git
```

## Usage
The application requires root privileges so you must run it with sudo. For sudo
to work, nodejs must be installed for all users (or at least for root).
```
# Usage
backlight

# Increase backlight 5%
sudo backlight inc

# Decrease backlight 5%
sudo backlight dec
```
To skip sudo password prompt, modify the sudoers file accordingly.
