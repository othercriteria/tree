(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/galen/Documents/Projects/urbit.tree/src/js/actions/TreeActions.coffee":[function(require,module,exports){
var TreeDispatcher, TreePersistence;

TreeDispatcher = require('../dispatcher/Dispatcher.coffee');

TreePersistence = require('../persistence/TreePersistence.coffee');

module.exports = {
  loadPath: function(path, body, kids) {
    return TreeDispatcher.handleServerAction({
      type: "path-load",
      path: path,
      body: body,
      kids: kids
    });
  },
  getPath: function(path, cb) {
    var loadPath;
    loadPath = this.loadPath;
    if (path.slice(-1) === "/") {
      path = path.slice(0, -1);
    }
    return TreePersistence.get(path, function(err, res) {
      loadPath(path, res.body, res.kids);
      if (cb) {
        return cb(err, res);
      }
    });
  },
  setCurr: function(path) {
    return TreeDispatcher.handleViewAction({
      type: "set-curr",
      path: path
    });
  }
};



},{"../dispatcher/Dispatcher.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/dispatcher/Dispatcher.coffee","../persistence/TreePersistence.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/persistence/TreePersistence.coffee"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/components/AnchorComponent.coffee":[function(require,module,exports){
var TreeActions, TreeStore, a, div, recl, _ref;

TreeStore = require('../stores/TreeStore.coffee');

TreeActions = require('../actions/TreeActions.coffee');

recl = React.createClass;

_ref = [React.DOM.div, React.DOM.a], div = _ref[0], a = _ref[1];

module.exports = recl({
  stateFromStore: function() {
    return {
      crum: TreeStore.getCrumbs(),
      curr: TreeStore.getCurr(),
      pare: TreeStore.getPare(),
      next: TreeStore.getNext(),
      prev: TreeStore.getPrev(),
      kids: TreeStore.getKids(),
      tree: TreeStore.getTree([]),
      cont: TreeStore.getCont()
    };
  },
  checkPath: function(path) {
    return this.state.cont[path] != null;
  },
  setPath: function(href) {
    history.pushState({}, "", "/gen/main/tree/" + href);
    return TreeActions.setCurr(href);
  },
  goTo: function(path) {
    if (this.checkPath(path)) {
      return this.setPath(path);
    } else {
      return TreeActions.getPath(path, (function(_this) {
        return function() {
          return _this.setPath(path);
        };
      })(this));
    }
  },
  componentDidMount: function() {
    TreeStore.addChangeListener(this._onChangeStore);
    return $('body').on('click', 'a', (function(_this) {
      return function(e) {
        var href;
        href = $(e.target).attr('href');
        if (href[0] === "/") {
          href = href.slice(1);
          e.preventDefault();
          e.stopPropagation();
          return _this.goTo(href);
        }
      };
    })(this));
  },
  componentWillUnmount: function() {
    return $('body').off('click', 'a');
  },
  getInitialState: function() {
    return this.stateFromStore();
  },
  _onChangeStore: function() {
    return this.setState(this.stateFromStore());
  },
  render: function() {
    var crums, curr, kids, parts, _parts;
    parts = [];
    if (this.state.pare) {
      parts.push(div({
        id: "up"
      }, [
        a({
          href: this.state.pare,
          className: "arow-up"
        }, "")
      ]));
    }
    if (this.state.prev || this.state.next) {
      _parts = [];
      if (this.state.prev) {
        _parts.push(a({
          href: this.state.prev,
          className: "arow-prev"
        }, ""));
      }
      if (this.state.next) {
        _parts.push(a({
          href: this.state.next,
          className: "arow-next"
        }, ""));
      }
      parts.push(div({
        id: "sibs"
      }, _parts));
    }
    if (this.state.crum) {
      crums = _.map(this.state.crum, function(i) {
        return [
          div({}, "/"), a({
            href: i.path
          }, i.name)
        ];
      });
      parts.push(div({
        id: "bred"
      }, crums));
    }
    if (this.state.kids) {
      curr = this.state.curr;
      kids = _.map(this.state.kids, function(i) {
        return a({
          href: curr + "/" + i
        }, i);
      });
      parts.push(div({
        id: "kids"
      }, kids));
    }
    return div({}, parts);
  }
});



},{"../actions/TreeActions.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/actions/TreeActions.coffee","../stores/TreeStore.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/stores/TreeStore.coffee"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/components/BodyComponent.coffee":[function(require,module,exports){
var TreeStore, div, input, recl, textarea, _ref;

TreeStore = require('../stores/TreeStore.coffee');

recl = React.createClass;

_ref = [React.DOM.div, React.DOM.input, React.DOM.textarea], div = _ref[0], input = _ref[1], textarea = _ref[2];

module.exports = recl({
  stateFromStore: function() {
    return {
      body: TreeStore.getBody()
    };
  },
  componentDidMount: function() {
    TreeStore.addChangeListener(this._onChangeStore);
    return this.setBody();
  },
  componentDidUpdate: function() {
    return this.setBody();
  },
  getInitialState: function() {
    return this.stateFromStore();
  },
  _onChangeStore: function() {
    return this.setState(this.stateFromStore());
  },
  setBody: function() {
    return $("#body").html(this.state.body);
  },
  render: function() {
    return div({
      id: 'body'
    }, "");
  }
});



},{"../stores/TreeStore.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/stores/TreeStore.coffee"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/dispatcher/Dispatcher.coffee":[function(require,module,exports){
var Dispatcher, copyProperties;

Dispatcher = require('flux').Dispatcher;

copyProperties = require('react/lib/copyProperties');

module.exports = copyProperties(new Dispatcher(), {
  handleServerAction: function(action) {
    return this.dispatch({
      source: 'server',
      action: action
    });
  },
  handleViewAction: function(action) {
    return this.dispatch({
      source: 'view',
      action: action
    });
  }
});



},{"flux":"/Users/galen/Documents/Projects/urbit.tree/src/js/node_modules/flux/index.js","react/lib/copyProperties":"/Users/galen/Documents/Projects/urbit.tree/src/js/node_modules/react/lib/copyProperties.js"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/main.coffee":[function(require,module,exports){
var AnchorComponent, BodyComponent, TreeActions, TreePersistence, rend;

rend = React.renderComponent;

AnchorComponent = require('./components/AnchorComponent.coffee');

BodyComponent = require('./components/BodyComponent.coffee');

TreeActions = require('./actions/TreeActions.coffee');

TreePersistence = require('./persistence/TreePersistence.coffee');

$(function() {
  var $body, frag, path, up;
  $body = $('body');
  path = window.location.pathname.split("/").slice(4);
  frag = path.join("/");
  path.pop();
  up = path.join("/");
  TreeActions.setCurr(frag);
  TreeActions.loadPath(frag, $('#cont-raw').text(), window.tree.kids);
  TreeActions.getPath(up);
  rend(AnchorComponent({}, ""), $('#nav')[0]);
  return rend(BodyComponent({}, ""), $('#cont')[0]);
});



},{"./actions/TreeActions.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/actions/TreeActions.coffee","./components/AnchorComponent.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/components/AnchorComponent.coffee","./components/BodyComponent.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/components/BodyComponent.coffee","./persistence/TreePersistence.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/persistence/TreePersistence.coffee"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/node_modules/flux/index.js":[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":"/Users/galen/Documents/Projects/urbit.tree/src/js/node_modules/flux/lib/Dispatcher.js"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/node_modules/flux/lib/Dispatcher.js":[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":"/Users/galen/Documents/Projects/urbit.tree/src/js/node_modules/flux/lib/invariant.js"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/node_modules/flux/lib/invariant.js":[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],"/Users/galen/Documents/Projects/urbit.tree/src/js/node_modules/react/lib/copyProperties.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule copyProperties
 */

/**
 * Copy properties from one or more objects (up to 5) into the first object.
 * This is a shallow copy. It mutates the first object and also returns it.
 *
 * NOTE: `arguments` has a very significant performance penalty, which is why
 * we don't support unlimited arguments.
 */
function copyProperties(obj, a, b, c, d, e, f) {
  obj = obj || {};

  if ("production" !== process.env.NODE_ENV) {
    if (f) {
      throw new Error('Too many arguments passed to copyProperties');
    }
  }

  var args = [a, b, c, d, e];
  var ii = 0, v;
  while (args[ii]) {
    v = args[ii++];
    for (var k in v) {
      obj[k] = v[k];
    }

    // IE ignores toString in object iteration.. See:
    // webreflection.blogspot.com/2007/07/quick-fix-internet-explorer-and.html
    if (v.hasOwnProperty && v.hasOwnProperty('toString') &&
        (typeof v.toString != 'undefined') && (obj.toString !== v.toString)) {
      obj.toString = v.toString;
    }
  }

  return obj;
}

module.exports = copyProperties;

// deprecation notice
console.warn(
  'react/lib/copyProperties has been deprecated and will be removed in the ' +
  'next version of React. All uses can be replaced with ' +
  'Object.assign(obj, a, b, ...) or _.extend(obj, a, b, ...).'
);

}).call(this,require('_process'))
},{"_process":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/persistence/TreePersistence.coffee":[function(require,module,exports){
var TreeActions;

TreeActions = require('../actions/TreeActions.coffee');

module.exports = {
  get: function(path, cb) {
    return $.get("/gen/main/tree/" + path + ".json", {}, function(data) {
      if (cb) {
        return cb(null, data);
      }
    });
  }
};



},{"../actions/TreeActions.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/actions/TreeActions.coffee"}],"/Users/galen/Documents/Projects/urbit.tree/src/js/stores/TreeStore.coffee":[function(require,module,exports){
var EventEmitter, MessageDispatcher, TreeStore, _cont, _curr, _tree;

EventEmitter = require('events').EventEmitter;

MessageDispatcher = require('../dispatcher/Dispatcher.coffee');

_tree = {};

_cont = {};

_curr = "";

TreeStore = _.extend(EventEmitter.prototype, {
  addChangeListener: function(cb) {
    return this.on('change', cb);
  },
  removeChangeListener: function(cb) {
    return this.removeListener("change", cb);
  },
  emitChange: function() {
    return this.emit('change');
  },
  pathToArr: function(_path) {
    return _path.split("/");
  },
  pathToObj: function(_path, _obj, kids) {
    var i, _i, _j, _ref, _ref1, _results;
    _path = this.pathToArr(_path);
    for (i = _i = 0, _ref = _path.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      _obj = _obj[_path[i]] = {};
    }
    if ((kids != null ? kids.length : void 0) > 0) {
      _results = [];
      for (i = _j = 0, _ref1 = kids.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        _results.push(_obj[kids[i]] = {});
      }
      return _results;
    }
  },
  getTree: function(_path) {
    var i, tree, _i, _ref;
    tree = _tree;
    if (_path.length > 0) {
      for (i = _i = 0, _ref = _path.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        tree = tree[_path[i]];
      }
    }
    return tree;
  },
  setCurr: function(path) {
    return _curr = path;
  },
  getCurr: function() {
    return "/" + _curr;
  },
  getCont: function() {
    return _cont;
  },
  loadPath: function(path, body, kids, crum) {
    var _obj;
    _cont[path] = body;
    _obj = {};
    this.pathToObj(path, _obj, kids);
    return _.merge(_tree, _obj);
  },
  getKids: function() {
    return _.keys(this.getTree(_curr.split("/")));
  },
  getSiblings: function() {
    var curr;
    curr = _curr.split("/");
    curr.pop();
    if (curr.length !== 0) {
      return this.getTree(curr);
    } else {
      return {};
    }
  },
  getPrev: function() {
    var ind, key, par, sibs, win;
    sibs = _.keys(this.getSiblings());
    if (sibs.length < 2) {
      return null;
    } else {
      par = _curr.split("/");
      key = par.pop();
      ind = sibs.indexOf(key);
      win = ind - 1 > 0 ? sibs[ind - 1] : sibs[sibs.length - 1];
      par.push(win);
      return par.join("/");
    }
  },
  getNext: function() {
    var ind, key, par, sibs, win;
    sibs = _.keys(this.getSiblings());
    if (sibs.length < 2) {
      return null;
    } else {
      par = _curr.split("/");
      key = par.pop();
      ind = sibs.indexOf(key);
      win = ind + 1 < sibs.length ? sibs[ind + 1] : sibs[0];
      par.push(win);
      return par.join("/");
    }
  },
  getPare: function() {
    var _path;
    _path = this.pathToArr(_curr);
    if (_path.length > 1) {
      _path.pop();
      return "/" + _path.join("/");
    } else {
      return null;
    }
  },
  getCrumbs: function() {
    var crum, crums, k, v, _path;
    _path = this.pathToArr(_curr);
    crum = "";
    crums = [];
    for (k in _path) {
      v = _path[k];
      crum += "/" + v;
      crums.push({
        name: v,
        path: crum
      });
    }
    return crums;
  },
  getBody: function() {
    if (_cont[_curr]) {
      return _cont[_curr];
    } else {
      return "";
    }
  }
});

TreeStore.dispatchToken = MessageDispatcher.register(function(payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case 'path-load':
      TreeStore.loadPath(action.path, action.body, action.kids);
      return TreeStore.emitChange();
    case 'set-curr':
      TreeStore.setCurr(action.path);
      return TreeStore.emitChange();
  }
});

module.exports = TreeStore;



},{"../dispatcher/Dispatcher.coffee":"/Users/galen/Documents/Projects/urbit.tree/src/js/dispatcher/Dispatcher.coffee","events":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js"}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},["/Users/galen/Documents/Projects/urbit.tree/src/js/main.coffee"]);
