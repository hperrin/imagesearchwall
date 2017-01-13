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
      BackButton: document.getElementById('BackButton'),
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
      // Handle error.
      if (jsonResult.stat === 'fail') {
        window.alert('An error occured (' +
          jsonResult.code + '): ' + jsonResult.message)
        App.switchView('InputView')
        return
      }
      if (jsonResult.photos.photo.length === 0) {
        window.alert('No results were found.')
        App.switchView('InputView')
        return
      }
      var photos = []
      for (var i = 0; i < jsonResult.photos.photo.length; i++) {
        if (!jsonResult.photos.photo[i].url_l ||
          jsonResult.photos.photo[i].url_l === '') continue
        if (!jsonResult.photos.photo[i].url_q ||
          jsonResult.photos.photo[i].url_q === '') continue
        photos.push({
          'urlMain': jsonResult.photos.photo[i].url_l,
          'urlThumb': jsonResult.photos.photo[i].url_q,
          'title': jsonResult.photos.photo[i].title,
          'author': jsonResult.photos.photo[i].ownername
        })
      }
      App.makeGrid(photos)
    }

    var url = 'https://api.flickr.com/services/rest/' +
      '?method=flickr.photos.search' +
      '&api_key=af9f9af73a0395060fde0fce9cee26b1' +
      '&format=json' +
      '&safe_search=1' +
      '&content_type=1' +
      '&media=photos' +
      '&extras=owner_name,url_q,url_l' +
      '&per_page=500' +
      '&text=' + window.encodeURIComponent(query)
    var jsonpScript = document.createElement('script')
    jsonpScript.setAttribute('type', 'text/javascript')
    jsonpScript.setAttribute('src', url)

    document.getElementsByTagName('head')[0].appendChild(jsonpScript)
  }

  App.makeGrid = function (photos) {
    // Go through photos, adding them to the grid.
    for (var i = 0; i < photos.length; i++) {
      var template = new window.SimpleTemplate(App.elems.templates.GridItemTpl)
      template.setValues(photos[i])
      App.elems.ui.Grid.appendChild(template.render())
    }

    // Switch to the grid view.
    App.switchView('GridView')
    App.elems.ui.Grid.scrollTop = 0
  }

  App.selectItem = function (item) {
    App.deselectItems()
    if (item) {
      item.classList.add('isSelected')
      item.focus()
    }
  }

  App.deselectItems = function () {
    for (var i = 0; i < App.elems.ui.Grid.children.length; i++) {
      App.elems.ui.Grid.children[i].classList.remove('isSelected')
    }
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
  App.elems.ui.BackButton.addEventListener('click', function () {
    App.elems.ui.QueryInput.value = ''
    App.elems.ui.QuerySubmit.setAttribute('disabled', 'disabled')
    App.switchView('InputView')

    // Clear the grid of existing items.
    while (App.elems.ui.Grid.hasChildNodes()) {
      App.elems.ui.Grid.removeChild(App.elems.ui.Grid.lastChild)
    }
  })
  App.elems.ui.Grid.addEventListener('focusin', function (e) {
    if (e.target.classList.contains('GridItem')) {
      App.selectItem(e.target)
    }
  }, true)
  document.addEventListener('keydown', function (e) {
    var selectedItem = document.getElementsByClassName('isSelected')[0]
    if (selectedItem) {
      switch (e.keyCode) {
        case 27: // Esc
          App.deselectItems()
          selectedItem.blur()
          break
        case 39: // Right arrow
          App.selectItem(selectedItem.nextSibling)
          break
        case 37: // Left arrow
          App.selectItem(selectedItem.previousSibling)
          break
      }
    }
  })
  App.elems.ui.Grid.addEventListener('mousedown', function (e) {
    // Find the clicked grid item.
    var target = e.target
    while (target.parentElement) {
      if (target.classList.contains('GridItem')) {
        break
      }
      target = target.parentElement
    }
    if (!target.parentElement) return

    // Handle whatever was clicked.
    if (e.target.classList.contains('GridItemPrevButton')) {
      App.selectItem(target.previousSibling)
    } else if (e.target.classList.contains('GridItemNextButton')) {
      App.selectItem(target.nextSibling)
    } else if (target.classList.contains('isSelected')) {
      App.deselectItems()
    } else {
      App.selectItem(target)
    }
    target.blur()
    e.preventDefault()
    return false
  }, true)
}
