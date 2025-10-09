export default class Emitter {
    #listeners = [];
    #value;

    constructor(value) {
        this.#value = value;
    }

    getValue() { return this.#value; }

    setValue(value) {
        this.#value = value;

        this.#listeners.forEach(listener => {
            listener.next(this.#value);
        });
    }

    subscribe(next /*{ next, error, complete }*/, getCurrentValue = false) {
        const listener = new Listener(this, next /*{ next, error, complete }*/);
        this.#listeners.push(listener);

        if (getCurrentValue)
            listener.next(this.#value);

        return listener;
    }

    unsubscribe(listener) {
        this.#listeners = this.#listeners.filter(sub => sub !== listener);
    }
}

export class Listener {
    #emitter;
    #onNext;

    constructor(emitter, next /*{ next, error, complete }*/) {
        this.#emitter = emitter;

        if (next && typeof next === 'function')
            this.#onNext = next;
    }

    unsubscribe() {
        this.#emitter.unsubscribe(this);
    }

    next(value) { this.#onNext?.call(this, value); }
}