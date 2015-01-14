TreeDispatcher = require '../dispatcher/Dispatcher.coffee'
TreePersistence   = require '../persistence/TreePersistence.coffee'

module.exports =
  loadPath: (path,body,kids) ->
    TreeDispatcher.handleServerAction
      type:"path-load"
      path:path
      body:body
      kids:kids

  getPath: (path,cb) ->
    loadPath = @loadPath
    if path.slice(-1) is "/" then path = path.slice(0,-1)
    TreePersistence.get path,(err,res) ->
      loadPath path,res.body,res.kids
      if cb then cb err,res

  setCurr: (path) ->
    TreeDispatcher.handleViewAction
      type:"set-curr"
      path:path