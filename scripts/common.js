var common = (function () {
    var headers = {
        'X-Parse-Application-Id': 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
        'X-Parse-REST-API-Key': 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
    };

    $.ajaxSetup({
        headers: headers,
        error: function(error) {
            console.log(error);
        }
    });

    $(function () {
        $('#header').load('includes/header.html', function () {
            if (localStorage['session']) {
                $('#welcome-user').text('Welcome ' + localStorage['firstName']);
                $('#login-container').hide();
                $('#logged-in-container').show();
                $('#registration').parent().hide();
            }

            $('#submit-login').click(loginUser);
            $('#logout-btn').click(logoutUser);
        });
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

    function logoutUser() {
        localStorage.clear();
        location.reload();
    }

    function loadCategories() {
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Category',
            success: categoriesLoaded
        });
    }

    function categoriesLoaded(data) {
        var categoryList = $('#categories').append($('<li>')
            .append($('<a>')
                .attr('href', '#')
                .text('All Categories')
                .click(loadQuestions)));

        data.results.forEach(function(category) {
            categoryList.append($('<li>')
                .append($('<a>')
                    .attr('href', '#')
                    .data('category', category)
                    .text(category.name)
                    .click(loadQuestions)));
        });
    }

    function loadQuestions() {
        var category = $(this).data('category'),
            whereClause = '';

        if (category) {
            whereClause = '{"category":{"__type":"Pointer","className":"Category","objectId":"' + category.objectId + '"}}';
        }

        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Question?order=-createdAt&where=' + whereClause,
            success: questionsLoaded
        });
    }

    function questionsLoaded(data) {
        var $questionsDiv = $('#main-content').empty();
        $('#new-answer-wrapper').empty();
        $questionsDiv.append('', $('<h1> Последни въпроси </h1>'));
        data.results.forEach(function(question) {
            var $question = $('<article>'),
                $questionTitle = $('<a>'),
                $questionDetails = $('<div>');

            $questionTitle
                .attr('href', 'viewQuestion.html?questionId=' + question.objectId)
                .data('question', question)
                .text(question.title);
            $question.append($questionTitle);

            $questionDetails
                .html('Asked on <span class="date">' + convertDate(question.createdAt) +
                '</span> by <span class="nickname">' + question.user_name + '</span>' +
                '<span class="question-visits">Visited: ' + question.visitsCount + ' times</span>')
                .addClass('meta-data');
            $question.append($questionDetails);

            $questionsDiv.append($question);
        });
    }

    function convertDate(date) {
        var dateTokens = date.substring(0, 10).split('-'),
            timeTokens = date.substring(11, 19).split(':'),
            fullHours = (Number(timeTokens[0]) + 2);
        if (fullHours >= 24) {
            fullHours -= 24;
        }

        return dateTokens[2] + '-' + dateTokens[1] + '-' + dateTokens[0] + ' at ' +
            fullHours + ':' + timeTokens[1] + ':' + timeTokens[2];
    }

    return {
        headers: headers,
        convertDate: convertDate,
        loadCategories: loadCategories,
        loadQuestions: loadQuestions
    }
})();
