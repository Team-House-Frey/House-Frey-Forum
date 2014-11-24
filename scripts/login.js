(function() {
    var HEADERS = {
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
        if(HEADERS['X-Parse-Session-Token']){
            $('#login-form').hide();
            $('#registration').hide();
        }

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
        HEADERS['X-Parse-Session-Token'] = data.sessionToken;
        $('#login-form').hide();
        $('#registration').hide();
        $('#login-container')
            .append($('<span>')
                .text('Welcome ' + data.username));
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