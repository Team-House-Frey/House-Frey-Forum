String.prototype.capitalize = function capitlize() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

(function () {
    var HEADERS = {
        'X-Parse-Application-Id': 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
        'X-Parse-REST-API-Key': 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
    };

    $.ajaxSetup({
        headers: HEADERS,
        error: ajaxError
    });

    $(function () {
        $('#header').load('includes/header.html', function () {
            $.getScript('scripts/login.js');
        });

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
                createMessegeBox('#dialog-message', errorResponse.error.capitalize());
            }
        });
    }

    function createMessegeBox(selector, message) {
        $(selector).text(message).dialog({
            modal: true,
            autoOpen: false,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
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

    function ajaxError() {
        alert('Ajax Error');
    }
})();
