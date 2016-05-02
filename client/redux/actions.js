'use strict';

const changeStat = (stat, delta) => {
    return {
        type: 'STAT_CHANGE',
        stat,
        delta
    };
};

const changeMood = (delta) => {
    return {
        type: 'MOOD_CHANGE',
        delta
    };
};

const changeEnergy = (delta) => {
    return {
        type: 'ENERGY_CHANGE',
        delta
    };
};

const changeSatiety = (delta) => {
    return {
        type: 'SATIETY_CHANGE',
        delta
    };
};

const startFeed = () => {
    return {
        type: 'FEED_START'
    };
};

const startSleep = () => {
    return {
        type: 'SLEEP_START'
    };
};

const stopFeed = () => {
    return {
        type: 'FEED_STOP'
    };
};

const stopSleep = () => {
    return {
        type: 'SLEEP_STOP'
    };
};

const setFeedPos = (val) => {
    return {
        type: 'CAN_FEED',
        val
    };
};

const setSleepPosLight = (val) => {
    return {
        type: 'CAN_SLEEP_LIGHT',
        val
    };
};

const setSleepPosTab = (val) => {
    return {
        type: 'CAN_SLEEP_TAB',
        val
    };
};

module.exports = {
    changeStat,
    changeMood,
    changeEnergy,
    changeSatiety,
    startFeed,
    startSleep,
    stopFeed,
    stopSleep,
    setFeedPos,
    setSleepPosLight,
    setSleepPosTab
};
