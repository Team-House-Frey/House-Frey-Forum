(function () {
    $(function () {
        if (localStorage['session']) {
            location.href = 'index.html';
        }

        var form = $('#registrationForm');
        form.validate();
        $('#submit').click(function () {
            if(form.valid()) {
                registerUser();
            }
        });
    });

    function registerUser() {
        $.ajax({
            method: 'POST',
            url: 'https://api.parse.com/1/classes/_User',
            data: JSON.stringify({
                'username': $('#username').val(),
                'password': $('#password').val(),
                'firstName': $('#firstName').val(),
                'lastName': $('#lastName').val(),
                'email': $('#email').val(),
                'activity': 0
            }),
            contentType: 'application/json',
            success: registrationSuccessful,
            error: registrationError
        });
    }

    function registrationSuccessful() {
        $('.user-data-wrapper, #submit').hide();
        $('#registrationForm').append('', '<div class="successful-registration">Registration successful. You may log in now.</div>');
        $('.successful-registration').animate({opacity: 1}, 1500);
    }

    function registrationError(error) {
        var errorResponse = JSON.parse(error.responseText);
        $('#dialog-message').noty({
            text: errorResponse.error,
            type: 'error',
            timeout: 3000,
            killer: true
        });
    }
})();
