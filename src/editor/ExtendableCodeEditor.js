"use strict"

import EventChannel from "../event/EventChannel"
import MonacoEditor from "./MonacoEditor"

export default class ExtendableCodeEditor {

  editor = undefined
  props = undefined
  eventChannel = new EventChannel()

  constructor(element, props) {
    this.editor = new MonacoEditor(element, props)
    this.props = props
  }

  static loadThemes = (fn) => fn().then(themes => MonacoEditor.loadThemes(themes))
  static changeTheme = (theme) => MonacoEditor.changeTheme(theme)
  static colorizeElement = (...args) => MonacoEditor.colorizeElement(...args)

  features = {

    _methods: ['_methods', 'add', 'remove', 'list'],

    add: (name, feature) => {
      if (this.features._methods[name]) {
        throw new Error(`The name '${name}' is reserved. Please use another feature name`)
      }
      if (this.features[name]) {
        throw new Error(`The name '${name}' is already used. Please choose another feature name`)
      }
      this.features[name] = feature
      feature.inject(this.editor, this.eventChannel)
      return feature
    },

    remove: (name) => {
      if (this.features[name]) {
        this.features[name].deactivate(name)
        delete this.features[name]
      }
    },

    list: () => {
      return Object.keys(this.features).filter(name => this.features._methods.indexOf(name) === -1)
    },

  }

}
