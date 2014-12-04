(function () {
    var CURRENT_QUESTION_ID = getUrlParameter('questionId'),
        HEADERS = {
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
        $.getScript('scripts/common.js', function () {
            loadCategories();
        });
        loadQuestion();
        $('#user-name').val(localStorage['username']);
        $('#user-email').val(localStorage['email']);
        $('#toggle-reply-btn').click(toggleReplyArea);
        $('#save-reply-btn').click(addAnswer);
        $('#new-answer').hide();
    });

    function loadQuestion() {
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Question?where={"objectId":"' + CURRENT_QUESTION_ID + '"}',
            success: questionLoaded
        });
    }

    function questionLoaded(data) {
        var question = data.results[0];

        $.ajax({
            method: 'PUT',
            url: 'https://api.parse.com/1/classes/Question/' + question.objectId,
            data: '{"visitsCount":{"__op":"Increment","amount":1}}',
            contentType: 'application/json',
            error: undefined
        });

        $('title').text(question.title);
        $('#main-content')
            .empty()
            .append($('<h1>').text(question.title))
            .append($('<article>')
                .addClass('question')
                .append($('<div>')
                    .html('Asked on <span class="date">' + convertDate(question.createdAt) +
                        '</span> by <span class="nickname">' + question.user_name + '</span>' +
                        '<span class="question-tags">Tags: ' + question.tags  + '</span>')
                    .addClass('meta-data'))
                .append($('<div>')
                    .text(question.content)
                    .addClass('content')));

        getTagsInformationForQuestion();
        loadAnswers();
    }

    function loadAnswers() {
        var currentQuestionObj = {'__type': 'Pointer', 'className': 'Question', 'objectId': CURRENT_QUESTION_ID};
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Answer?order=createdAt&where={"question":' + JSON.stringify(currentQuestionObj) + '}',
            success: answersLoaded
        });
    }

    // Functions for loading tags
    function getTagsInformationForQuestion() {
        var currentQuestionObj = {'__type': 'Pointer', 'className': 'Question', 'objectId': CURRENT_QUESTION_ID};
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/QuestionsByTags?where={"question":' + JSON.stringify(currentQuestionObj) + '}',
            success: getTagsIds
        });
    }

    function getTagsIds(data) {
        var tagsIds = [];
        data.results.forEach(function (tag) {
            tagsIds.push(tag.tag.objectId);
        });
        loadTags(tagsIds);
    }

    function loadTags(tagsIds) {
        var tagsFilter = {"$in": tagsIds};
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Tag?order=name&where={"objectId":' + JSON.stringify(tagsFilter) + '}',
            success: visualizeTags
        });
    }

    function visualizeTags(data) {
        var tags = data.results;
        var $tagsSpan = $('<span class="tags">').text('Tags: ');
        var $link;

        tags.forEach(function (tag) {
            $link = $('<a>').text(tag.name).attr('href', '#');
            $tagsSpan.append($link);
        });

        $('.question').append('', $tagsSpan);
    }

    function answersLoaded(data) {
        data.results.forEach(function(answer) {
            $('#main-content')
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

        if (localStorage['session']) {
            HEADERS['X-Parse-Session-Token'] = localStorage['session'];

            $.ajax({
                method: 'PUT',
                url: 'https://api.parse.com/1/classes/_User/' + localStorage['userId'],
                data: '{"activity":{"__op":"Increment","amount":1}}',
                contentType: 'application/json',
                success: activityUpdated,
                error: activityUpdated
            });

            function activityUpdated(data) {
                localStorage['activity'] = data.activity || localStorage['activity'] + 1;
            }
        }

        $.ajax({
            method: 'POST',
            url: 'https://api.parse.com/1/classes/Answer',
            data: JSON.stringify({
                'content': content,
                'user_email': email,
                'user_name': user_name,
                'ACL': {'*': {'read':true}},
                'question': {'__type': 'Pointer', 'className': 'Question', 'objectId': CURRENT_QUESTION_ID}
            }),
            contentType: 'application/json',
            success: loadQuestion
        });
    }

    function ajaxError() {
        alert('Ajax Error');
    }

    function toggleReplyArea() {
        var  $newAnswer = $('#new-answer');
        if ($newAnswer.attr('data-is-hidden') === 'true') {
            $newAnswer.slideDown();
            $newAnswer.attr('data-is-hidden', 'false');
        } else {
            $newAnswer.slideUp();
            $newAnswer.attr('data-is-hidden', 'true');
        }
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
