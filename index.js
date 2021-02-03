const initTray = require('./tray');

const DEFAULT_COLS = 9;
const DEFAULT_ROWS = 6;

const start = () => {

    initTray(DEFAULT_COLS, DEFAULT_ROWS);
}

start();
