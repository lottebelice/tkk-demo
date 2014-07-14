'use strict';

var tkkServices = angular.module('tkkServices', ['ngResource']);

tkkServices.factory('mediaResource', ['$resource', 'CONFIG', mediaResourceService]);

function mediaResourceService($resource, CONFIG) {
  return $resource(CONFIG.API_ROOT + '/mediaresource/:id/:path', { id: '@id', _page: 0 },
    {
      get: {
        method: 'GET'
      },
      mediafragments: {
        method: 'GET',
        params: { path: 'mediafragment' }
      },
      annotations: {
        method: 'GET',
        params: { path: 'annotations' }
      }
    }
  );
}


tkkServices.factory('eventsBus', ['$rootScope', eventsBusService]);

/** Used to broadcast and listen for global events */
function eventsBusService($rootScope) {
  return {
    publish: function (channel, data) {
      console.log('publishing on \'' + channel + '\'');
      $rootScope.$broadcast(channel, data);
    },
    subscribe: function ($scope, channel, handler) {
      console.log('subscribing to \'' + channel + '\'');
      $scope.$on(channel, function (event, data) {
        handler(data);
      })
    }
  }
}
