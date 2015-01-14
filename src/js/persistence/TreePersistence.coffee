TreeActions = require '../actions/TreeActions.coffee'

module.exports =
  get: (path,cb) ->
    $.get "/gen/main/tree/"+path+".json", {}, (data) -> if cb then cb null,data