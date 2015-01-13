TreeStore = require '../stores/TreeStore.coffee'

recl = React.createClass
[div,input,textarea] = [React.DOM.div,React.DOM.input,React.DOM.textarea]

module.exports = recl
  stateFromStore: -> 
    body:TreeStore.getBody()
  
  componentDidMount: -> 
    TreeStore.addChangeListener @_onChangeStore
    @setBody()

  componentDidUpdate: -> @setBody()

  getInitialState: -> @stateFromStore()

  _onChangeStore: ->  @setState @stateFromStore()

  setBody: ->
    $("#body").html @state.body

  render: ->
    div {id:'body'}, ""