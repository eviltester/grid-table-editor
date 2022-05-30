class Debouncer{

    constructor() {
        this.debounces = new Map();
    }

    debounce(name, callback, aftermillis){
        clearTimeout(this.debounces.get(name));
        this.debounces.set(name, setTimeout(callback, aftermillis));
    }

    clear(name){
        clearTimeout(this.debounces.get(name));
        this.debounces.delete(name);
    }
}

export {Debouncer};