"use strict"

export default class EventChannel {

  #handlers = {}
  #hooks = {}

  addListener = (eventName, eventHandler) => {
    if (!this.#handlers[eventName]) {
      this.#handlers[eventName] = []
    }
    this.#handlers[eventName].push(eventHandler)
  }

  removeListener = (eventName, eventHandler) => {
    if (this.#handlers[eventName]) {
      const handlerIndex = this.#handlers[eventName].findIndex(h => h === eventHandler);
      (handlerIndex !== -1) && this.#handlers[eventName].splice(handlerIndex, 1);
    }
  }

  removeAllListeners = (eventName) => {
    if (eventName === undefined) {
      this.#handlers = {}
    } else if (this.#handlers[eventName]) {
      delete this.#handlers[eventName]
    }
  }

  hookListener = (eventName, hook) => {
    if (!this.#hooks[eventName]) {
      this.#hooks[eventName] = []
    }
    this.#hooks[eventName].push(hook)
  }

  removeHookListener = (eventName, hook) => {
    if (this.#hooks[eventName]) {
      const hookIndex = this.#hooks[eventName].findIndex(h => h === hook);
      (hookIndex !== -1) && this.#hooks[eventName].splice(hookIndex, 1);
    }
  }

  emit = (eventName, ...args) => {
    if (this.#handlers[eventName]) {
      let _args = args
      if (this.#hooks[eventName]) {
        for (let hook of this.#hooks[eventName]) {
          _args = hook(..._args)
        }
      }
      for (let handler of this.#handlers[eventName]) {
        handler(..._args)
      }
    }
  }

}