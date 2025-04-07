"use strict"

export default class Editor {

  instance = undefined
  props = undefined

  constructor(element, props) {
    this.getProp = (name, defaultValue) => props && props[name] !== undefined ? props[name] : defaultValue
  }


}
