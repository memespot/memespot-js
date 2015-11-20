import React from 'react';
import ReactDOM from 'react-dom';
import ImageList from './components/ImageList';
import {Commands, ApiParams, Display} from './data/const';

var API_URL = `http://130.211.7.159/api/images/?format=json&limit=${ApiParams.LIMIT}&search=`;
if (__DEV__) {
   API_URL = `http://130.211.7.159/api/images/?format=jsonp&limit=${ApiParams.LIMIT}&callback=?&search=`;
}

export default class Suggest {
  constructor(target) {
    this.$target = $(target);
    this.$board = $("#board");
    this.$result = $("#result");
    this.value = target.value;
    this.focusBoard = false;
    this.focusIndex = 0;
    this.count = 0;
  }
  initialize() {
    this.$target.keyup(e => {
      var value = e.target.value;
      this.keyControll(e.keyCode);
      if( value != this.value ) {
        this.value = value;
        $.getJSON(API_URL + value, this.loadSuggestData.bind(this));
      }
    });
  }
  loadSuggestData(data){
    this.count = data.results.length;
    var images = data.results.map( result => { return result.url; });
    ReactDOM.render(<ImageList images={images} onImageClick={this.onImageClick.bind(this)} />, document.getElementById('board'));
  }
  keyControll(keyCode){
    switch (keyCode){
      case Commands.LEFT :
        if(this.focusBoard && 0 < this.focusIndex){
          this.move(-1);
        }
        break;
      case Commands.RIGHT :
        if(this.focusBoard && this.count - 1 > this.focusIndex){
          this.move(1);
        }
        break;
      case Commands.UP :
        if( this.focusBoard ) {
          if( this.focusIndex < Display.WIDTH_SIZE ) {
            this.focusBoard = false;
            this.focusIndex = 0;
            this.$board.find("img").eq(this.focusIndex).css("border","");
          } else {
            this.move(-Display.WIDTH_SIZE);
            this.$board.animate({ scrollTop: `${this.$board.scrollTop() - Display.IMAGE_HEIGHT}` });
          }
        }
        break;
      case Commands.DOWN :
        if( this.focusBoard ) {
          if( this.focusIndex >= this.count - Display.WIDTH_SIZE ) {
            this.move(this.count - this.focusIndex - 1);
          } else {
            this.move(Display.WIDTH_SIZE);
            this.$board.animate({ scrollTop: `${this.$board.scrollTop() + Display.IMAGE_HEIGHT}` });
          }
        } else {
          this.focusBoard = true;
          this.focusIndex = 0;
          this.$board.find("img").eq(this.focusIndex).css("border","2px solid blue");
        }
        break;
      case Commands.ENTER :
        if( this.focusBoard ) {console.log(this.$board.find("img").eq(this.focusIndex).data("url"));
          this.$result.val(this.$board.find("img").eq(this.focusIndex).data("url"));
        }
        break;
    }
  }
  move(num){
    this.$board.find("img").eq(this.focusIndex).css("border","");
    this.focusIndex = this.focusIndex + num;
    this.$board.find("img").eq(this.focusIndex).css("border","2px solid blue");
  }
  onImageClick(num){
    this.focusBoard = true;
    this.$board.find("img").eq(this.focusIndex).css("border","");
    this.focusIndex = num;
    this.$board.find("img").eq(this.focusIndex).css("border","2px solid blue");
    this.$result.val(this.$board.find("img").eq(this.focusIndex).data("url"));
  }
}
