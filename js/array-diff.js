angular.module('arrayDiff', []).provider('arrayDiff', [function(){
  var defaultIdProp = '$$id';
  return {
    defaultIdProp: function(value){
      return arguments.length ? (defaultIdProp = value, this) : defaultIdProp;
    },
    $get: function(){
      return function(oldArray, newArray, idProp){
        idProp = idProp || defaultIdProp;
        var oldMap = asIdMap(oldArray);
        var newMap = asIdMap(newArray);
        var diff = [];

        for (var i = 0, j = 0; i < newArray.length; ++i){
          var item = newArray[i];
          var diffItem = {
            value: item && item.value,
            index: i
          }
          if(!item || !item[idProp] || !(item[idProp] in oldMap))
            diffItem.added = true;
          else{
            var oldIndex = oldMap[item[idProp]].index;
            var oldValue = oldMap[item[idProp]].element.value;
            if(oldIndex != diffItem.index)
              diffItem.oldIndex = oldIndex;
            if(oldValue != diffItem.value){
              diffItem.oldValue = oldValue;
              diffItem.changed = true;
            }
            j = addRemoved(j, oldIndex);
          }
          diff.push(diffItem);
        }
        addRemoved(j, oldArray.length);
        return diff;

        function asIdMap(list){
          return list.reduce(function(h, e, i){
            return e && e[idProp] && (h[e[idProp]] = {
              element: e,
              index: i
            }), h;
          }, {});
        }

        function addRemoved(start, end){
          while(start < end){
            if(oldArray[start] && !(oldArray[start][idProp] in newMap))
              diff.push({
                value: oldArray[start].value,
                removed: true,
                oldIndex: start
              });
            ++start;
          }
          return start;
        }
      }
    }
  }
}]);
