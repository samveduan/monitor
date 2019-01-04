
(function (document, window, $) {
    'use strict';

    var magnificPopupOptions=$.po('magnificPopup', {
        type: 'image',
        closeOnContentClick: true,
        mainClass: 'mfp-fade',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1]
        }
    });

    $('.wb-search').magnificPopup(magnificPopupOptions);

})(document, window, jQuery);
