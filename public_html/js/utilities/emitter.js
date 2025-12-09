export default class Emitter {
    #listeners = [];
    #value;

    constructor(value) {
        this.#value = value;
    }

    getValue() { return this.#value; }

    /**
     * Sets the entire value/object, or a value within an array
     * 
     * @param {any} value 
     * @param {(Number|undefined)} arrayIndex 
     */
    setValue(value, arrayIndex = undefined) {
        if (typeof arrayIndex === 'number') {
            if (!Array.isArray(this.#value))
                throw new Error('Index provided for non-array');

            if (this.#value[arrayIndex] === value)
                return;

            this.#value[arrayIndex] = value;

            this.#listeners.forEach(listener => {
                listener.nextIndexed(arrayIndex, this.#value[arrayIndex]);
            });

            return;
        }

        if (this.#value === value)
            return;

        this.#value = value;

        this.#listeners.forEach(listener => {
            listener.next(this.#value);
        });
    }

    /**
     * Subscribes to changes of the whole value/object, to values within an array, or both
     * 
     * @param {((value: any) => void|undefined)} next
     * @param {Boolean} getCurrentValue 
     * @param {((index: Number, value: any) => void|undefined)} nextIndexed
     * @returns {Listener}
     */
    subscribe(next = undefined /*{ next, error, complete }*/, getCurrentValue = false, nextIndexed = undefined) {
        const listener = new Listener(this, next, nextIndexed /*{ next, error, complete }*/);
        this.#listeners.push(listener);

        if (getCurrentValue)
            listener.next(this.#value);

        return listener;
    }

    /** @param {Listener} listener */
    unsubscribe(listener) {
        this.#listeners = this.#listeners.filter(sub => sub !== listener);
    }
}

export class Listener {
    #emitter;
    #onNext;
    #onNextIndexed;

    /**
     * @param {Emitter} emitter 
     * @param {(Function|undefined)} next 
     * @param {(Function|undefined)} nextIndexed 
     */
    constructor(emitter, next = undefined, nextIndexed = undefined /*{ next, error, complete }*/) {
        this.#emitter = emitter;

        if (next && typeof next === 'function')
            this.#onNext = next;

        if (nextIndexed && typeof nextIndexed === 'function')
            this.#onNextIndexed = nextIndexed;
    }

    unsubscribe() {
        this.#emitter.unsubscribe(this);
    }

    /** @param {any} value  */
    next(value) { this.#onNext?.call(this, value); }

    /**
     * @param {Number} index
     * @param {any} value 
     */
    nextIndexed(index, value) { this.#onNextIndexed?.call(this, index, value); }
}