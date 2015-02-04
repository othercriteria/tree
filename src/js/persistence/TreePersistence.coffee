TreeActions = require '../actions/TreeActions.coffee'

module.exports =
  get: (path,kids,cb) ->
    url = "/gen/main/tree/"+path+".json"
    if kids then url += "?kids"
    $.get url, {}, (data) -> if cb then cb null,data