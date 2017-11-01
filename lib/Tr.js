import React, { Component } from 'react';
import Td from './Td';

export default Tr = (props) => {
  const cols = props.config.cols;
  const record = props.record;
  return (
    <tr data-index={props.index}>
    {
      cols.map(function (col,idx) {
        return <RDTCell config={props.config} onCellChange={this.onCellChange} index={props.index} key={idx} datasource={props.datasource} col={col} property={col.property} record={record} path={col.path}/>
      }.bind(this))
    }
    </tr>
  );
};
