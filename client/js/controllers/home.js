'use strict';

angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', '$location', 'eventsBus', 'Data', homeCtrl]);

function homeCtrl($scope, $location, eventsBus, Data) {
  if (Data.getVideo()) initialize(Data.getVideo());


  $scope.fragmentTitle = function (fg) {
    return "Fragment: " + fg.title + " @ " + (fg.startTime / 1000) + "s";
  };

  $scope.fragmentShot = function (fg) {
    var d = new Date(fg.startTime);
    var h = d.getHours() - 1;
    var m = d.getMinutes();
    var s = d.getSeconds();
    return $scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
  };

  $scope.playFragment = function (chIndex, fgIndex) {
    $location.path('/video/' + chIndex + '/' + fgIndex);
  };

  function initialize(video) {
    //console.log(video);

    $scope.video = video;
    $scope.$$phase || $scope.$apply();
  }

  var processMsg = function (video) {
    Data.setVideo(video);
    initialize(video);
  };

  eventsBus.subscribe($scope, 'video', processMsg);
}
