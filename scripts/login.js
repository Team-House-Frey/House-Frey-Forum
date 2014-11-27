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
            $('#logged-in-container').css('display','inline-block');
            $('#welcome-user').text('Welcome ' + localStorage['firstName']);
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
            success: loginSuccessful,
            error: invalidLogin
        })
    }

    function loginSuccessful(data) {
        localStorage['session'] = data.sessionToken;
        localStorage['userId'] = data.objectId;
        localStorage['username'] = data.username;
        localStorage['firstName'] = data.firstName;
        localStorage['lastName'] = data.lastName;
        localStorage['email'] = data.email;
        localStorage['activity'] = data.activity;
        location.reload();
    }

    function logoutUser() {
        localStorage.clear();
        location.reload();
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
