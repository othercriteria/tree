TreeStore   = require '../stores/TreeStore.coffee'
TreeActions = require '../actions/TreeActions.coffee'

recl = React.createClass
[div,a] = [React.DOM.div,React.DOM.a]

module.exports = recl
  stateFromStore: -> 
    crum:TreeStore.getCrumbs()
    curr:TreeStore.getCurr()
    pare:TreeStore.getPare()
    sibs:TreeStore.getSiblings()
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
      parts.push (div {id:"up"},(a {key:"arow-up",href:@state.pare,className:"arow-up"},""))      
      if @state.prev or @state.next
        _parts = []
        if @state.prev then _parts.push (a {key:"arow-prev",href:@state.prev,className:"arow-prev"},"")
        if @state.next then _parts.push (a {key:"arow-next",href:@state.next,className:"arow-next"},"")
        parts.push (div {id:"sides"}, _parts)
      

    # if @state.crum 
    #   crum = _.clone @state.crum
    #   crum.pop()
    #   crums = _.map crum, (i) -> 
    #     [(div {key:i.name+"-sl"}, "/"), (a {key:i.name+"-a",href:i.path},i.name)]
    #   crums.push (div {key:"last-sl"}, "/")
    #   parts.push (div {key:"bred",id:"bred"}, (div {}, crums))

    curr = @state.curr

    if _.keys(@state.sibs).length > 0
      p = curr.split "/"
      curr = p.pop()
      up = p.join "/"
      ci=0
      k=0
      sibs = _.map _.keys(@state.sibs).sort(), (i) -> 
        c = ""
        if curr is i
          c = "active"
          ci = k
        k++
        (div {className:c}, (a {key:i+"-a",href:up+"/"+i}, i))
      s = {marginTop:(ci*-1.1)+"em"}
      parts.push (div {key:"sibs",id:"sibs",style:s}, sibs)

    # if @state.kids
    #   kids = _.map @state.kids, (i) -> (div {}, (a {key:i+"-a",href:curr+"/"+i},i))
    #   parts.push (div {key:"kids",id:"kids"}, kids)

    div {}, parts