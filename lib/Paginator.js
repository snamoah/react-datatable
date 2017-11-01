import React, { Component } from 'react';

class Paginator extends Component {
  pagerClickListener(e) {
    const target = e.target;
    let page = target.getAttribute("data-page");

    if (page) {
      page = parseInt(page);
      this.props.pageChangedListener(page);
    }
  }

  fastForward() {
    this.props.pageChangedListener( ( (this.props.pagerState.page + 2) <=0 ) ? this.props.pagerState.page.totalPage : this.props.pagerState.page + 2 );
  }

  fastBackward() {
    this.props.pageChangedListener( ( (this.props.pagerState.page - 2) <=0 ) ? 1 : this.props.pagerState.page - 2 );
  }

  render() {
    const ps = this.props.pagerState;
    const visiblePager = 3;
    let startPage = 1;
    const offset = 1;

    if ( ps.page > startPage ) {
      if ( ( ps.page - offset ) > offset  ) {
        startPage = ps.page  - offset;
      }
      if ( ps.page === ps.totalPage ) {
        startPage = ps.page - ( visiblePager - 1) ;
      }
    }

    const maxPage =  (( startPage + (visiblePager ) ) <= ps.totalPage ) ?  startPage + visiblePager : ps.totalPage + 1;

    const lastFFClass = "";
    const startFFClass = "";


    const generatePager = function() {

      const pagerComponents = [];

      pagerComponents.push(
        /*jshint ignore:start */
        (<li className={startFFClass} onClick={this.fastBackward}>
          <span>
          <span >&laquo;</span>
          </span>
          </li>)
        /*jshint ignore:end */
      );

      for ( let i=startPage; i <  maxPage ; i++ ) {
        const cls = "";
        if ( i === ps.page ) {
          cls="active";
        }
        pagerComponents.push(
          /*jshint ignore:start */
          (<li className={cls}><a data-page={i}  >{i}</a></li>)
          /*jshint ignore:end */
        );
      }

      pagerComponents.push(
        /*jshint ignore:start */
        (<li className={lastFFClass} onClick={this.fastForward}>
          <span>
          <span >&raquo;</span>
          </span>
          </li>)
        /*jshint ignore:end */
      );
      return pagerComponents;

    }.bind(this);



    /*jshint ignore:start */
    return(
      <div onClick={this.pagerClickListener} className="rdt-paginator">
      <ul className="pagination pagination-sm rdt-paginator-pager">
      {
        generatePager()
      }
      </ul>
      </div>
    );
  }
}

export default Paginator;
