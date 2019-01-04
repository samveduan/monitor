var YqIframeHeight = $(document).height()-$(".navbar-header").height()-$(".contabs-scroll").height()-$("#site-footer").height()-51;
$("#yq-iframe").height(YqIframeHeight);

$(window).resize(function() {
	var YqIframeHeight = $(document).height()-$(".navbar-header").height()-$(".contabs-scroll").height()-$("#site-footer").height()-51;
	$("#yq-iframe").height(YqIframeHeight);
});