'use strict';

const SOUNDS_COUNT = 3;
const SOUNDS_FORMATS = ['mp3', 'ogg'];

require('./main.css');

require('file?name=s0.mp3!./sounds/s0.mp3');
require('file?name=s1.mp3!./sounds/s1.mp3');
require('file?name=s2.mp3!./sounds/s2.mp3');
require('file?name=s0.ogg!./sounds/s0.ogg');
require('file?name=s1.ogg!./sounds/s1.ogg');
require('file?name=s2.ogg!./sounds/s2.ogg');

require('../../../client/game/game.js');

