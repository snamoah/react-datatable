const Utils = {
  updateRecord(property, newValue, colConfig, record) {
    const config = colConfig;
    const path = config.path ? config.path : property;

    const setter = config.setter ? (value, setterProperty, setterConfig) => {
      if (typeof setterConfig.setter === 'string') {
        return record[setterConfig.setter](value, setterProperty, setterConfig.record);
      } else {
        return setterConfig.setter.call(record, value, setterProperty, setterConfig.record);
      }
    } : () => {
      return path.split('.').reduce((previous, current, index, array) => {
        if (index === (array.length - 1)) {
          if (typeof previous[current] === 'function') {
            previous[current](newValue);
          } else {
            previous[current] = newValue;
          }
        } else {
          return previous[current];
        }
      }, record);
    };

    setter.call(record, newValue, property, config, record);
  },

  colsToMap(config) {
    const colsMap = {};

    config.cols.forEach(column => colsMap[column.property] = column);
    return colsMap;
  },

  extractValue(property, path, record) {
    let value = '';

    /**
     * By default, we will use record[property] if path is not given.
     * If path is provided and is a string then will assume record[path]
     * If path is provided and is a function then we will call the function.
     * else we dont do anything
     */
    if ( typeof property === 'string' ) {
        if ( !path ) {
            value = record[property];
            if ( typeof(value) === 'function' ) {
                value = value.call(record);
            }
        } else {
            if ( typeof path === 'string' ) {
                value =  path.split('.').reduce(function(previous,current) {
                    if ( !previous || !current ) {
                        return null;
                    }
                    return previous[current];
                },record);// record[path];
            } else {
                //TODO: function check
                value = path(property,record);
            }
        }
    }
    return value;
  },

  extractSortableType(v1, v2) {
    if ( typeof v1 === 'string' && typeof v2 === 'string') {
        return String;
    } else if ( typeof v1 === 'number' && typeof v2 === 'number') {
        return Number;
    } else if ( v1 instanceof Date && v2 instanceof Date ) {
        return Date;
    } else {
        return null;
    }
  },

  compare(type, val1, val2, direction) {
    if ( type === Number ) {
        if ( val1 && val2 ) {
            return (val2 - val1) * direction;
        } else if ( val1 && !val2 ) {
            return val1 * direction;
        } else if ( !val1 && val2 ) {
            return val2 * direction;
        } else {
            return 0;
        }
    } else  { //string sort
        if ( val1  ) {
            return val1.localeCompare(val2) * direction;
        } else if ( val2 ) {
            return val2.localeCompare(val1) * direction;
        } else {
            return 0;
        }
    }
  },
};

export default Utils;
