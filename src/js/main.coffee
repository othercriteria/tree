rend = React.render

$ ->
  window.BodyComponent = BodyComponent
  $body = $('body')

  AnchorComponent   = React.createFactory require './components/AnchorComponent.coffee'
  BodyComponent     = React.createFactory require './components/BodyComponent.coffee'
  TreeActions       = require './actions/TreeActions.coffee'
  TreePersistence   = require './persistence/TreePersistence.coffee'

  path = window.location.pathname.split("/").slice(4)
  frag = path.join("/")
  path.pop()
  up = path.join("/").slice(0,-1)

  console.log up

  TreeActions.setCurr frag
  TreeActions.loadPath frag,$('#cont-raw').text(),window.tree.kids
  if up isnt "" then TreeActions.getPath up

  rend (AnchorComponent {}, ""),$('#nav')[0]
  rend (BodyComponent {}, ""),$('#cont')[0]

  # route = ->
  #     _route = window.location.hash.substr(1)
  #     _route = "" if not _route
  #     TreePersistence.get _route
  # $(window).on 'hashchange', route
  # # need to get last parent if we don't already have it
  # route()

  # if not window.location.hash
  #   window.location.hash = "/tree"
