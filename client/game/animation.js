'use strict';

require('snapsvg');

const ANIMATION_TIME = 2000;
const EYE_CLOSED_RY = 3;
const EYE_OPENED_RY = 185;

let hrun = Snap('svg');
let eye = hrun.select('#eye');
let isClosing = false;
let isOpening = false;
let face = hrun.group(
    hrun.select('#head'),
    hrun.select('#ear'),
    hrun.select('#nose'),
    hrun.select('#mouth'),
    eye
);
let headCy = hrun.select('#head').getBBox().cy;
let headCx = hrun.select('#head').getBBox().cx;

function sleep() {
    if (eye.node.ry.animVal.value === EYE_CLOSED_RY) {
        return;
    }
    if (!isClosing) {
        eye.animate({ry: EYE_CLOSED_RY}, ANIMATION_TIME, () => {
            isClosing = false;
        });
        face.animate({transform: `t800 1300 r-60 ${headCx} ${headCy}`}, ANIMATION_TIME);
        isClosing = true;
    }
}

function awake() {
    if (eye.node.ry.animVal.value === EYE_OPENED_RY) {
        return;
    }
    if (!isOpening) {
        eye.animate({ry: EYE_OPENED_RY}, ANIMATION_TIME, () => {
            isOpening = false;
        });
        face.animate({transform: `t0 0 r0 ${headCx} ${headCy }`}, ANIMATION_TIME);
        isOpening = true;
    }
}

module.exports = {
    awake,
    sleep
};
