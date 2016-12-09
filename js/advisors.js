angular
    .module('arrayDemo')
    .factory('advisors',
        [
            'arrayElement',
            'arrayDiff',
            function(arrayElement, arrayDiff){
              function DiffAdvisor(input){
                this.input = input;
              }

              DiffAdvisor.prototype = {
                apply: function(array){
                  return array;
                },
                highlightRange: function(diff, newArray, oldArray, result){
                  var start = diff.findIndex(function(e, i, a){
                    return this.isItemHighlighted(e, i, a);
                  }, this), end = -1;
                  if(~start){
                    end = diff.slice(start).findIndex(function(e, i, a){
                      return !this.isItemHighlighted(e, i, a);
                    }, this);
                    if(~end)
                      end += start - 1;
                    else
                      end = diff.length - 1;
                    return {
                      start: start,
                      end: end
                    };
                  }
                },
                isItemHighlighted: function(item, index, diff){
                  return item.added || item.removed;
                }
              }

              var advisors = {
                'IndexAdvisor': function(array){
                  if(array[this.input.elementIndex])
                    return array[this.input.elementIndex] = {
                      value: this.input.elementValue,
                      $$id: array[this.input.elementIndex].$$id
                    };
                  return array[this.input.elementIndex] = arrayElement(this.input.elementValue);
                },
                'LengthAdvisor': function(array){
                  return array.length = this.input.arrayLength;
                },
                'PushAdvisor': function(array){
                  return array.push(arrayElement(this.input.elementValue));
                },
                'PopAdvisor': function(array){
                  return array.pop();
                },
                'UnshiftAdvisor': function(array){
                  return array.unshift(arrayElement(this.input.elementValue));
                },
                'ShiftAdvisor': function(array){
                  return array.shift();
                },
                'SliceAdvisor': function(array){
                  var args = [];
                  if(this.input.hasRangeStart){
                    args.push(this.input.rangeStart);
                    if(this.input.hasRangeEnd)
                      args.push(this.input.rangeEnd);
                  }
                  return array.slice(...args);
                },
                'SpliceAdvisor': function(array){
                  return array.splice(this.input.rangeStart, this.input.rangeSize, ...this.input.insertions
                      .map(function(e){
                        return arrayElement(e);
                      }));
                }
              };

              for ( var advisorName in advisors)
                advisors[advisorName] = createSubclass(advisorName, null, DiffAdvisor, {
                  apply: advisors[advisorName]
                });

              advisors.SliceAdvisor.prototype.highlightRange = function(diff, newArray, oldArray, result){
                return DiffAdvisor.prototype.highlightRange.call(this, arrayDiff(oldArray, result), result, oldArray);
              }
              advisors.SliceAdvisor.prototype.isItemHighlighted = function(item, index, diff){
                return !item.removed;
              }

              return advisors;

              function createSubclass(name, constructor, parent, proto){
                var claz = eval('((p, c) => (function '
                    + name
                    + '(){ p.apply(this, arguments); c && c.apply(this, arguments); this.constructor = arguments.callee; }))(parent, constructor)');
                claz.prototype = Object.create(parent.prototype);
                if(proto)
                  for ( var property in proto)
                    claz.prototype[property] = proto[property];
                return claz;
              }

            }]);
