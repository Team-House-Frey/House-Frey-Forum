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
        if (localStorage['session']) {
            $('#login-container').hide();
            $('#logged-in-container').show();
            $('#welcome-user')
                .text('Welcome ' + localStorage.getItem('firstName'));
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
        localStorage.setItem('username', data.username);
        localStorage.setItem('session', data.sessionToken);
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        localStorage.setItem('email', data.email);
        $('#registration').hide();
        $('#login-container').hide();
        $('#logged-in-container').show();
        $('#welcome-user')
            .text('Welcome ' + localStorage.getItem('firstName'));
    }

    function logoutUser() {
        localStorage.removeItem('session');
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