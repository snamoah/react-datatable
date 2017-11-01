import React, { Component } from 'react';

export default class Td extends Component {
  constructor(props) {
    super(props);

    this.state = {
      record: this.props.record,
      editMode: false,
    };
  }

  componentWillReceiveProps() {
    this.setState({ editMode: false });
  }

  convertToType(currentValue, newValue) {
    if ( (typeof currentValue) === "number" ) {
      if ( currentValue % 1 === 0 ) {
        return parseInt(newValue);
      } else {
        return parseFloat(newValue);
      }
    } else {
      //assume it is a number for now
      //FIXME do for other types, move to a function
      return newValue;
    }
  }

  getDisplayStyle() {
    const element = this.refs.td.getDOMNode();
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const left = element.offsetLeft;
    const top = element.offsetTop;

    return {
      width: width,
      height: height,
      top: top,
      left: left
    };
  }

  componentDidMount() {
    if (this.refs.input) {
      this.refs.input.getDOMNode().focus();
    }
  }

  componentDidUpdate() {
    if (this.refs.input) {
      this.refs.input.getDOMNode().focus();
    }
  }

  onClickHandler(event) {
    const target = event.target;
    if ( !this.state.editMode && this.props.col.editable ) {
      this.setState( {  editMode : true  } );
    }
  }

  onKeyUp(event) {
    const type = event.type;
    const keyCode = event.which;
    const ENTER_KEY = 13;
    if ( type==='keyup' && keyCode === ENTER_KEY && this.refs.input ) {

      const newValue = this.convertToType(this.props.record[this.props.property],this.refs.input.getDOMNode().value);
      const datasource = this.props.datasource;
      const index = this.props.index;

      datasource.updateRecord(this.props.index,this.props.property,newValue,this.props.col);

      this.setState( { editMode : false } );
      if ( this.props.onCellChange ) {
        this.props.onCellChange();
      }
    }
  }

  onBlur() {
    this.setState({ editMode: false })
  }

  createEditor() {
    const editable = this.props.col.editable || false;
    const editMode = this.state.editMode;

    //we need to check here because at initial pass getDisplayStyle will not resolve to anything.
    //it has the be rendered first
    if ( !editable || !editMode  ) {
      return null;
    }

    //TODO: either use built in editors or use the one returned by editor attribute
    //editor can be a react component
    //

    //  return ( <input  onBlur={this.onBlur} className="rdt-editor"
    return ( <input  onBlur={this.onBlur} className="rdt-editor"
      style={this.getDisplayStyle()} onKeyUp={this.onKeyUp} onChange={this.onInputChange} ref="input"  defaultValue={this.getValue()} /> );
  }

  getValue() {
    const property = this.props.property;
    return utils.extractValue(property,this.props.datasource.propertyConfigMap[property].path,this.props.record);
  }

  renderElement(value, formattedValue, cellDecoration, property, record) {
    const renderer = this.props.col.renderer;

    if ( typeof renderer === 'function' ) {
      try {
        return renderer.call(renderer,value,formattedValue,cellDecoration,property,record,React);
      } catch ( e ) {
        return null;
      }
    }
  }

  tdCellDecoration(value, property, record) {
    let decorator =  this.props.col.decorator;
    let  decoration = null;
    let  className = "";
    const  style = {};
    let  cellClassName = "";
    const  cellStyle = {};

    if ( typeof decorator === 'function' ) {
      try {
        decoration = decorator.call(decorator,value,property,record);

        if ( typeof decoration === 'string' ) {
          className = decoration;
        } else  {
          className = decoration.className || "";
          style = decoration.style || {};
          cellClassName = decoration.cellClassName || "";
          cellStyle = decoration.cellStyle || {};
        }
      } catch ( e ) {
        throw new Error("Error on decorator: " + e);
      }
    } else if ( typeof decorator === 'string' ) {
      className = decorator;
    }
    return {
      className : className,
      style : style,
      cellClassName : cellClassName,
      cellStyle : cellStyle
    }
  }

  render() {
    const record = this.props.record;
    const property = this.props.property;

    const value = this.getValue();
    let formattedValue = null;
    //FIXME ensure its a function
    if ( this.props.col.formatter ) {
      //pass the underlying record
      formattedValue = this.props.col.formatter(value,property,record,React);
    } else {
      formattedValue = value;
    }
    let decoration = this.tdCellDecoration(value,property,record);
    let renderedValue = null;

    if ( this.props.col.renderer ) {
      renderedValue = this.renderElement( value, formattedValue, decoration, property, record );
    }
    if ( !renderedValue ) {
      renderedValue = <div>{formattedValue}</div>
    }

    return (
      <td className={decoration.className} style={decoration.style} ref="td" onClick={this.onClickHandler} data-property={property} key={property}>
      <div className={decoration.cellClassName} style={decoration.cellStyle}>{renderedValue}</div>
      {this.createEditor()}
      </td>
    );
  }
}
