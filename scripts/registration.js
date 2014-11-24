(function() {
    var HEADERS = {
        "X-Parse-Application-Id": 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
        "X-Parse-REST-API-Key": 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
    };

    $.ajaxSetup({
        headers: HEADERS,
        error: ajaxError
    });

    $(function() {
        $('#registrationForm').validate();
        $('input').keyup(validateInput);
        $('#submit').click(registerUser);
    });

    function validateInput() {
        var $this = $(this);
        $this.val($this.val()
            .replace(/[^a-zA-Z0-9_@\.]/g, function(str) {
                alert('You typed " ' + str + ' ".\n\nPlease use only letters, numbers and _.');
                return '';
            }));
    }

    function registerUser() {
        var username = $('#username').val(),
            password = $('#password').val(),
            firstName = $('#firstName').val(),
            lastName = $('#lastName').val(),
            email = $('#email').val();

        $.ajax({
            method: 'POST',
            url: 'https://api.parse.com/1/classes/_User',
            data: JSON.stringify({
                'username': username,
                'password': password,
                'firstName': firstName,
                'lastName': lastName,
                'email': email
            }),
            contentType: 'application/json',
            success: successfullyRegisterUser
        });
    }

    function successfullyRegisterUser() {
        alert('User successfully registered.');
    }

    function ajaxError() {
        alert('Ajax Error');
    }
})();
