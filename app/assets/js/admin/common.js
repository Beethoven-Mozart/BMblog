var nav = responsiveNav(".nav-collapse", { // Selector
    animate: true, // Boolean: Use CSS3 transitions, true or false
    transition: 284, // Integer: Speed of the transition, in milliseconds
    label: "Menu", // String: Label for the navigation toggle
    insert: "before", // String: Insert the toggle before or after the navigation
    customToggle: "", // Selector: Specify the ID of a custom toggle
    closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
    openPos: "relative", // String: Position of the opened nav, relative or static
    navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
    navActiveClass: "js-nav-active", // String: Class that is added to  element when nav is active
    jsClass: "js", // String: 'JS enabled' class which is added to  element
    init: function () {
    }, // Function: Init callback
    open: function () {
    }, // Function: Open callback
    close: function () {
    } // Function: Close callback
});

//菜单
var menu = function () {
    var tmp = 1;
    var $last = $('.active');
    $(".active > .son").show();
    $('.nav-collapse > ul > li').click(function () {
        if($(this).attr("class") != "active"){
            $('.nav-collapse > ul > li').removeClass('active');
            $(this).addClass("active");

            $last.children("ul").hide();
            $last.find('.icon-right i').attr('class','fa fa-angle-left');
            $(this).find('.icon-right i').attr('class','fa fa-angle-down');
            $(this).children("ul").show(200);
            $last = $(this);
            tmp = 1;
        }else{
            var $tmp = $(this);
            if(tmp == 1){
                $tmp.children("ul").hide(200,function () {
                    $tmp.find('.icon-right i').attr('class','fa fa-angle-left');
                });
                tmp = 2;
            }else{
                $tmp.find('.icon-right i').attr('class','fa fa-angle-down');
                $tmp.children("ul").show(200);
                tmp = 1;
            }
        }
    });
};

$('document').ready(function () {
    menu();
    
});