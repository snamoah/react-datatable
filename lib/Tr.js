import React, { Component } from 'react';
import Td from './Td';

const Tr = (props) => {
  const cols = props.config.cols;
  const record = props.record;

  return (
    <tr data-index={props.index}>
    {
      cols.map(function (col,idx) {
        return <Td config={props.config} index={props.index} key={idx} datasource={props.datasource} col={col} property={col.property} record={record} path={col.path}/>
      }.bind(this))
    }
    </tr>
  );
};

export default Tr;
