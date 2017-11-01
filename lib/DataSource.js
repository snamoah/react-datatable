import { EventEmitter } from 'events';
import utils from './utils';

const EVENTS = {
    RECORD_UPDATED : "RECORD_UPDATED",
    RECORD_ADDED : "RECORD_ADDED",
    RECORDS_SORTED : "RECORDS_SORTED"
};

const indexRecords = () => {
  const colsMap = this.propertyConfigMap;
  const records = this.records;
  let i;
  const indexdb = {};

  records.forEach((record, i) => {
    Object.keys(colsMap).forEach( key => {
      const col = colsMap[key];
      const property = col.property;
      const index = indexdb[property] || ( indexdb[property] ={} );
      const value = utils.extractValue(property,col.path,record);
      const arr = index[value] || ( index[value] = []);
      arr.push(i);
    });
  });
};

const DataSource = (records, config) => {
  //the hell is this doing here
  this.id = new Date();

  if ( records instanceof Array ) {
    this.records = records;
  } else {
    const dataField = records.data;
    const data = records.datasource;
    this.records =  data[dataField];
  }
  this.config = config;
  if ( this.config ) {
    this.propertyConfigMap = {};
    this.config.cols.forEach( col => {
      this.propertyConfigMap[col.property] = col;
    });
  }
};

DataSource.EVENTS = EVENTS;

DataSource.prototype = EventEmitter.prototype;
DataSource.prototype.constructor = DataSource;

/**
 * Access the record at the given index
 *
 * @param index
 * @returns record
 */
DataSource.prototype.record = function(index) {
    return this.records[index];
};


/**
 * Append a record
 *
 * @param record
 */
DataSource.prototype.append = function(record) {
    this.records.push(record);
    this.emit(EVENTS.RECORD_ADDED,record);
};


DataSource.prototype.length = function() {
    return this.records.length;
};

/**
 * FIXME: Still broken, we need to be able to sort depending on type
 *
 * @param property
 * @param direction
 */
DataSource.prototype.sort = function(property,direction) {

    this.records.sort(  ( o1,o2 ) => {
        var reverseDir = 1;
        if ( direction === "-1" ) {
             reverseDir = -1;
        }
        var col = this.propertyConfigMap[property];

        var v1 = utils.extractValue(property,col.path,o1);
        var v2 = utils.extractValue(property,col.path,o2);


        var type = utils.extractSortableType(v1,v2);
        return utils.compare(type,v1,v2,reverseDir);

    });

    this.emit(EVENTS.RECORDS_SORTED, { property: property, direction : direction});


};

/**
 * Maps the actual page
 * The mapper function gets the record, currentIndex and actual index
 */
DataSource.prototype.map = function(pageState,mapper) {
    if ( !pageState ) {
        return this.records.map(mapper);
    }

    const result = [];
    const counter = 0;

    for ( let i = pageState.startIdx; i < pageState.endIdx; i++ ) {
        result.push(mapper(this.records[i],counter++,i));
    }

    return result;
};

/**
 * Up
 *
 *
 * @param recordIdx
 * @param newValue
 */
DataSource.prototype.updateRecord = function(recordIdx,property,newValue) {
    const record = this.records[recordIdx];
    utils.updateRecord(property,newValue,this.propertyConfigMap[property],record);
    //FIXME, we should get current value and pass as old value
    this.emit(EVENTS.RECORD_UPDATED,recordIdx,record,property,newValue);
};


export default DataSource;
