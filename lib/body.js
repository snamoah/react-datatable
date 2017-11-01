import React, { Component } from 'react';
import Tr from './Tr';

export default class TBody extends Component {
  componentDidMount() {
    this.props.datasource.on('RECORD_UPDATED', this.handleRecordUpdate);
  }

  handleRecordUpdate(record, recordIdx, property, newValue) {
    this.refs[recordIdx].forceUpdate();
  }

  render() {
    return (
      <tbody>
      {
        this.props.datasource.map(this.props.pager, function (data, idx, realIdx) {

          //if this is a normal array map function, then realIdx here is the underlying array
          //if the map came from us, then realIdx is the real index. if we are on a page, then idx will point to
          //the index on the current view
          const id = idx;
          if (realIdx && !Array.isArray(realIdx)) {
            id = realIdx;
          }
          return <Tr ref={id} datasource={this.props.datasource} index={id}  key={id}  record={data} config={this.props.config} />
        }.bind(this))
      }
      </tbody>
    )
  }
}
