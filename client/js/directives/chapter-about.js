'use strict';

angular.module('app.chapter-about', []).directive('chapterAbout', ['entityProxy', 'Model', chapterAboutDirective]);

function chapterAboutDirective(entityProxy, Model) {
  return {
    restrict: 'E',
    scope: {
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.loading = false;

      $scope.crumb = [];
      var answers = {};

      loadChapterInformation();

      // The chapter information are shown in the first information card
      function loadChapterInformation() {
        var metadata = _.chain($scope.chapter.fragments)
          .map(function (f) {
            return {value: f.title.trim(), uri: f.locator.trim()}
          })
          .filter(function (e) {
            return e.value.length > 0
          })
          .uniq(false, function (e) {
            return e.value;
          })
          .value();

        //metadata.push({value: 'Piet Mondrian', uri: 'http://dbpedia.org/resource/Piet_Mondrian'}); //for testing navigation uncomment this

        var chapterTitle = $scope.chapter.title;
        answers[chapterTitle] = {
          label: [
            {value: chapterTitle}
          ],
          thumb: [''], //TODO chapter artwork picture (special object)
          metadata: metadata
        };

        var chapterEntity = {value: chapterTitle, uri: ''};
        callEntityProxy(chapterEntity);
      }

      function callEntityProxy(e) {
        updateCrumb(e);

        $scope.loading = true;
        if (!_(answers).has(e.value)) {
          entityProxy.get({loc: e.uri}, function (r) {
            $scope.proxyAnswer = _.property(e.uri)(r);
            answers[e.value] = $scope.proxyAnswer;

            $scope.loading = false;
          });
        } else {
          $scope.proxyAnswer = _.property(e.value)(answers);
          $scope.loading = false;
        }
      }

      function updateCrumb(e) {
        var index = _($scope.crumb).pluck('value').indexOf(e.value);
        if (index != -1) {
          $scope.crumb = _($scope.crumb).first(index + 1);
        } else {
          $scope.crumb.push(e)
        }
      }

      $scope.proxy = function (entity) {
        callEntityProxy(entity)
      };
    },
    templateUrl: 'partials/directives/chapter-about.html'
  }
}