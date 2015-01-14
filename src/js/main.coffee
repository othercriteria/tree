rend = React.renderComponent

AnchorComponent   = require './components/AnchorComponent.coffee'
BodyComponent     = require './components/BodyComponent.coffee'
TreeActions       = require './actions/TreeActions.coffee'
TreePersistence   = require './persistence/TreePersistence.coffee'

$ ->
  $body = $('body')

  path = window.location.pathname.split("/").slice(4)
  frag = path.join("/")
  path.pop()
  up = path.join("/")+".json"

  TreeActions.setCurr frag
  TreeActions.loadPath frag,$('#cont-raw').text(),window.tree.kids
  TreePersistence.get path.join("/")+".json"

  $('body').on 'click', 'a', (e) ->
    href = $(e.target).attr 'href'
    if href[0] is "/"
      href = href.slice(1)
      e.preventDefault()
      e.stopPropagation()
      TreePersistence.get href+".json", (err,res) ->
        TreeActions.setCurr href

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
