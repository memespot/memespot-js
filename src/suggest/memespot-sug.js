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
    this.nextUrl = null;
    this.isLazyLoding = false;
  }
  initialize() {
    this.$target.keyup(e => {      
      if(e.keyCode === Commands.DOWN){
        this.$target.blur();
        this.focusBoard = true;
        this.$board.find("img").eq(this.focusIndex).css("border","2px solid blue");
      }

      var value = e.target.value;
      if( value != this.value ) {
        this.value = value;
        $("#board").html("");
        this.apiCall(API_URL + value, this.loadSuggestData);
      }
    });
    this.$board.scroll(this.lazyLoad.bind(this));
    $(document).keydown(e => {      
      this.keyControll(e.keyCode);
    });
  }
  apiCall(url, callback){
    $.getJSON(url, callback.bind(this));
  }
  loadSuggestData(data){
    if(!!data.next){
      this.nextUrl = data.next.replace(/jQuery[0-9_]*/, "?");
      this.isLazyLoding = true;
    } else {
      this.nextUrl = null;
    }

    var images = data.results.map( result => { return result.url; });
    var div = document.createElement("div");
    ReactDOM.render(<ImageList images={images} onImageClick={this.onImageClick.bind(this)} />, div);
    
    this.$board.append($(div));
    this.count = this.$board.find("img").length;
  }
  lazyLoad(){
    if(this.isLazyLoding && !!this.nextUrl && (this.$board.height() - this.$board.scrollTop() < 200 )){
      this.isLazyLoding = false;
      console.log("call");
      this.apiCall(this.nextUrl, this.loadSuggestData);
    }
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
            this.$target.focus();
            this.$board.find("img").eq(this.focusIndex).css("border","");
            this.focusIndex = 0;
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
            this.lazyLoad();
          }
        } else {
          this.focusBoard = true;
          this.focusIndex = 0;
          this.$board.find("img").eq(this.focusIndex).css("border","2px solid blue");
        }
        break;
      case Commands.ENTER :
        if( this.focusBoard ) {
          this.$result.val(this.$board.find("img").eq(this.focusIndex).data("url"));
          this.copyToClipboard(this.$board.find("img").eq(this.focusIndex).data("url"));
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
    this.copyToClipboard(this.$board.find("img").eq(this.focusIndex).data("url"));
  }
  copyToClipboard(text){
    if(copyTextToClipboard(text)){
      $("#copyMessage").show();
      $("#copyMessage").css("opacity",0.1);
      $("#copyMessage").animate({opacity:1.0},1300,function(){$("#copyMessage").hide()})
    }
  }
}
