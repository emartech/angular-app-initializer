'use strict';

var EventEmitter = require('events').EventEmitter;
var deferredBootstrapper = require('angular-deferred-bootstrap');

module.exports = function(angular) {

  var App = function(angularApp, config) {
    this._name = config.name;
    this._cssUrl = config.cssUrl;
    this._container = config.container;
    this._angularApp = angularApp;
    this._eventEmitter = new EventEmitter();
    this._api = null;
    this._appElement = null;
    this._appTemplate = config.appTemplate || '<app></app>';

    this._angularApp.on('started', function() {
      this._eventEmitter.emit('initialized');
    }.bind(this));
  };


  App.prototype = {

    runAngularApp: function(resolveBeforeStart) {
      this._angularApp.registerModules();
      this._inject();
      this._bootstrap(resolveBeforeStart);
    },


    _inject: function() {
      this._createAppElement();
      this._injectHtml();
      this._injectCss();
    },


    _bootstrap: function(resolveBeforeStart) {
      deferredBootstrapper(angular).bootstrap({
        element: this._appElement,
        module: this._name,
        resolve: resolveBeforeStart
      });
    },


    getApi: function() {
      return this._api;
    },


    on: function(name, cb) {
      this._eventEmitter.on(name, cb);
    },


    _createAppElement: function() {
      this._appElement = angular.element(this._appTemplate);
    },


    _injectHtml: function() {
      angular.element(this._container || document.body).append(this._appElement);
    },


    _injectCss: function() {
      var link = document.createElement('link');
      link.setAttribute('href', this._cssUrl);
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      document.body.appendChild(link);
    }

  };

  return App;

};
