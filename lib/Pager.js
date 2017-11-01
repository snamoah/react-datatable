const Pager = (page,rowsPerPage,datasource) => {
  this.datasource= datasource;
  this.page = page;
  this.rowsPerPage = rowsPerPage;
  this.startIdx = (this.page - 1 ) * rowsPerPage;
  this.endIdx = ( this.startIdx + this.rowsPerPage ) < this.datasource.records.length ?
    ( this.startIdx + this.rowsPerPage ) : ( this.startIdx + ( this.datasource.records.length - this.startIdx ));
};


/**
 * Moves this pager forward and returns another pager
 *
 *
 * @param page
 * @returns Pager
 */
Pager.prototype.next = function() {

  return this.move(1);
};

Pager.prototype.previous = function() {
  return this.move(-1);
};
Pager.prototype.toPage = function(page) {
  return this.move(page - this.page);
};

Pager.prototype.maxPage= function() {
  let maxPage = parseInt(this.datasource.records.length / this.rowsPerPage);
  if ( ( this.datasource.records.length % this.rowsPerPage ) > 0 ) {
    maxPage += 1;
  }
  return maxPage;
};

Pager.prototype.move = function(movement) {
  const maxPage = this.maxPage();

  if ( ( this.page + movement ) > maxPage  || ( this.page + movement ) < 0 ) {
    return this;
  }
  return new Pager(this.page + movement,this.rowsPerPage,this.datasource);
};

Pager.prototype.state = function() {
  return {
    page : this.page,
    startIdx : this.startIdx,
    endIdx : this.endIdx,
    rowsPerPage: this.rowsPerPage,
    totalRecords : this.datasource.records.length,
    totalPage : this.maxPage()
  };
};
