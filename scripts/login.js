(function() {
    var USERNAME,
        PASSWORD,
        HEADERS = {
        'X-Parse-Application-Id': 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
        'X-Parse-REST-API-Key': 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
    };

    $.ajaxSetup({
        headers: HEADERS,
        error: ajaxError
    });

    $(function() {
        $('#submit-login').click(loginUser);
    });

    function loginUser() {
        USERNAME = $('#login-username').val();
        PASSWORD = $('#login-password').val();

        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/login?username=' + USERNAME + '&password=' + PASSWORD,
            success: welcomeUser,
            error: invalidLogin
        })
    }

    function welcomeUser() {
        $('#login-form').hide();
        $('#login-container')
            .append($('<span>')
                .text('Welcome ' + USERNAME));
    }

    function invalidLogin() {
        $('#login-container')
            .append($('<span>')
                .text('Invalid login details')
                .hide()
                .fadeIn(500)
                .fadeOut(3000));
    }

    function ajaxError() {
        alert('Ajax Error');
    }
})();