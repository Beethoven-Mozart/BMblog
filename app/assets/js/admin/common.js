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
    $(".active > ul").show();
    $('.nav-collapse > ul > li > a').click(function () {
        var $tmp = $(this).parent();
        if($tmp.attr("class") == "active"){
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
        }else{
            $last.removeClass('active');
            $tmp.addClass("active");

            $last.children("ul").hide();
            $last.find('.icon-right i').attr('class','fa fa-angle-left');
            $tmp.find('.icon-right i').attr('class','fa fa-angle-down');
            $tmp.children("ul").show(200);
            $last = $tmp;
            tmp = 1;
        }
    });

    //菜单隐藏
    var tmp2 = 1;
    $(".admin-top-bars").click(function () {
        if(tmp2 == 1){
            $("#nav").hide();
            $(".main").css("width","100%");
            tmp2 = 0;
        }else{
            $("#nav").show(200);
            $(".main").css("width","76%");
            tmp2 = 1;
        }
    });
};



$('document').ready(function () {
    menu();

    //路由
    var showAuthorInfo = function () { console.log("showAuthorInfo"); };
    var listBooks = function () { console.log("listBooks"); };

    var allroutes = function() {
        var route = window.location.hash.slice(2);
        var sections = $('section');
        var section;

        section = sections.filter('[data-route=' + route + ']');

        if (section.length) {
            sections.hide(250);
            section.show(250);
        }
    };

    //
    // define the routing table.
    //
    var routes = {
        '/author': showAuthorInfo,
        '/books': listBooks
    };

    //
    // instantiate the router.
    //
    var router = Router(routes);

    //
    // a global configuration setting.
    //
    router.configure({
        on: allroutes
    });

    router.init();
});