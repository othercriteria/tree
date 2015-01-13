rend = React.renderComponent

AnchorComponent = require './components/AnchorComponent.coffee'
BodyComponent = require './components/BodyComponent.coffee'
TreeActions = require './actions/TreeActions.coffee'

$ ->
  $body = $('body')

  rend (AnchorComponent {}, ""),$('#nav')[0]
  rend (BodyComponent {}, ""),$('#cont')[0]

  frag = window.location.pathname.split("/").slice(3).join("/")

  TreeActions.loadPath frag,$('#cont-raw').text(),window.tree.kids

  # route = ->
  #     _route = window.location.hash.substr(1)
  #     _route = "" if not _route
  #     TreePersistence.get _route
  # $(window).on 'hashchange', route
  # # need to get last parent if we don't already have it
  # route()

  # if not window.location.hash
  #   window.location.hash = "/tree"
