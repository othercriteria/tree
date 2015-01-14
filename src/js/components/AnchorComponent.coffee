TreeStore   = require '../stores/TreeStore.coffee'
TreeActions = require '../actions/TreeActions.coffee'

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
    tree:TreeStore.getTree([])
    cont:TreeStore.getCont()

  checkPath: (path) -> @state.cont[path]?

  setPath: (href) ->
    history.pushState {}, "", "/gen/main/tree/"+href
    TreeActions.setCurr href

  goTo: (path) ->
    if @checkPath path
      @setPath path
    else
      TreeActions.getPath path, => @setPath path

  componentDidMount: -> 
    TreeStore.addChangeListener @_onChangeStore

    $('body').on 'click', 'a', (e) =>
      href = $(e.target).attr 'href'
      if href[0] is "/"
        href = href.slice(1)
        e.preventDefault()
        e.stopPropagation()
        @goTo href

  componentWillUnmount: -> $('body').off 'click', 'a'

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