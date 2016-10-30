angular.module('arrayDemo', []).controller('ArrayDemoController', ['$scope', '$filter', function($scope, $filter){
  this.preview = true;
  this.items = [{
    value: 5,
    index: 2,
    removed: true,
    oldIndex: 3
  }];
  this.mode = function(advisorName){
    //this.advisor = advisorName;
  }
  this.input = {
    elementIndex: 0,
    elementValue: 5
  };

  this.advisor = new IndexAdvisor(this.input);
  
  this.filtered = $filter('preview')(this.items, this.advisor);

}]).filter('preview', [function(){
  return function(items, advisor){
    var length = advisor.getItemCount(items);
    var result = new Array(length);
    for (var i = 0; i < length; ++i)
      result[i] = advisor.getItem(items, i);

    result[advisor.getRangeStart(items)].rangeStart = true;
    result[advisor.getRangeEnd(items) - 1].rangeEnd = true;

    return result;
  }
}]);