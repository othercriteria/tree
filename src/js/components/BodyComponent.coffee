TreeStore = require '../stores/TreeStore.coffee'

recl = React.createClass
[div,input,textarea] = [React.DOM.div,React.DOM.input,React.DOM.textarea]

module.exports = recl
  stateFromStore: -> 
    body:TreeStore.getBody()
    load:TreeStore.getLoad()
  
  componentDidMount: -> 
    TreeStore.addChangeListener @_onChangeStore
    @setBody()

  componentDidUpdate: -> @setBody()

  getInitialState: -> @stateFromStore()

  _onChangeStore: ->  @setState @stateFromStore()

  setBody: ->
    $("#body").html @state.body

  render: ->
    parts = []

    k = if @state.load then "load" else ""
    parts.push (div {id:"load",className:k}, "LOADING")
    parts.push (div {id:'body'}, "")

    (div {}, parts)