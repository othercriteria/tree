TreeStore   = require '../stores/TreeStore.coffee'
TreeActions = require '../actions/TreeActions.coffee'

recl = React.createClass
[div,input,textarea] = [React.DOM.div,React.DOM.input,React.DOM.textarea]

module.exports = recl
  stateFromStore: -> 
    tree:TreeStore.getTree([])

  componentDidMount: -> 
    TreeStore.addChangeListener @_onChangeStore

  getInitialState: -> @stateFromStore()

  _onChangeStore: ->  @setState @stateFromStore()

  componentDidMount: ->
    if not @state.tree.doc?.hoon?.library
      TreeActions.getPath @props.dataPath

  render: ->
    doc = @state.tree.doc?.hoon?.library ? []
    (div {}, _.each _.keys(doc), (v) -> (div {key:"lib-"+v}, v))