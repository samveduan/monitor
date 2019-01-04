
(function(window, document, $){
    "use strict";

    $.components.register("highlight", {
        mode: "init",
        defaults: {},
        init: function (context) {
            if (typeof hljs === "undefined") {
                return;
            }

            $('[data-plugin="highlight"]', context).each(function (i, block) {
                hljs.highlightBlock(block);
            });
        }
    });
})(window, document, jQuery);