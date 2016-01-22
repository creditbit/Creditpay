'use strict';

var UriHandler = function() {};

UriHandler.prototype.register = function() {
  var base = window.location.origin + '/';
  var url = base + '#/uri-payment/%s';

  if(window.cordova !== undefined && navigator.registerProtocolHandler) {
    navigator.registerProtocolHandler('creditbit', url, 'creditbit');
  }
};

angular.module('copayApp.services').value('uriHandler', new UriHandler());
