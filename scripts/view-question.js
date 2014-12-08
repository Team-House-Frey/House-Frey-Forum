(function ($) {
    var CURRENT_QUESTION_ID = common.getUrlParameter('questionId');

    $(function () {
        common.loadCategories();
        loadCurrentQuestion();
        $('#toggle-reply-btn').click(toggleReplyArea);
        $('#user-name').val(localStorage['username']);
        $('#user-email').val(localStorage['email']);
        var newAnswer = $('#new-answer').hide();
        newAnswer.validate();
        $('#save-reply-btn').click(function () {
            if(newAnswer.valid()) {
                addAnswer();
            }
        });
    });

    function loadCurrentQuestion() {
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
                    .html('Asked on <span class="date">' + common.convertDate(question.createdAt) +
                        '</span> by <span class="nickname">' + question.user_name + '</span>')
                    .addClass('meta-data'))
                .append($('<div>')
                    .text(question.content)
                    .addClass('content')));

        getTagsInformationForQuestion();
        loadAnswers();
        $('#answer-content').val('');
    }

    function loadAnswers() {
        var currentQuestionObj = {'__type': 'Pointer', 'className': 'Question', 'objectId': CURRENT_QUESTION_ID};
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Answer?order=createdAt&where={"question":' + JSON.stringify(currentQuestionObj) + '}',
            success: answersLoaded
        });
    }

    function answersLoaded(data) {
        data.results.forEach(function(answer) {
            $('#main-content')
                .append($('<article>')
                    .addClass('answer')
                    .append($('<div>')
                        .html('Replied on <span class="date">' + common.convertDate(answer.createdAt) +
                        '</span> by <span class="nickname">' + answer.user_name + '<span>')
                        .addClass('meta-data'))
                    .append($('<div>')
                        .text(answer.content)
                        .addClass('content')));
        });
    }

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
        var tagsFilter = {'$in': tagsIds};
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Tag?order=name&where={"objectId":' + JSON.stringify(tagsFilter) + '}',
            success: visualizeTags
        });
    }

    function visualizeTags(data) {
        var $tagsSpan = $('<span class="tags">').text('Tags: ');
        data.results.forEach(function (tag) {
            $('<a>').text(tag.name)
                .attr('href', 'viewQuestionsByTag.html?tag=' + tag.objectId)
                .appendTo($tagsSpan);
        });

        $('.question').append('', $tagsSpan);
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
                'ACL': {'*': {'read':true}},
                'question': {'__type': 'Pointer', 'className': 'Question', 'objectId': CURRENT_QUESTION_ID}
            }),
            contentType: 'application/json',
            success: updateActivityAndReload
        });

        function updateActivityAndReload() {
            if (localStorage['session']) {
                var headersWithToken = JSON.parse(JSON.stringify(common.headers));
                headersWithToken['X-Parse-Session-Token'] = localStorage['session'];
                $.ajax({
                    method: 'PUT',
                    headers: headersWithToken,
                    url: 'https://api.parse.com/1/classes/_User/' + localStorage['userId'],
                    data: '{"activity":{"__op":"Increment","amount":1}}',
                    contentType: 'application/json',
                    success: loadCurrentQuestion,
                    error: loadCurrentQuestion
                });
            } else {
                loadCurrentQuestion();
            }
        }
    }

    function toggleReplyArea() {
        var $newAnswer = $('#new-answer');
        if ($newAnswer.attr('data-is-hidden') === 'true') {
            $newAnswer.slideDown().attr('data-is-hidden', 'false');
        } else {
            $newAnswer.slideUp().attr('data-is-hidden', 'true');
        }
    }
})(jQuery);
