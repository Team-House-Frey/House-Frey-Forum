(function () {
    $(function () {
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
                'visitsCount': 0,
                'user': {'__type':'Pointer','className':'_User','objectId':localStorage['userId']},
                'category': {'__type':'Pointer','className':'Category','objectId':category}
            }),
            contentType: 'application/json',
            success: questionAdded
        });
    }

    function questionAdded(question) {
        var headersWithToken = JSON.parse(JSON.stringify(common.headers));
        headersWithToken['X-Parse-Session-Token'] = localStorage['session'];

        $.ajax({
            method: 'PUT',
            headers: headersWithToken,
            url: 'https://api.parse.com/1/classes/_User/' + localStorage['userId'],
            data: '{"activity":{"__op":"Increment","amount":1}}',
            contentType: 'application/json',
            success: redirectToQuestion,
            error: redirectToQuestion
        });

        function redirectToQuestion(data) {
            localStorage['activity'] = data.activity || localStorage['activity'] + 1;
            location.href = 'viewQuestion.html?questionId=' + question.objectId;
        }
    }
})();
