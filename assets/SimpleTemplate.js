/**
 * Simple template class for HTML templates.
 *
 * Written in ES5 for maximum compatibility.
 * Written in Standard Code Style
 *
 * @author Hunter Perrin <hperrin@gmail.com>
 */
'use strict'

/**
 * A simple HTML template.
 * @param {string} id The ID of the template element.
 */
window.SimpleTemplate = function (id) {
  /**
   * Template variable values.
   * @type {!{!string, !string}}
   * @private
   */
  this.values_ = {}

  /**
   * The template element.
   * @type {!Element}
   * @private
   */
  this.elem_ = document.getElementById(id)

  if (!this.elem_) {
    throw new Error('Template with ID, ' + id + ', not found.')
  }
}

/**
 * Set the value of a variable.
 * @param {!string} name  The name of the variable.
 * @param {*} value The value to be inserted in the template.
 */
window.SimpleTemplate.prototype.setValue = function (name, value) {
  this.values_[name] = this.safeValue_(value)
}

/**
 * Get the value of a variable
 * @param {!string} name  The name of the variable.
 * @return {!string} The value.
 */
window.SimpleTemplate.prototype.getValue = function (name) {
  return this.values_[name]
}

/**
 * Get the HTML safe value of a string or string like object.
 * @param  {*} value The untrusted object.
 * @return {!string} A safe string.
 */
window.SimpleTemplate.prototype.safeValue_ = function (value) {
  var tmpElem = document.createElement('span')
  tmpElem.textContent = value
  return tmpElem.innerHTML
}

/**
 * Render the template.
 * @return {!string} The resulting HTML.
 */
window.SimpleTemplate.prototype.render = function () {
  var html = this.elem_.innerHTML

  for (var name in this.values_) {
    if (!this.values_.hasOwnProperty(name)) continue

    var pattern = new RegExp('\\{\\{' + name + '\\}\\}', 'g')

    html = html.replace(pattern, this.values_[name])
  }

  return html
}
