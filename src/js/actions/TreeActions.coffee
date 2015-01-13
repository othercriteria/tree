TreeDispatcher = require '../dispatcher/Dispatcher.coffee'

module.exports =
  loadPath: (path,body,kids) ->
    TreeDispatcher.handleServerAction
      type:"path-load"
      path:path
      body:body
      kids:kids