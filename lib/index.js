import React, { Component } from 'react';
import DataSource from './DataSource';
import Pager from './Pager';
import Tr from './Tr';
import Td from './Td';
import Column from './Column';
import TBody from './TBody';
import Paginator from './Paginator';

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.state = this._createStateFromProps(props);
  }

  onClick(e) {
    const el = e.target;
    const action = el.getAttribute("data-rdt-action");
    if ( action === "sort" ) {
      const property= el.getAttribute("data-col-property");
      const direction = el.getAttribute("data-sort-direction");
      this.state.datasource.sort(property,direction);
      this.forceUpdate();
    }
  }


  componentWillReceiveProps(nextProps) {
    this.setState(this._createStateFromProps(nextProps));
  }

  nextPage() {
    if ( this.state.pager ) {
      this.setState({ pager : this.state.pager.next() });
    }
  }

  onDsRecordUpdated(recordIdx, record, property, newValue) {
    if ( this.props.onDsRecordUpdated ) {
      this.props.onDsRecordUpdated(recordIdx,record,property,newValue);
    }
  }

  _createStateFromProps(props) {
    const state = {};

    state.datasource = new DataSource(props.data || [],props.config);
    state.datasource.on(DataSource.EVENTS.RECORD_ADDED,this.onDsRecordAdded);
    state.datasource.on(DataSource.EVENTS.RECORD_UPDATED,this.onDsRecordUpdated);

    if (props.config.pager  ) {
      state.pager = new Pager(1, props.config.pager.rowsPerPage, state.datasource);
    }
    return  state;
  }

  pagerUpdated(page) {
    if ( this.state.pager ) {
      // this.pager = this.pager.toPage(page);
      this.setState({ pager : this.state.pager.toPage(page) });
    }
  }

  render() {

    const tableStyle = TABLE_CSS[this.props.config.style];
    const config = this.props.config;
    const datasource = this.state.datasource;
    let pagerState = null;
    let paginator = null;
    /*jshint ignore:start */
    if ( this.state.pager ) {
      paginator =  <Paginator pagerState={this.state.pager.state()} datasource={datasource} config={this.props.config} pageChangedListener={this.pagerUpdated}/>

    }
    return (
      <div onClick={this.onClick} style={ {width: '100%'}}>
        <div className="rdt-container" ref="container">
          <table className={tableStyle['table']}>
            <Column {...this.props} datasource={datasource} />
            <Tbody config={config} datasource={datasource} pager={this.state.pager}/>
          </table>
        </div>
        {paginator}
      </div>
    )
  }
}
