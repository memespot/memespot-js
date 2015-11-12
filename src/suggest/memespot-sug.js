import $ from 'jquery';

export default function run(){
  $.makeArray($("input")).forEach(inp => {
    new Suggest(inp).initialize();
  });
}

class Suggest {
  constructor(target){
    this.target = target;
    this.$target = $(target);
  }
  initialize(){
    this.$target.keyup(e => {
      console.log(e.target.value);
    });
  }
}
