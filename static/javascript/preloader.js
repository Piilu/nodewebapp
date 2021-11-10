//Source: https://themehunt.com/blog/19-web-tips-and-tricks/159-css-preloader

(function($){
    'use strict';
      $(window).on('load', function () {
          if ($(".pre-loader").length > 0)
          {
              $(".pre-loader").fadeOut("slow");
          }
      });
  })(jQuery)