"use strict"

export default class Feature {

  editorInstance = undefined
  editorProps = undefined
  eventChannel = undefined

  activate = () => {}
  deactivate = () => {}
  createEventChannel = (channelName) => this.event = this.eventManager.addChannel(channelName)

  inject = (editorInstance, eventChannel) => {
    this.editor= editorInstance
    this.eventChannel = eventChannel
    this.activate()
  }

}