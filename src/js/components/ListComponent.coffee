TreeStore   = require '../stores/TreeStore.coffee'
TreeActions = require '../actions/TreeActions.coffee'

recl = React.createClass
[div,a,ul,li] = [React.DOM.div,React.DOM.a,React.DOM.ul,React.DOM.li]

module.exports = recl
  stateFromStore: -> 
    path = @props.dataPath ? TreeStore.getCurr()
    {
      snip:TreeStore.getSnip()
      tree:TreeStore.getTree(path.split("/"))
      path:path
    }

  componentDidMount: -> 
    TreeStore.addChangeListener @_onChangeStore

  getInitialState: -> @stateFromStore()

  _onChangeStore: ->  @setState @stateFromStore()

  componentDidMount: ->
    cont = true
    for k in _.keys @state.tree
      cont = false if not @state.snip[@state.path+"/"+k]
    if not @state.tree or _.keys(@state.tree).length is 0 or not cont
      TreeActions.getPath @state.path,"snip"

  render: ->
    doc = @state.tree ? []
    _list = _.map _.keys(doc).sort(), (v) =>
      _path = @state.path+"/"+v
      if _path[0] is "/" then _path = _path.slice(1)
      if @props.dataPreview?
        c = "preview"
        prev = @state.snip[_path]
      else
        c = ""
        prev = v
      (li {}, (a {href:"/"+_path,className:c,key:"list-a-"+_path}, prev))
    (ul {className:"list",key:"list-"+@state.path}, _list)