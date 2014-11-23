(function () {
    var PARSE_APP_ID = "q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3";
    var PARSE_REST_API_KEY = "VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF";
    var headers = {
        "X-Parse-Application-Id": PARSE_APP_ID,
        "X-Parse-REST-API-Key": PARSE_REST_API_KEY
    };

    $(function () {
        $("#registrationForm").validate();

        $('input').keyup(function() {
            var $th = $(this);
            $th.val( $th.val()
                .replace(/[^a-zA-Z0-9_@\.]/g, function(str) {
                    alert('You typed " ' + str + ' ".\n\nPlease use only letters, numbers and _.');
                return '';
            }));
        });

        $('#submit').click(registerUser);

        function registerUser(){
            var username = $('#username').val();
            var password = $('#password').val();
            var firstName = $('#firstName').val();
            var lastName = $('#lastName').val();
            var email = $('#email').val();

            $.ajax({
                method: 'POST',
                headers: headers,
                url: 'https://api.parse.com/1/classes/_User',
                data: JSON.stringify({
                    "username" : username,
                    "password" : password,
                    "firstName" : firstName,
                    "lastName" : lastName,
                    "email" : email
                }),
                contentType: 'application/json',
                success: successfullyRegisterUser,
                error: ajaxError
            });
        }

        function successfullyRegisterUser(){
            alert('User successfully registered.')
        }

        function ajaxError(){
            alert('Error')
        }
    })
})();
