rend = React.renderComponent

AnchorComponent   = require './components/AnchorComponent.coffee'
BodyComponent     = require './components/BodyComponent.coffee'
TreeActions       = require './actions/TreeActions.coffee'
TreePersistence   = require './persistence/TreePersistence.coffee'

$ ->
  window.BodyComponent = BodyComponent
  $body = $('body')

  path = window.location.pathname.split("/").slice(4)
  frag = path.join("/")
  path.pop()
  up = path.join("/")

  TreeActions.setCurr frag
  TreeActions.loadPath frag,$('#cont-raw').text(),window.tree.kids
  TreeActions.getPath up

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
