EventEmitter = require('events').EventEmitter

MessageDispatcher = require '../dispatcher/Dispatcher.coffee'

_tree = {}
_cont = {}
_curr = ""

TreeStore = _.extend EventEmitter.prototype, {
  addChangeListener: (cb) -> @on 'change', cb

  removeChangeListener: (cb) -> @removeListener "change", cb

  emitChange: -> @emit 'change'

  pathToArr: (_path) ->
    _path = _path.split "/"
    _path.shift()
    _path

  pathToObj:(_path,_obj,kids) ->
    _path = @pathToArr _path
    for i in [0.._path.length-1]
      _obj = _obj[_path[i]] = {}
    if kids
      for i in [0..kids.length-1]
        _obj[kids[i]] = {}

  getTree: (_path) ->
    _path = @pathToArr _path
    for i in [0.._path.length-1]
      tree = _tree[_path[i]]
    tree

  loadPath: (path,body,kids) ->
    _curr = path

    _cont[path] = body

    _obj = {}
    @pathToObj path,_obj,kids
    _.merge _tree,_obj

  getSiblings: ->
    curr = _curr.split("/")
    curr.pop()
    if curr.length isnt 0
      @getTree curr.join("/")
    else
      {}

  getPrev: -> 
    sibs = _.keys @getSiblings()
    if sibs.length < 2
      null
    else
      par = _curr.split "/"
      key = par.pop()
      ind = sibs.indexOf key
      win = if ind-1 > 0 then sibs[ind-1] else sibs[sibs.length-1]
      par.push win
      par.join "/"

  getNext: -> 
    sibs = _.keys @getSiblings()
    if sibs.length < 2
      null
    else
      par = _curr.split "/"
      key = par.pop()
      ind = sibs.indexOf key
      win = if ind+1 < sibs.length then sibs[ind+1] else sibs[0]
      par.push win
      par.join "/"

  getPare: -> 
    _path = @pathToArr _curr
    if _path.length > 1
      _path.pop()
      "/"+_path.join "/"
    else
      null

  getCrumbs: -> ['a','b','c']

  getBody: -> if _cont[_curr] then _cont[_curr] else ""
}

TreeStore.dispatchToken = MessageDispatcher.register (payload) ->
  action = payload.action

  switch action.type
    when 'path-load'
      TreeStore.loadPath action.path,action.body,action.kids
      TreeStore.emitChange()


module.exports = TreeStore