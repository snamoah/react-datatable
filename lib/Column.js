import React, { Component } from 'react';

const DIRECTION_UP = '1';
const DIRECTION_DOWN = '-1';


const SortControl = (props) => {
  const arrowUp = (props.isSortedColumn && props.direction === DIRECTION_UP ) ?
    "rdt-arrow-up-active" : "rdt-arrow-up-inactive";
  var arrowDown = (props.isSortedColumn &&  props.direction === DIRECTION_DOWN ) ?
    "rdt-arrow-down-active" : "rdt-arrow-down-inactive";

  return (<div style={ { float: "right"} }><div
    data-rdt-action="sort" data-col-property={this.props.col.property}   data-sort-direction={DIRECTION_UP} className={"rdt-arrow-up " + arrowUp}></div><div style={{"marginBottom": "5px"}}></div>
    <div data-rdt-action="sort" data-col-property={this.props.col.property}   data-sort-direction={DIRECTION_DOWN} className={"rdt-arrow-down " + arrowDown}></div></div>);
};

export default class Column extends Component {
  constructor(props) {
    super(props);

    const datasource = props.datasource;
    datasource.on('RECORDS_SORTED', this.recordsSorted);
    this.state = {
      datasource: this.props.datasource,
      showFilter: false,
    };
  }
  recordsSorted(sortedInfo) {
    this.setState({sortInfo});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.datasource) {
      nextProps.datasource.on('RECORDS_SORTED', this.recordsSorted);
    }
  }

  render() {
    const cols = this.props.config.cols;
    const datasource = this.state.datasource;
    const sortedInfo = this.state.sortInfo; //datasource.sortedInfo;
    return(
      <thead onClick={this.onClick}>
        <tr>{
          cols.map(function(col,idx) {
            const isSortedColumn = false;
            let direction = null;
            const sortable = col.sortable;
            let sortControl = null;

            if ( col.sosortedInfo && sortedInfo.property === col.property ) {
              isSortedColumn = true;
              direction = sortedInfo.direction;
            }

            if ( sortable ) {
              sortControl = <SortControl isSortedColumn={isSortedColumn} direction={direction} col={col} />
            }
            return (
              <td data-th-key={col.property} key={col.property + "-th-" + idx}>
              <div><span>{col.header}</span>{sortControl}</div>
              </td>
            )
          }.bind(this))
        }
        </tr>
      </thead>

    )
  }
}
