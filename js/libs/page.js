$(document).ready(function () {
    function onScrollInit(items, trigger) {
        items.each(function () {
            var osElement = $(this),
                osAnimationClass = osElement.attr('data-animation'),
                osAnimationDelay = osElement.attr('data-animation-delay');

            osElement.css({
                '-webkit-animation-delay': osAnimationDelay,
                '-moz-animation-delay': osAnimationDelay,
                'animation-delay': osAnimationDelay
            });

            var osTrigger = (trigger) ? trigger : osElement;

            osTrigger.waypoint(function () {
                osElement.addClass('animated').addClass(osAnimationClass);
            }, {
                triggerOnce: true,
                offset: '60%'
            });
        });
    }
    onScrollInit($('.os-animation'));

    //waypoint function for sticky menu
    var $trigger = $('#sticky_trigger');

    $trigger.waypoint(function (direction) {
        if (direction === 'down') {
            $('.page_header').addClass("sticky");
        }
    }, {
        offset: '1%'
    });

    $trigger.waypoint(function (direction) {
        if (direction === 'up') {
            $('.page_header').removeClass("sticky");
        }
    }, {
        offset: '1%'
    });
    var get_serch_popup = $(".cst-search-popup");
    $(".cst-search-close").click(function () {
        get_serch_popup.removeClass('opened');
    });
    $("#search-popup-link").click(function () {
        get_serch_popup.addClass('opened');
    });
});