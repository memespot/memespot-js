var LEAST_IMAGE_SIZE = {
    WIDTH: 100,
    HEIGHT: 100
};

var memespot = {
  dialog: undefined
}

function getImagesOfPage(){
  return Array.prototype.slice.call(document.images);
}

function setupClippingEvent( images ){
  images.forEach( function(image){
    if( checkImageSize( image ) ){
      addEventShowClippingButton( image );
    }
  });
}

function checkImageSize( image ){
  var image_width = Number(image.width);
  var image_height = Number(image.height);
  var min_width = Number(LEAST_IMAGE_SIZE.WIDTH);
  var min_height = Number(LEAST_IMAGE_SIZE.HEIGHT);

  if( min_width > 0 && image_width < min_width ) return false;
  if( min_height > 0 && image_height < min_height ) return false;

  return true;
}

function scrapImageAPICall(image_url, tags){
  var API_URL = "http://130.211.7.159/api/images/";
  jQuery.ajax(API_URL, {
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      "url": image_url
    })
  }).done(function(data){
    tags.split(",").forEach(function(item){
      registerKeywordAPICall(data['uuid'], item);
    });
    alert('저장완료');
    memespot.dialog.dialog("close");
  });
}

function registerKeywordAPICall(uuid, keyword){
  var API_URL = "http://130.211.7.159/api/tags/";
  jQuery.ajax(API_URL, {
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      "image": uuid,
      "text": keyword
    })
  });
}

function addEventShowClippingButton( image ){
  var clip_img = jQuery("<img>")
              .attr("src", "http://www.sullivanscrap.com/img/graphics/Icons/instagram.png")
              .css("margin", "10px")
              .css("cursor", "pointer")
              .css("position", "absolute");

  jQuery(clip_img).on("click", function(){
    memespot.dialog = jQuery("<div><fieldset><input type='hidden' id='memespot-clipping-image' value='" + image.src + "' /><label>태그(쉼표구분자)</label><input type='text' id='memespot-clipping-tags' /></fieldset></div>").dialog({
      modal: true,
      buttons: {
        "저장": function(){
          var img_url = jQuery("#memespot-clipping-image").val();
          var tags = jQuery("#memespot-clipping-tags").val();
          scrapImageAPICall(img_url, tags);
        },
        "취소": function(){
          memespot.dialog.dialog("close");
        }
      }
    });
  });

  jQuery(image).parent().on("mouseenter", function(){
    jQuery(image).before(clip_img);
  });
  jQuery(image).parent().on("mouseleave", function(){
    clip_img.remove();
  });
}


jQuery(document).ready(function(){

  var jquery_ui_style = jQuery("<link>").attr("rel", "stylesheet")
                  .attr("href", "https://code.jquery.com/ui/1.11.4/themes/black-tie/jquery-ui.css");

  var jquery = jQuery("<script>").attr("type", "text/javascript")
                  .attr("src", "https://code.jquery.com/jquery-2.1.4.min.js");

  var jquery_ui = jQuery("<script>").attr("type", "text/javascript")
                  .attr("src", "https://code.jquery.com/ui/1.11.4/jquery-ui.min.js");


  jquery_ui_style.insertAfter(jQuery(document.head));
  jquery.insertAfter(jQuery(document.head));
  jquery_ui.insertAfter(jQuery(document.head));

  var images = getImagesOfPage();
  setupClippingEvent( images );


});
