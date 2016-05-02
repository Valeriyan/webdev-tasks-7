'use strict';

exports.reducers = (state, action) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case 'STAT_CHANGE':
            if (newState.stats[action.stat] + action.delta > 100) {
                newState.stats[action.stat] = 100;
            } else if (newState.stats[action.stat] + action.delta < 0) {
                newState.stats[action.stat] = 0;
            } else {
                newState.stats[action.stat] += action.delta;
            }
            return newState;
        case 'ENERGY_CHANGE':
            if (newState.stats.energy + action.delta > 100) {
                newState.stats.energy = 100;
            } else {
                newState.stats.energy += action.delta;
            }
            return newState;
        case 'SATIETY_CHANGE':
            if (newState.stats.satiety + action.delta > 100) {
                newState.stats.satiety = 100;
            } else {
                newState.stats.satiety += action.delta;
            }
            return newState;
        case 'MOOD_CHANGE':
            if (newState.stats.mood + action.delta > 100) {
                newState.stats.mood = 100;
            } else {
                newState.stats.mood += action.delta;
            }
            return newState;
        case 'FEED_START':
            newState.isFeeding = true;
            newState.interruptTalking = true;
            return newState;
        case 'SLEEP_START':
            newState.isSleeping = true;
            newState.interruptTalking = true;
            newState.isFeeding = false;
            return newState;
        case 'FEED_STOP':
            newState.isFeeding = false;
            return newState;
        case 'SLEEP_STOP':
            newState.isSleeping = false;
            return newState;
        case 'CAN_FEED':
            newState.canFeed = action.val;
            return newState;
        case 'CAN_SLEEP_LIGHT':
            newState.canSleepLight = action.val;
            return newState;
        case 'CAN_SLEEP_TAB':
            newState.canSleepTab = action.val;
            return newState;
        default: return state;
    }
};
