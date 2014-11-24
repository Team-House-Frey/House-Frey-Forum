(function() {
    var CURRENT_QUESTION_ID = getUrlParameter('questionId'),
        HEADERS = {
        'X-Parse-Application-Id': 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
        'X-Parse-REST-API-Key': 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
    };

    $.ajaxSetup({
        headers: HEADERS,
        error: ajaxError
    });

    $(function() {
        $('#header').load('header.html', function() {
            $.getScript('scripts/login.js');
        });
        loadQuestion();
        $('#toggle-reply-btn').click(toggleReplyArea);
        $('#save-reply-btn').click(addAnswer);
    });

    function loadQuestion() {
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Question',
            data: JSON.stringify({
                'where':{'objectId':CURRENT_QUESTION_ID}
            }),
            success: questionLoaded
        });
    }

    function questionLoaded(data) {
        var question = data.results[0];
        $('title').text(question.title);
        $('#question')
            .empty()
            .append($('<h2>').text(question.title))
            .append($('<article>')
                .addClass('question')
                .append($('<div>')
                    .html('Asked on <span class="date">' + convertDate(question.createdAt) +
                        '</span> by <span class="nickname">' + question.user_name + '<span>')
                    .addClass('meta-data'))
                .append($('<div>')
                    .text(question.content)
                    .addClass('content')));

        loadAnswers();
    }

    function loadAnswers() {
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Answer',
            data: JSON.stringify({
                'where':{'question':"{__type':'Pointer','className':'Question','objectId':" + CURRENT_QUESTION_ID + "}"}
            }),
            success: answersLoaded
        });
    }

    function answersLoaded(data) {
        data.results.forEach(function(answer) {
            $('#question')
                .append($('<article>')
                    .addClass('answer')
                    .append($('<div>')
                        .html('Replied on <span class="date">' + convertDate(answer.createdAt) +
                        '</span> by <span class="nickname">' + answer.user_name + '<span>')
                        .addClass('meta-data'))
                    .append($('<div>')
                        .text(answer.content)
                        .addClass('content')));
        });
    }

    function addAnswer() {
        var user_name = $('#user-name').val(),
            email = $('#user-email').val(),
            content = $('#answer-content').val();

        $.ajax({
            method: 'POST',
            url: 'https://api.parse.com/1/classes/Answer',
            data: JSON.stringify({
                'content': content,
                'user_email': email,
                'user_name': user_name,
                'question': {'__type':'Pointer','className':'Question','objectId':CURRENT_QUESTION_ID}
            }),
            contentType: 'application/json',
            success: loadQuestion
        });
    }

    function ajaxError() {
        alert('Ajax Error');
    }

    function toggleReplyArea() {
        $('#new-answer-form').toggle(600);
    }

    function convertDate(date) {
        var dateTokens = date.substring(0, 10).split('-'),
            timeTokens = date.substring(11, 19).split(':');
        return dateTokens[2] + '-' + dateTokens[1] + '-' + dateTokens[0] + ' at ' +
            (Number(timeTokens[0]) + 2) + ':' + timeTokens[1] + ':' + timeTokens[2];
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }
})();
