TreeActions = require '../actions/TreeActions.coffee'

module.exports =
  get: (path) ->
    $.get path, {}, (data) ->
      try
        data = JSON.parse data
      catch e
        data = {body:"parsing error",kids:[]}
      TreeActions.loadPath path,data.body,data.kids