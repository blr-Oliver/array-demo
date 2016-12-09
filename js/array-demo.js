angular.module('arrayDemo', ['arrayDiff']).controller('ArrayDemoController',
    ['$scope', '$filter', 'advisors', 'arrayElement', 'arrayDiff',
        function($scope, $filter, advisors, arrayElement, arrayDiff){
          var self = this;
          this.input = {
            elementIndex: 0,
            elementValue: 0,
            arrayLength: 0,
            subMode: 'add',
            rangeStart: 0,
            rangeEnd: 0,
            hasRangeStart: true,
            hasRangeEnd: true,
            rangeSize: 0,
            insertions: [],
            preview: true,
            mode: 'index'
          };
          this.array = [arrayElement(5)];
          this.preview = true;

          this.advisors = Object.keys(advisors).map(function(className){
            return new advisors[className](self.input);
          }).reduce(function(hash, instance){
            return hash[instance.constructor.name] = instance, hash;
          }, {});

          this.updateAdvisor = function(){
            var advisorName;
            switch (this.input.mode) {
            case 'index':
              advisorName = 'IndexAdvisor';
              break;
            case 'length':
              advisorName = 'LengthAdvisor';
              break;
            case 'push-pop':
              advisorName = this.input.subMode == 'add' ? 'PushAdvisor' : 'PopAdvisor';
              break;
            case 'shift-unshift':
              advisorName = this.input.subMode == 'add' ? 'UnshiftAdvisor' : 'ShiftAdvisor';
              break;
            case 'slice':
              advisorName = 'SliceAdvisor';
              break;
            case 'splice':
              advisorName = 'SpliceAdvisor';
              break;
            }
            this.advisor = self.advisors[advisorName];
          }

          this.update = function(){
            var advisor = this.advisor;
            var array = this.array;
            var clone = array.slice();
            this.result = advisor.apply(clone);
            this.display = arrayDiff(array, clone);
            var highlight = advisor.highlightRange(this.display, clone, this.array, this.result);
            if(highlight){
              if('start' in highlight && ~highlight.start)
                this.display[highlight.start].rangeStart = true;
              if('end' in highlight && ~highlight.end)
                this.display[highlight.end].rangeEnd = true;
            }
          }

          this.apply = function(){
            this.advisor.apply(this.array);
            this.normalize();
            this.update();
          }

          this.normalize = function(){
            for (var i = 0; i < this.array.length; ++i){
              if(!this.array[i])
                this.array[i] = arrayElement();
              this.array[i].index = i;
            }
          }

          this.normalize();
          
          $scope.$watch(function(){
            return self.input;
          }, function(newValue){
            self.updateAdvisor();
            self.update();
          }, true);

          $scope.$watch(function(){
            return self.result;
          }, function(newValue){
            self.displayResult = $filter('unwrap')(newValue);
          });

        }]).factory('arrayElement', function(){
  var id = 0;
  return function(value){
    return {
      value: value,
      $$id: ++id
    };
  }
}).filter('unwrap', function(){
  return function(input){
    if(input instanceof Array){
      return input.map(function(e){
        return e.value;
      });
    }else if(input && typeof (input) == 'object'){
      return input.value;
    }
    return input;
  }
});