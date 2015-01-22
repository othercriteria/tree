TreeStore = require '../stores/TreeStore.coffee'
TreeActions = require '../actions/TreeActions.coffee'

ListComponent     = require './ListComponent.coffee'

recl = React.createClass
rend = React.renderComponent
[div,input,textarea] = [React.DOM.div,React.DOM.input,React.DOM.textarea]

module.exports = recl
  stateFromStore: -> 
    body:TreeStore.getBody()
    load:TreeStore.getLoad()
    curr:TreeStore.getCurr()
    cont:TreeStore.getCont()
  
  componentDidMount: -> 
    @getPath @state.curr.slice(1)
    TreeStore.addChangeListener @_onChangeStore

  componentDidUpdate: (_props,_state) -> 
    if _state.curr isnt @state.curr
      setTimeout (() => @getPath _state.curr.slice(1)), 0

  getInitialState: -> @stateFromStore()

  _onChangeStore: ->  @setState @stateFromStore()

  getPath: (path) -> 
    if not @state.cont[path]? then TreeActions.getPath path

  render: ->
    parts = []

    body = eval JSXTransformer.transform("<div>"+@state.body+"</div>").code

    k = if @state.load then "load" else ""
    parts.push (div {id:"load",className:k}, "LOADING")
    parts.push (div {id:'body'},body)

    (div {}, parts)