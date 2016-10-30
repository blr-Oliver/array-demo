/*
{
  elementIndex
  elementValue
  arrayLength
}
*/
function IndexAdvisor(input){
  this.input = input;
}

IndexAdvisor.prototype = {
  getItemCount: function(array){
    return Math.max(array.length, this.input.elementIndex);
  },
  getItem: function(array, index){
    var item = {
      value: this.input.elementIndex == index ? this.input.elementValue : array[index].value,
      index: index
    }
  },
  getRangeStart: function(array){
    return bump(this.input.elementIndex, 0, array.length);
  },
  getRangeEnd: function(array){
    return bump(this.input.elementIndex + 1, 0, array.length);
  },
  apply: function(array){
    return array[this.input.elementIndex] = this.input.elementValue;
  }
}

function LengthAdvisor(input){
  this.input = input;
}

LengthAdvisor.prototype = {
    getItemCount: function(array){
      return Math.max(this.input.arrayLength, array.length);
    },
    getItem: function(array, index){
      var item = {
          value: index < array.length ? array[index].value : undefined,
          added: index >= array.length,
          removed: index >= this.input.arrayLength
      }
      item[item.removed ? 'oldIndex' : 'index'] = index;
      return item;
    },
    getRangeStart: function(array){
      return Math.min(array.length, this.input.arrayLength);
    },
    getRangeEnd: function(array){
      return this.getItemCount(array);
    },
    apply: function(array){
      return array.length = this.input.arrayLength;
    }
  }

function bump(value, low, high){
  return Math.min(Math.max(value, low), high);
}
