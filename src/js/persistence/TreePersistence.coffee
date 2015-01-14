TreeActions = require '../actions/TreeActions.coffee'

module.exports =
  get: (path,cb) ->
    $.get "/gen/main/tree/"+path, {}, (data) ->
      TreeActions.loadPath path.replace(".json", ""),data.body,data.kids
      if cb then cb null,data