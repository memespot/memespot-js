import React, { Component, PropTypes } from 'react';
import Image from './Image';

export default class ImageList extends Component {
  render() {
    return (
      <div>
        {this.props.images.map((image, index) =>
          <Image url={image} onClick={() => this.props.onImageClick(index + this.props.paging)} key={index} />
        )}
      </div>
    );
  }
}

ImageList.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  paging: PropTypes.number.isRequired,
  onImageClick: PropTypes.func.isRequired
};
