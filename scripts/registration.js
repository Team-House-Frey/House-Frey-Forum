(function () {
    $(function () {
        if (localStorage['session']) {
            location.href = 'index.html';
        }

        var form = $('#registrationForm');
        form.validate();
        $('input').keyup(validateInput);
        $('#submit').click(function () {
            if(form.valid()) {
                registerUser();
            }
        });
    });

    function validateInput() {
        var $this = $(this);
        $this.val($this.val()
            .replace(/[^a-zA-Z0-9!_@\.]/g, function(str) {
                alert('You typed " ' + str + ' ".\n\nPlease use only latin letters, numbers and some of the allowed symbols ! @ _ .');
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
                'email': email,
                'activity': 0
            }),
            contentType: 'application/json',
            success: registrationSuccessful,
            error: function (error) {
                var errorResponse = JSON.parse(error.responseText);
                createMessageBox('#dialog-message', errorResponse.error);
            }
        });
    }

    function createMessageBox(selector, message) {
        $(selector).text(message).dialog({
            modal: true,
            autoOpen: false,
            buttons: {
                Ok: function() {
                    $(this).dialog( "close" );
                }
            }
        }).dialog('open');
    }

    function registrationSuccessful() {
        $('.user-data-wrapper, #submit').hide();
        $('#registrationForm')
            .append('', '<div class="successful-registration">Registration successful. You may log in now.</div>');
        $('.successful-registration').animate({opacity: 1}, 1500);
    }
})();
