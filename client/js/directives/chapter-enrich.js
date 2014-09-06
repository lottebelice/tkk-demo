'use strict';

angular.module('app.chapter-enrich', []).directive('chapterEnrich', ['Model', chapterEnrichDirective]);

function chapterEnrichDirective(Model) {
  return {
    restrict: 'E',
    scope: {

    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.$watch(
        function () {
          return Model.getChapter();
        },
        function (newChapter) {
          if (newChapter != null) {
            extractMetadata(newChapter);
          }
        }
      );

      function extractMetadata(ch) {
        scope.metadata = _.chain(ch.fragments)
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
      }
    },
    templateUrl: 'partials/directives/chapter-enrich.html'
  }
}
