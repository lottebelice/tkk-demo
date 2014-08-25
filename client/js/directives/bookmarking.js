'use strict';

angular.module('app.bookmarking', []).directive('bookmarking', ['Model', bookmarkingDirective]);

function bookmarkingDirective(Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.bookmark = function () {
        var id = compositeId();
        var currentBookmarks = isBookmarked() ? Model.unbookmark(id) : Model.bookmark(id);
        sendToBookmark(currentBookmarks);
      };

      $scope.bookmarkStatus = function () {
        return isBookmarked();
      };

      function isBookmarked() {
        if ($scope.chapter) {
          return _.contains(Model.getBookmarks(), compositeId());
        } else {
          return false;
        }
      }

      function compositeId() {
        var c = $scope.video.id + '_' + $scope.chapter.id;
        console.log(c);
        return c;
      }

      function sendToBookmark(b) {
        send({target: 'bookmark', data: b});
      }
      function send(msg) {
        eddie.putLou('ngproxy', JSON.stringify(msg));
      }
    },
    templateUrl: 'partials/directives/bookmarking.html'
  }
}
