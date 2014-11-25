(function() {
    var HEADERS = {
        'X-Parse-Application-Id': 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
        'X-Parse-REST-API-Key': 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
    };

    $.ajaxSetup({
        headers: HEADERS,
        error: ajaxError
    });

    $(function () {
        if ($.cookie('session')) {
            $('#login-container').hide();
            $('#logged-in-container').show();
            $('#welcome-user')
                .text('Welcome ' + $.cookie('username'));
        }

        $('#submit-login').click(loginUser);
        $('#logout-btn').click(logoutUser);
    });

    function loginUser() {
        var username = $('#login-username').val();
        var password = $('#login-password').val();

        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/login?username=' + username + '&password=' + password,
            success: welcomeUser,
            error: invalidLogin
        })
    }

    function welcomeUser(data) {
        // HEADERS['X-Parse-Session-Token'] = data.sessionToken; // not sure if it's needed
        $.cookie('session', data.sessionToken, {expires: 1});
        $.cookie('username', data.username, {expires: 1});

        $('#login-container').hide();
        $('#logged-in-container').show();
        $('#welcome-user')
            .text('Welcome ' + $.cookie('username'));
    }

    function logoutUser() {
        $.removeCookie('session');
        $('#welcome-user').html('<strong>Logging out ... </strong>');
        window.setTimeout('location.reload()', 2000);
    }

    function invalidLogin() {
        $('#login-container')
            .append($('<div>')
                .text('Invalid login details')
                .hide()
                .fadeIn(500)
                .fadeOut(3000));
    }

    function ajaxError() {
        alert('Ajax Error');
    }
})();