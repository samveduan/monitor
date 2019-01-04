
(function(window, document, $){
    "use strict";

    /*global Switchery*/

    $.components.register("switchery", {
        mode: "init",
        defaults: {
            color: $.colors("purple", 600)
        },
        init: function (context) {
            if (typeof Switchery === "undefined") {
                return;
            }

            var defaults = $.components.getDefaults("switchery");

            $('[data-plugin="switchery"]', context).each(function () {
                var options = $.extend({}, defaults, $(this).data());

                new Switchery(this, options);
            });
        }
    });
})(window, document, jQuery);