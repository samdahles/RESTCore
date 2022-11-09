const { Engine } = require('./Engine');

Object.prototype.hide = function(...hiddenKeys) {
    let newObject = JSON.parse(JSON.stringify(this));
    hiddenKeys.forEach(key => {
        delete newObject[key];
    });
    return newObject;
}

const engine = new Engine();