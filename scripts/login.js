(function () {
    var username,
        password;

    var HEADERS = {
        "X-Parse-Application-Id": 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
        "X-Parse-REST-API-Key": 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
    };

    $.ajaxSetup({
        headers: HEADERS,
        error: ajaxError
    });

    $(function(){
        $('#submit').click(loginUser);
    })

    function loginUser(){
        username = $('#login-username').val();
        password = $('#login-password').val();

        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/login?username=' + username + '&password=' + password,
            success: welcomeUser
        })
    }

    function welcomeUser(){
        $('#loginForm').hide();
        $('#loginContainer')
            .append($('<span>')
                .text('Welcome ' + username));
    }

    function ajaxError(){
        $('#loginContainer')
            .append($('<span>')
                .text('Invalid login details')
                .hide()
                .fadeIn(500)
                .fadeOut(3000));
    }
})();