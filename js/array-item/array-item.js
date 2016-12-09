angular.module('arrayDemo').directive('arrayItem', [function(){
  return {
    restrict: 'A',
    scope: {
      item: '=arrayItem'
    },
    templateUrl: '/js/array-item/array-item.html'
  };
}]);