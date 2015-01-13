Dispatcher = require('flux').Dispatcher
copyProperties = require 'react/lib/copyProperties'

module.exports = copyProperties new Dispatcher(), {
  handleServerAction: (action) ->
    @dispatch
      source: 'server'
      action: action

  handleViewAction: (action) ->
    @dispatch
      source: 'view'
      action: action
}