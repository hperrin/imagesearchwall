/**
 * Image search wall coding challenge main app.
 *
 * Written in ES5 for maximum compatibility.
 * Written in Standard Code Style
 *
 * @author Hunter Perrin <hperrin@gmail.com>
 */
'use strict'

window.loadApp = function () {
  var App = {}

  // == Get Element objects.

  App.elems = {
    App: document.getElementById('App'),

    ui: {
      QueryContainer: document.getElementById('QueryContainer'),
      QueryInput: document.getElementById('QueryInput'),
      QuerySubmit: document.getElementById('QuerySubmit'),
      Grid: document.getElementById('Grid')
    },

    views: {
      InputView: document.getElementById('InputView'),
      LoadingView: document.getElementById('LoadingView'),
      GridView: document.getElementById('GridView')
    },

    templates: {
      GridItemTpl: document.getElementById('GridItemTpl')
    }
  }

  // == App level methods.

  /**
   * Switch the app to a different view.
   * @param  {string} newView The name of the new view.
   */
  App.switchView = function (newView) {
    for (var view in App.elems.views) {
      if (!App.elems.views.hasOwnProperty(view)) continue
      // This line means the app won't work in IE<10, but the requirements are
      // only the latest version, so that's OK.
      App.elems.views[view].classList.remove('isActive')
      App.elems.views[view].setAttribute('aria-hidden', 'true')
    }

    App.elems.views[newView].classList.add('isActive')
    App.elems.views[newView].setAttribute('aria-hidden', 'false')
  }

  App.doSearch = function (query) {
    App.switchView('LoadingView')

    window.jsonFlickrApi = function (jsonResult) {
      console.log('jsonResult: ', jsonResult)
    }

    var url = 'https://api.flickr.com/services/rest/' +
      '?method=flickr.photos.search' +
      '&api_key=af9f9af73a0395060fde0fce9cee26b1' +
      '&format=json' +
      '&safe_search=1' +
      '&content_type=1' +
      '&media=photos' +
      '&extras=description,owner_name,url_sq,url_l' +
      '&text=' + window.encodeURIComponent(query)
    var jsonpScript = document.createElement('script')
    jsonpScript.setAttribute('type', 'text/javascript')
    jsonpScript.setAttribute('src', url)

    document.getElementsByTagName('head')[0].appendChild(jsonpScript)
  }

  // == Set up event listeners.

  App.elems.ui.QueryContainer.addEventListener('submit', function (e) {
    e.preventDefault()
    if (App.elems.ui.QueryInput.value === '') return false

    App.doSearch(App.elems.ui.QueryInput.value)
    return false
  })
  App.elems.ui.QueryInput.addEventListener('input', function () {
    if (App.elems.ui.QueryInput.value === '') {
      App.elems.ui.QuerySubmit.setAttribute('disabled', 'disabled')
    } else {
      App.elems.ui.QuerySubmit.removeAttribute('disabled')
    }
  })
}
