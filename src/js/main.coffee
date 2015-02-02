rend = React.render

$ ->
  window.BodyComponent = BodyComponent
  $body = $('body')

  console.log 'list'
  console.log ListComponent

  AnchorComponent   = React.createFactory require './components/AnchorComponent.coffee'
  BodyComponent     = React.createFactory require './components/BodyComponent.coffee'
  ListComponent     = React.createFactory require './components/ListComponent.coffee'

  window.tree.init(ListComponent)

  TreeActions       = require './actions/TreeActions.coffee'
  TreePersistence   = require './persistence/TreePersistence.coffee'

  path = window.location.pathname.split("/").slice(4)
  frag = path.join("/")
  path.pop()
  up = path.join("/")
  if up.slice(-1) is "/" then up = up.slice(0,-1)

  TreeActions.setCurr frag
  TreeActions.loadPath frag,window.tree.body,window.tree.kids
  if up isnt "" then TreeActions.getPath up

  rend (AnchorComponent {}, ""),$('#nav')[0]
  rend (BodyComponent {}, ""),$('#cont')[0]

  checkScroll = ->
    if $(window).scrollTop() > 20
      $('#nav').addClass 'scrolling'
    else
      $('#nav').removeClass 'scrolling'
  setInterval checkScroll, 500

  # route = ->
  #     _route = window.location.hash.substr(1)
  #     _route = "" if not _route
  #     TreePersistence.get _route
  # $(window).on 'hashchange', route
  # # need to get last parent if we don't already have it
  # route()

  # if not window.location.hash
  #   window.location.hash = "/tree"
