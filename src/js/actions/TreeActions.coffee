TreeDispatcher    = require '../dispatcher/Dispatcher.coffee'
TreePersistence   = require '../persistence/TreePersistence.coffee'

module.exports =
  loadPath: (path,body,kids) ->
    TreeDispatcher.handleViewAction
      type:"set-load"
      load:false
    TreeDispatcher.handleServerAction
      type:"path-load"
      path:path
      body:body
      kids:kids

  getPath: (path,cb) ->                                          # (path,[kids,]cb)
    kids = false
    if typeof(cb) is 'boolean'
      kids = arguments[1]
      cb = arguments[2]
    TreeDispatcher.handleViewAction
      type:"set-load"
      load:true
    loadPath = @loadPath
    if path.slice(-1) is "/" then path = path.slice(0,-1)
    if path[0] is "/" then path = path.slice(1)
    TreePersistence.get path,kids,(err,res) ->
      loadPath path,res.body,res.kids
      if cb then cb err,res

  setCurr: (path) ->
    TreeDispatcher.handleViewAction
      type:"set-curr"
      path:path