'use strict';

import {createStore} from 'redux';
import {reducers} from '../redux/reducers.js';

const actions = require('../redux/actions.js');
const Sl = require('./saveLoad.js');
const InitialStats = require('./stats.js');
const animation = require('./animation.js');
const STAT_INCREMENT = 10;
const STAT_DECREMENT = -3;

let store;
const recognizer = getRecognizer();
let statChangerId;
let soundPlayerId;

init(false);

function getRecognizer() {
    const SpeechRecognition = window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        return undefined;
    }
    return new SpeechRecognition();
}

function init(isNew) {
    addElementsEvents();
    setStore(isNew);
    setFeedingByBattery();
    setSleepingByLight();
    setSleepingByTab();
    subscribeStore();
    changeStats();
    soundPlayer();
}


function addElementsEvents() {
    document.querySelector('svg').addEventListener('click', talk);
    document.querySelector('.new-game').addEventListener('click', newGame);
    document.querySelector('.feed').addEventListener('click', () => {
        const state = store.getState();

        if (state.stats.satiety < 100 && !state.isSleeping) {
            store.dispatch(actions.changeStat('satiety', STAT_INCREMENT));
        }
    });
}

function talk() {
    const state = store.getState();

    if (!recognizer || state.isFeeding || state.isSleeping) {
        return;
    }
    state.interruptTalking = false;
    recognizer.lang = 'en-US';
    recognizer.continuous = true;
    recognizer.onresult = (e) => {
        const index = e.resultIndex;
        const result = e.results[index][0].transcript.trim();
        const log = document.querySelector('.speech-log');

        log.innerHTML = result;
        if (state.stats.mood < 100) {
            store.dispatch(actions.changeStat('mood', STAT_INCREMENT));
        }

        if (result.toLowerCase() === 'stop') {
            recognizer.stop();
        }
    };
    recognizer.start();
}

function newGame() {
    if (statChangerId) {
        clearInterval(statChangerId);
    }
    if (soundPlayerId) {
        clearInterval(soundPlayerId);
    }
    init(true);
}

function setStore(isNew) {
    const saveLoad = new Sl();
    const save = saveLoad.load();

    if (save && !isNew) {
        store = createStore(reducers, save);
    }
    if (!save || isNew) {
        const state = {
            interruptTalking: false,
            isFeeding: false,
            isSleeping: false,
            canFeed: false,
            canSleepTab: false,
            canSleepLight: false,
            stats: {}
        };
        Object.assign(state.stats, new InitialStats());
        store = createStore(reducers, state);
    }
    saveLoad.setStore(store);
}

function setFeedingByBattery() {
    if (!navigator.getBattery) {
        return;
    }
    navigator
        .getBattery()
        .then((battery) => {
            battery.onchargingchange = onUpdateCharging;
            store.dispatch(actions.setFeedPos(battery.charging));
        });
}

function onUpdateCharging() {
    store.dispatch(actions.setFeedPos(this.charging));
    if (this.charging) {
        store.dispatch(actions.startFeed());
    } else {
        store.dispatch(actions.stopFeed());
    }
}

function setSleepingByLight() {
    if ('ondevicelight' in window) {
        window.ondevicelight = (event) => {
            store.dispatch(actions.setSleepPosLight(event.value >= 40));
            if (event.value >= 40) {
                store.dispatch(actions.stopSleep());
            } else {
                store.dispatch(actions.startSleep());
            }
        };
    }
    return false;
}

function setSleepingByTab() {
    let hidden = null;
    let visibilityState = null;
    let visibilityChange = null;

    if ('hidden' in document) {
        hidden = 'hidden';
        visibilityState = 'visibilityState';
        visibilityChange = 'visibilitychange';
    } else if ('mozHidden' in document) {
        hidden = 'mozHidden';
        visibilityState = 'mozVisibilityState';
        visibilityChange = 'mozvisibilitychange';
    } else if ('webkitHidden' in document) {
        hidden = 'webkitHidden';
        visibilityState = 'webkitVisibilityState';
        visibilityChange = 'webkitvisibilitychange';
    } else {
        return;
    }
    document.addEventListener(visibilityChange, () => {
        store.dispatch(actions.setSleepPosTab(document[hidden]));
        if (document[hidden]) {
            store.dispatch(actions.startSleep());
        } else {
            store.dispatch(actions.stopSleep());
        }
    });
}

function subscribeStore() {
    store.subscribe(checkDeath);
    store.subscribe(render);
    store.subscribe(checkStats);
    store.subscribe(checkSleepPossibility);
    store.subscribe(checkFeedPossibility);
    store.subscribe(checkTalkInterruption);
    store.subscribe(animate);
}

function checkDeath() {
    let emptyStatsCount = 0;
    const stats = store.getState().stats;

    Object.keys(stats).forEach((key) => {
        if (stats[key] === 0) {
            emptyStatsCount++;
        }
    });
    if (emptyStatsCount >= 2) {
        die();
    }
}

function die() {
    clearInterval(statChangerId);
    clearInterval(soundPlayerId);
    store = undefined;
}

function render() {
    let stats;

    if (store) {
        stats = store.getState().stats;
    } else {
        stats = undefined;
    }
    document.querySelector('.energy').innerHTML = stats ? stats.energy : 'DEAD';
    document.querySelector('.satiety').innerHTML = stats ? stats.satiety : 'DEAD';
    document.querySelector('.mood').innerHTML = stats ? stats.mood : 'DEAD';

}

function checkStats() {
    const state = store.getState();
    const stats = state.stats;

    if (stats.energy === 100 && state.isSleeping) {
        store.dispatch(actions.stopSleep());
    }
    if (stats.satiety === 100 && state.isFeeding) {
        store.dispatch(actions.stopFeed());
    }
}

function checkSleepPossibility() {
    const state = store.getState();

    if (state.stats.energy === 100) {
        return;
    }
    if (!state.isSleeping && (state.canSleepLight || state.canSleepTab)) {
        store.dispatch(actions.startSleep());
    }
}

function checkFeedPossibility() {
    const state = store.getState();

    if (!navigator.getBattery || state.isSleeping || state.stats.satiety === 100) {
        return;
    }
    if (state.canFeed && !state.isFeeding) {
        store.dispatch(actions.startFeed());
    }
}

function checkTalkInterruption() {
    const state = store.getState();

    if (state.interruptTalking && recognizer) {
        recognizer.stop();
    }
}

function animate() {
    const state = store.getState();

    if (state.isSleeping) {
        animation.sleep();
    } else {
        animation.awake();
    }
}

function changeStats() {
    statChangerId = setInterval(() => {
        const state = store.getState();
        const stats = state.stats;

        if (state.isFeeding) {
            store.dispatch(actions.changeStat('satiety', STAT_INCREMENT));
        } else if (stats.satiety > 0) {
            store.dispatch(actions.changeStat('satiety', STAT_DECREMENT));
        }
        if (state.isSleeping) {
            store.dispatch(actions.changeStat('energy', STAT_INCREMENT));
        } else if (stats.energy > 0) {
            store.dispatch(actions.changeStat('energy', STAT_DECREMENT));
        }
        if (stats.mood > 0) {
            store.dispatch(actions.changeStat('mood', STAT_DECREMENT));
        }
    }, 2000);
}

function soundPlayer() {
    soundPlayerId = setInterval(() => {
        const timeout = Math.random() * 8000 + 1000;

        setTimeout(playSound, timeout);
    }, 10000);
}

function playSound() {
    const number = Math.floor(Math.random() * 2);
    const sound = document.querySelector(`.sound-${number}`);

    sound.volume = document.querySelector('.volume').value;
    sound.play();
}
