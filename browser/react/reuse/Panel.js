import React from 'react';

const Panel = ({ type, title, footer, children, titleStyle }) => (
  <div className={`panel panel-${type}`}>
    <div className="panel-heading">
      <h4 className={`panel-title`} style={ titleStyle }>
        { title }
      </h4>
    </div>
    <div className="panel-body">
      { children }
    </div>
    { !footer.length ? '' : <div className="panel-footer">{ footer }</div>}
  </div>
);

Panel.propTypes = {
  type: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  titleStyle: React.PropTypes.object,
};

Panel.defaultProps = {
  type: 'default',
  titleStyle: {},
  footer: ''
};

export default Panel;
