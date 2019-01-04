
(function(window, document, $){
    "use strict";

    $.components.register("markdown", {
        mode: "init",
        defaults: {
            autofocus: false,
            savable: false,
            language: 'zh'
        },
        init: function (context) {
            if (!$.fn.markdown) {
                return;
            }

            var defaults = this.defaults;

            $('textarea[data-plugin="markdown"]', context).each(function () {
                var options = $.extend(true, {}, defaults, $(this).data());

                $(this).markdown(options);
            });
        }
    });
})(window, document, jQuery);