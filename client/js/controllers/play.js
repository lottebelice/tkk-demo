'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$routeParams', '$location' , '$modal', 'eventsBus', 'Data', playCtrl]);

function playCtrl($scope, $routeParams, $location, $modal, eventsBus, Data) {
  $scope.second = false;
  $scope.beaming = false;

  $scope.chapterIndex = $routeParams.chapterIndex;

  //console.log('Play ctrl loaded @ ' + $scope.chapterIndex);

  if (Data.getVideo() != null) showVideo(Data.getVideo());


  $scope.goToMain = function () {
    $location.path('/');
  };

  function showVideo(video) {
    //console.log(video);

    Data.play(video, $scope.chapterIndex);
    $scope.video = video;
    $scope.chapter = video.chapters[$scope.chapterIndex];

    $scope.$$phase || $scope.$apply();
  }

  eventsBus.subscribe('video', showVideo);

  $scope.toggleBeam = function () {
    $scope.beaming = !$scope.beaming;
    if ($scope.beaming) {
      sendToTv({action: 'play', video: Data.getVideo(), chapter: Data.getChapter()});
      openEnrichment();
    } else {
      //TODO what should happen here?
    }
  };

  $scope.beamStatus = function() {
    return (!$scope.beaming) ? "Beam to TV" : "Stop beaming";
  };

  $scope.showEnrichment = function() {
    openEnrichment();
  };

  function sendToTv(action) {
    send({target: 'tv', data: action});
  }
  function send(msg) {
    eddie.putLou('ngproxy', JSON.stringify(msg));
  }

  function openEnrichment() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/controllers/enrich.html',
      controller: 'EnrichCtrl',
      size: 'lg',
      resolve: {
        chapter: function () {
          return $scope.chapter;
        }
      }
    });

    modalInstance.result.then(function () {
      //console.log('Modal accepted at: ' + new Date());
    }, function () {
      //console.log('Modal dismissed at: ' + new Date());
    });
  }
}
