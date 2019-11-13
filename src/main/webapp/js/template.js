// Get the modal
var modalLogin = $('#idLogin')[0];
var modalSignIn = $('#idSignIn')[0];
var loginResponse = $('#loginResponse')[0];
var username;

var $animation_elements = $('.animation-element');
var $window = $(window);


// When the user clicks anywhere outside of the modal, close it
$(document).click(function(event) {
    if (event.target == modalLogin) {
        modalLogin.style.display = "none";
    }
    else if (event.target == modalSignIn) {
        modalSignIn.style.display = "none";
    }
});

function checkIfInView() {
    var window_height = $window.height();
    var window_top_position = $window.scrollTop();
    var window_bottom_position = (window_top_position + window_height);

    $.each($animation_elements, function() {
        var $element = $(this);
        var element_height = $element.outerHeight();
        var element_top_position = $element.offset().top;
        var element_bottom_position = (element_top_position + element_height);

        //check to see if this current container is within viewport
        if ((element_bottom_position >= window_top_position) &&
            (element_top_position <= window_bottom_position)) {
            $element.addClass('in-view');
        } else {
            $element.removeClass('in-view');
        }
    });
}

$().ready(function() {
    $("#but_submit").click(function () {
        username = $("#txt_uname").val().trim();
        var password = $("#txt_pwd").val().trim();

        if (username != "" && password != "") {
            $.ajax({
                url: 'http://fenw.etsisi.upm.es:10000/users/login',
                type: 'get',
                data: {username: username, password: password},
                success: function (response) {
                    if ($("#rememberLogin").checked) {
                        localStorage.auth = response;
                        localStorage.user = username;
                        location.reload();
                    }
                    else {
                        sessionStorage.auth = response;
                        sessionStorage.user = username;
                        location.reload();
                    }
                },
                error: function () {
                    loginResponse.innerText = "Usuario y/o contraseña incorrectos"
                }
            });
        }
    });
    checkLocalStorage();
});

function checkLocalStorage() {
    if (localStorage.auth)
        username = localStorage.user;
    else if (sessionStorage.auth)
        username = sessionStorage.user;

    if (localStorage.auth || sessionStorage.auth) {
        $('#userButtons')
            .html("<div class='container'><p id='textUser' style='color:white'>Hola, <b>"+username+"</b></p>\n" +
            "<button type= 'button' class='btn btn-primary' onclick='removeSession()' ><i class='fas fa-user'></i>Logout</button></div>\n");

        if (window.location.pathname == "/reservas.html") {
            $('#navbarList')
                .append("<li class=\"nav-item mx-0 mx-lg-1\">\n" +
                    "<a class=\"nav-link active py-3 px-0 px-lg-3 rounded js-scroll-trigger\" href=\"reservas.html\">Reservas</a>\n" +
                    "</li>")
        }
        else {
            $('#navbarList')
                .append("<li class=\"nav-item mx-0 mx-lg-1\">\n" +
                    "<a class=\"nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger\" href=\"reservas.html\">Reservas</a>\n" +
                    "</li>")
        }
    }

}

function removeSession(){
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('user');
    location.reload();
}

$window.on('scroll resize', checkIfInView);
$window.trigger('scroll');