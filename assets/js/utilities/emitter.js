/** @template T */
export default class Emitter {
    /** @type {Listener[]} */ #listeners = [];
    /** @type {T} */ #value;

    /** @param {T} value  */
    constructor(value) {
        this.#value = value;
    }

    /**
     * Subscribes to the first change of the value/object, then automatically unsubscribes
     * 
     * @param {Object} callbacks
     * @param {( (value: T) => void )} callbacks.next
     * @param {( (index: Number, value: any) => void )} callbacks.nextIndexed
     */
    first({next, nextIndexed}) {
        const listener = new Listener(this, {next, nextIndexed}, { getOnce: true });
        this.#listeners.push(listener);
    }

    /**
     * Gets the entire value/object, or a value within an array
     * 
     * @param {(Number|undefined)} arrayIndex 
     * @returns {T}
     */
    getValue(arrayIndex = undefined) {
        if (typeof arrayIndex === 'number') {
            if (!Array.isArray(this.#value))
                throw new Error('Index provided for non-array');

            return this.#value[arrayIndex];
        }

        return this.#value;
    }

    /**
     * Sets the entire value/object, or a value within an array
     * 
     * @param {T} value 
     * @param {(Number|undefined)} arrayIndex 
     */
    setValue(value, arrayIndex = undefined) {
        let isUnchanged = false;

        if (typeof arrayIndex === 'number') {
            if (!Array.isArray(this.#value))
                throw new Error('Index provided for non-array');

            if (this.#value[arrayIndex] === value)
                isUnchanged = true;

            this.#value[arrayIndex] = value;


            for (const listener of this.#listeners) {
                if (isUnchanged && !listener.wantsUnchanged)
                    continue;

                listener.nextIndexed(arrayIndex, this.#value[arrayIndex]);
            }

            return;
        }

        if (this.#value === value)
            isUnchanged = true;

        this.#value = value;

        for (const listener of this.#listeners) {
            if (isUnchanged && !listener.wantsUnchanged)
                continue;

            listener.next(this.#value);
        }
    }

    /**
     * Subscribes to changes of the whole value/object, to values within an array, or both
     * 
     * @param {Object} callbacks
     * @param {((value: T) => void)} callbacks.next
     * @param {((index: Number, value: any) => void)} callbacks.nextIndexed
     * @param {{getCurrent: boolean, getUnchanged: boolean}} options
     * @returns {Listener}
     */
    subscribe({next, nextIndexed} /*{ error, complete }*/, { getCurrent, getUnchanged } = {}) {
        const listener = new Listener(this, { next, nextIndexed }, { getUnchanged });
        this.#listeners.push(listener);

        if (getCurrent)
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
    #wantsOnce = false;
    #wantsUnchanged = false;

    #paused = false;

    get wantsUnchanged() {
        return this.#wantsUnchanged;
    }

    /**
     * @param {Emitter} emitter 
     * @param {Object} callbacks
     * @param {(Function|undefined)} callbacks.next 
     * @param {(Function|undefined)} callbacks.nextIndexed 
     * @param {{getOnce: boolean, getUnchanged: boolean}} options
     */
    constructor(emitter, { next, nextIndexed }, { getOnce, getUnchanged } = {}) {
        this.#emitter = emitter;

        if (getOnce && typeof getOnce === 'boolean')
            this.#wantsOnce = getOnce;

        if (getUnchanged && typeof getUnchanged === 'boolean')
            this.#wantsUnchanged = getUnchanged;

        if (next && typeof next === 'function')
            this.#onNext = next;

        if (nextIndexed && typeof nextIndexed === 'function')
            this.#onNextIndexed = nextIndexed;
    }

    /** @param {T} value  */
    next(value) {
        if (this.#paused)
            return;

        this.#onNext?.call(this, value);
        this.#wantsOnce && this.unsubscribe();
    }

    /**
     * @param {Number} index
     * @param {any} value 
     */
    nextIndexed(index, value) {
        if (this.#paused)
            return;

        this.#onNextIndexed?.call(this, index, value);
        this.#wantsOnce && this.unsubscribe();
    }

    pause() {
        this.#paused = true;
    }

    unpause() {
        this.#paused = false;
    }

    unsubscribe() {
        this.#emitter.unsubscribe(this);
    }
}