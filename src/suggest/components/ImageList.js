import React, { Component, PropTypes } from 'react';
import Image from './Image';

export default class ImageList extends Component {
  render() {
    return (
      <div>
        {this.props.images.map((image, index) =>
          <Image url={image} onClick={() => this.props.onImageClick(index)} key={index} />
        )}
      </div>
    );
  }
}

ImageList.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onImageClick: PropTypes.func.isRequired
};
