import $ from 'jquery';

export default function run(){
  $.makeArray($("input")).forEach(inp => {
    new Suggest(inp).initialize();
  });
}

class Suggest {
  constructor(target) {
    this.target = target;
    this.$target = $(target);
    this.on = false;
    this.$board = this.createBoard(this.$target);
    $("body").append(this.$board);
  }
  initialize() {
    this.$target.keyup(e => {
      $.getJSON("http://www.mocky.io/v2/5645f047110000a332c2be02?callback=?",this.loadSuggestData.bind(this));
    });
    this.$target.focus(e => {
      this.on = true;
      this.$board.show();
    });
    this.$target.blur(e => {
      this.on = false;
      this.$board.hide();
    });
  }
  createBoard($target){
    var pos = $target.position();
    var width = $target.outerWidth();
    var height = $target.outerHeight();
    return $("<div></div>").css({
      display: "none",
      position:"absolute",
      border: "1px solid black",
      padding: "10px",
      "background-color": "white",
      top: (pos.top + height) + "px",
      left: (pos.left) + "px"
    });
  }
  loadSuggestData(data){
    if(this.on){
      this.$board.html(data.map(image=>{return `<img src="${image}" width="100" height="100" /> `}).join(""));
    }
  }
}
