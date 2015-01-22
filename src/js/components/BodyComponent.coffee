TreeStore = require '../stores/TreeStore.coffee'
TreeActions = require '../actions/TreeActions.coffee'

recl = React.createClass
rend = React.renderComponent
[div,input,textarea] = [React.DOM.div,React.DOM.input,React.DOM.textarea]

module.exports = recl
  availableComponents: [
    "page"
    "list"
  ]

  stateFromStore: -> 
    body:TreeStore.getBody()
    load:TreeStore.getLoad()
    cont:TreeStore.getCont()
  
  componentDidMount: -> 
    TreeStore.addChangeListener @_onChangeStore

  componentDidUpdate: -> 

  getInitialState: -> @stateFromStore()

  _onChangeStore: ->  @setState @stateFromStore()

  checkPath: (path) -> @state.cont[path]?

  render: ->
    parts = []

    body = eval JSXTransformer.transform("<div>"+@state.body+"</div>").code

    k = if @state.load then "load" else ""
    parts.push (div {id:"load",className:k}, "LOADING")
    parts.push (div {id:'body'},body)

    (div {}, parts)