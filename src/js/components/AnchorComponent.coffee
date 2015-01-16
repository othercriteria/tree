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
    url:window.location.pathname

  checkPath: (path) -> @state.cont[path]?

  setPath: (href,hist) ->
    if hist isnt false then history.pushState {}, "", "/gen/main/tree/"+href
    TreeActions.setCurr href

  goTo: (path) ->
    if @checkPath path
      @setPath path
    else
      TreeActions.getPath path, => @setPath path

  checkURL: ->
    if @state.url isnt window.location.pathname
      @setPath window.location.pathname.replace("/gen/main/tree/",""),false

  componentDidMount: -> 
    TreeStore.addChangeListener @_onChangeStore

    setInterval @checkURL,100

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
      _parts = []
      _parts.push (a {href:@state.pare,className:"arow-up"},"")
      if @state.prev or @state.next
        if @state.prev then _parts.push (a {href:@state.prev,className:"arow-prev"},"")
        if @state.next then _parts.push (a {href:@state.next,className:"arow-next"},"")
      parts.push (div {id:"dpad"},_parts)

    if @state.crum 
      crums = _.map @state.crum, (i) -> 
        [(div {}, "/"), (a {href:i.path},i.name)]
      parts.push (div {id:"bred"}, crums)

    if @state.kids
      curr = @state.curr
      kids = _.map @state.kids, (i) -> (a {href:curr+"/"+i},i)
      parts.push (div {id:"kids"}, kids)

    div {}, parts