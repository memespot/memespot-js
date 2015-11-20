import React, { Component, PropTypes } from 'react';

export default class Image extends Component {
  render() {
    return (
      <span className="image">
        <img src={this.props.url} onClick={this.props.onClick} width="100" height="100" data-url={this.props.url} />
      </span>
    );
  }
}

Image.propTypes = {
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}
