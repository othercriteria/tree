TreeStore = require '../stores/TreeStore.coffee'

recl = React.createClass
[div,a] = [React.DOM.div,React.DOM.a]

module.exports = recl
  stateFromStore: -> 
    crumbs:TreeStore.getCrumbs()
    pare:TreeStore.getPare()
    next:TreeStore.getNext()
    prev:TreeStore.getPrev()
  
  componentDidMount: -> TreeStore.addChangeListener @_onChangeStore

  getInitialState: -> @stateFromStore()

  _onChangeStore: ->  @setState @stateFromStore()

  render: ->
    parts = []
    if @state.pare then parts.push (a {href:"#"+@state.pare},"up")
    if @state.prev then parts.push (a {href:"#"+@state.prev},"prev")
    if @state.next then parts.push (a {href:"#"+@state.next},"next")

    div {}, parts