'use strict'

const fs = require('fs')

const MAX_BRIGHTNESS_FILE =
	'/sys/class/backlight/intel_backlight/max_brightness'
const BRIGHTNESS_FILE =
	'/sys/class/backlight/intel_backlight/brightness'
// './brightness'

const cmd = process.argv[2]
assertCmd(cmd)

if (cmd == 'inc') {
	setBrightness(5)
} else if (cmd == 'dec') {
	setBrightness(-5)
}

function setBrightness(value) {
	const maxBrightness = getMaxBrightness()
	const step = calculateStep(maxBrightness)
	const current = getBrightness()

	let newBrightness = parseInt(current + (step * value), 10)

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
	if (!['inc', 'dec'].includes(cmd)) {
		console.error('Error: Wrong arguments')
		usage()
		process.exit(1)
	}
}

function usage() {
	console.log(`
Usage:
	backlight [COMMAND]

COMMAND:
	inc   Increase bightness by 5%
	dec   Decrease brightness by 5%
`) // eslint-disable-line
}
