'use strict'

const fs = require('fs')

const MAX_BRIGHTNESS_FILE =
	'/sys/class/backlight/intel_backlight/max_brightness'
const BRIGHTNESS_FILE =
	'/sys/class/backlight/intel_backlight/brightness'
// './brightness'

const arg = process.argv[2]
const command = assertCmd(arg)

if (command.inc) {
	setBrightness(calculateBrightnessChange(5))
} else if (command.dec) {
	setBrightness(calculateBrightnessChange(-5))
} else {
	setBrightness(
		calculateBrightness(
			parseInt(command.percentage, 10)
		)
	)
}

function calculateBrightness(percentage) {
	const maxBrightness = getMaxBrightness()
	const step = calculateStep(maxBrightness)
	return parseInt(step * percentage, 10)
}

function calculateBrightnessChange(value) {
	const maxBrightness = getMaxBrightness()
	const step = calculateStep(maxBrightness)
	const current = getBrightness()

	let newBrightness = parseInt(current + (step * value), 10)
	return newBrightness
}

function setBrightness(newBrightness) {
	const maxBrightness = getMaxBrightness()

	// Validate value and check bounds
	if (isNaN(newBrightness)) {
		console.error('Error: Calculated brightness value is not a number')
		process.exit(1)
	} else if (newBrightness < 0) {
		newBrightness = 0
	} else if (newBrightness > maxBrightness) {
		newBrightness = maxBrightness
	}

	saveBrightness(newBrightness)
}

function saveBrightness(value) {
	fs.writeFileSync(BRIGHTNESS_FILE, String(value + '\n'), {encoding: 'UTF-8'})
}

function calculateStep(maxBrightness) {
	return maxBrightness / 100
}

function getBrightness() {
	return parseInt(fs.readFileSync(BRIGHTNESS_FILE, {encoding: 'UTF-8'}), 10)
}

function getMaxBrightness() {
	return parseInt(fs.readFileSync(MAX_BRIGHTNESS_FILE, {encoding: 'UTF-8'}), 10)
}

function assertCmd(cmd) {
	let percentage = parseInt(cmd, 10)
	if (isNaN(percentage)) {
		percentage = false
		if (!['inc', 'dec'].includes(cmd)) {
			console.error('Error: Wrong arguments')
			usage()
			process.exit(1)
		}
	} else {
		if (percentage < 0 || percentage > 100) {
			console.error('Error: Brightness value must be between 0 and 100')
			usage()
			process.exit(1)
		}
	}
	return {
		inc: cmd == 'inc',
		dec: cmd == 'dec',
		percentage: percentage
	}
}

function usage() {
	console.log(`
Usage:
	backlight [COMMAND]

COMMAND:
	inc     Increase bightness by 5%
	dec     Decrease brightness by 5%
	0-100   Brightness percentage between 0% and 100%
`) // eslint-disable-line
}
