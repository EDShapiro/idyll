import React from 'react';
import ReactTooltip from 'react-tooltip';

class AuthorTool extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorView: false,
      debugHeight: 0,
      componentHeight: 0,
      hasPressedButton: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  /* Returns authoring information for the values in the form of
    ComponentName
    Link to Docs page
    Information about each prop
  */
  handleFormatComponent(runtimeValues) {
    const metaValues = runtimeValues.type._idyll
    const componentName = metaValues.name;

    // Docs use lowercase component name for link
    const componentLowerCase = componentName.charAt(0).toLowerCase() + componentName.slice(1);
    const componentDocsLink = "https://idyll-lang.org/docs/components/default/" +
      componentLowerCase;

    // For all available props in metaValues, display them
    // If runtimeValues has a value for given prop, display it
    const showProps = metaValues.props.map((prop) => {
      const runtimeValue = runtimeValues.props[prop.name];
      let currentPropValue = null;
      if (runtimeValue != undefined) {
        if (runtimeValue && {}.toString.call(runtimeValue) === '[object Function]') {
          currentPropValue = <em>function</em>;
        } else {
          currentPropValue = runtimeValue;
        }
      }
      return (
        <tr key={JSON.stringify(prop)} className="props-table-row">
          <td>{prop.name}</td>
          <td className="props-table-type">{prop.type}</td>
          <td>{prop.example}</td>
          <td>{currentPropValue}</td>
        </tr>
      )
    });
    const {isAuthorView, debugHeight, componentHeight} = this.state;
    const currentDebugHeight = isAuthorView ? debugHeight : 0;
    const marginToGive = isAuthorView ? 15 : 0;
    const marginAboveTable = componentHeight < 40 && isAuthorView ? 40 - componentHeight : 0;
    return (
      <div className="debug-collapse" 
        style={{
          height: currentDebugHeight + 'px',
          marginBottom: marginToGive + 'px',
          marginTop: marginAboveTable + 'px'
        }}
      >
        <div className="author-component-view" ref="inner"> 
          <table className="props-table">
            <tbody>
              <tr className="props-table-row">
                <th>Prop</th>
                <th>Type</th>
                <th>Example</th>
                <th>Current Value</th>
              </tr>
              {showProps}
            </tbody>
          </table>
          <div className="icon-links">
            <a className="icon-link" href={componentDocsLink}>
              <img className="icon-link-image"
                src="https://raw.githubusercontent.com/google/material-design-icons/master/action/svg/design/ic_description_24px.svg?sanitize=true"
              />
            </a>
            <span style={{fontFamily: 'courier', fontSize: '12px', marginTop: '8px'}}>docs</span>
          </div>
        </div>
      </div>
    );
  }

  handleClick() {
    this.setState(prevState => ({
      isAuthorView: !prevState.isAuthorView,
      debugHeight: this.refs.inner.clientHeight,
    }));
    // following is kinda hacky to get the orig height of component
    // not sure what other way right now
    if (!this.state.hasPressedButton) {
      this.setState({
        componentHeight: this.refs.componentHeight.clientHeight,
        hasPressedButton: true
      });
    }
  }

  render() {
    const { idyll, updateProps, hasError, ...props } = this.props;
    const addBorder = this.state.isAuthorView ? {
      boxShadow: '5px 5px 10px 1px lightGray',
      transition: 'box-shadow 0.4s linear',
      padding: '0 10px 10px',
      margin: '0 -10px 20px'} : null;
    // This border transitions the button, so this puts
    // it back in place. Though it's affected by padding, like on Header
    const putButtonBack = this.state.isAuthorView ? {
      right: '10px',
      top: '3px'} : null;

    // If a component's height is too small, button will overlap will table
    // so add margin to get a minimal height (40px seems fine)
    return (
      <div className="component-debug-view" style={addBorder} ref="componentHeight">
        {props.component}
        <button className="author-view-button"
          style={putButtonBack}
          onClick={this.handleClick}
          data-tip data-for={props.uniqueKey}
        />
        <ReactTooltip
          className="button-tooltip"
          id={props.uniqueKey}
          type='info'
          effect='solid'
          place='right'
          disable={this.state.isAuthorView}
        >
          <div className="tooltip-header">{props.authorComponent.type._idyll.name} Component</div>
          <div className="tooltip-subtitle">Click for more info</div>
        </ReactTooltip>
        {this.handleFormatComponent(props.authorComponent)}
      </div>
    );
  }
}

module.exports = AuthorTool;