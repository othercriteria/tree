TreeStore = require '../stores/TreeStore.coffee'

recl = React.createClass
[div,a] = [React.DOM.div,React.DOM.a]

module.exports = recl
  stateFromStore: -> 
    crum:TreeStore.getCrumbs()
    curr:TreeStore.getCurr()
    pare:TreeStore.getPare()
    next:TreeStore.getNext()
    prev:TreeStore.getPrev()
    kids:TreeStore.getKids()
  
  componentDidMount: -> TreeStore.addChangeListener @_onChangeStore

  getInitialState: -> @stateFromStore()

  _onChangeStore: ->  @setState @stateFromStore()

  render: ->
    parts = []
    if @state.pare
      parts.push (div {id:"up"}, [(a {href:@state.pare,className:"arow-up"},"")])

    if @state.prev or @state.next
      _parts = []
      if @state.prev then _parts.push (a {href:@state.prev,className:"arow-prev"},"")
      if @state.next then _parts.push (a {href:@state.next,className:"arow-next"},"")
      parts.push (div {id:"sibs"},_parts)

    if @state.crum 
      crums = _.map @state.crum, (i) -> 
        [(div {}, "/"), (a {href:i.path},i.name)]
      parts.push (div {id:"bred"}, crums)

    if @state.kids
      curr = @state.curr
      kids = _.map @state.kids, (i) -> (a {href:curr+"/"+i},i)
      parts.push (div {id:"kids"}, kids)

    div {}, parts