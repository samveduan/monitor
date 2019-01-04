
(function(window, document, $){
    "use strict";

    $.components.register("scrollable", {
        mode: "init",
        defaults: {
            namespace: "scrollable",
            contentSelector: "> [data-role='content']",
            containerSelector: "> [data-role='container']"
        },
        init: function (context) {
            if (!$.fn.asScrollable) {
                return;
            }
            var defaults = this.defaults;

            $('[data-plugin="pageAsideScroll"]', context).each(function () {
                var options = $.extend({}, defaults, $(this).data());

                $(this).asScrollable(options);
            });
        }
    });
})(window, document, jQuery);




