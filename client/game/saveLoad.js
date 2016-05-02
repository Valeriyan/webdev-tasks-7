'use strict';

module.exports = class SaveLoad {
    constructor() {
        window.addEventListener('unload', (event) => {
            this.save();
        });
    }
    setStore(store) {
        this.store = store;
    }
    save() {
        const state = JSON.stringify(this.store.getState());
        document.cookie = `state=${state};expires=${60 * 60 * 24 * 7 * 48}`;
    }
    load() {
        if (!document.cookie) {
            return undefined;
        }
        const cookie = document.cookie.split('=');

        return JSON.parse(cookie[1]);
    }
};
