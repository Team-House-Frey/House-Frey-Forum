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

        if(!localStorage['session']) {
            $('#new-question').html('<article>Please login or <a href="registration.html">register</a> in order to add a question.</article>');
            return;
        }

        $('#add-question-btn').click(addQuestion)
    });

    function addQuestion() {
        var title = $('#question-title').val(),
            content = $('#question-content').val(),
            tags = $('#question-tags').val().split(/\s*,\s*/),
            category = $('#question-category').val();

        $.ajax({
            method: 'POST',
            url: 'https://api.parse.com/1/classes/Question',
            data: JSON.stringify({
                'title': title,
                'content': content,
                'tags': tags,
                'user_name': localStorage['username'],
                'user': {'__type':'Pointer','className':'_User','objectId':localStorage['userId']},
                'category': {'__type':'Pointer','className':'Category','objectId':category}
            }),
            contentType: 'application/json',
            success: questionAdded
        });
    }

    function questionAdded(question) {
        location.href = 'viewQuestion.html?questionId=' + question.objectId;
    }

    function ajaxError() {
        alert('Ajax Error');
    }
})();
