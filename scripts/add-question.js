(function ($) {
    $(function () {
        var newQuestion = $('#new-question');

        if (!localStorage['session']) {
            newQuestion.html('<article>Please login or <a href="registration.html">register</a> in order to add a question.</article>');
            return;
        }

        newQuestion.validate();
        $('#add-question-btn').click(function () {
            if (newQuestion.valid()) {
                addQuestion();
            }
        });
    });

    function addQuestion() {
        var title = $('#question-title').val(),
            content = $('#question-content').val(),
            category = $('#question-category').val();

        $.ajax({
            method: 'POST',
            url: 'https://api.parse.com/1/classes/Question',
            data: JSON.stringify({
                'title': title,
                'content': content,
                'user_name': localStorage['username'],
                'visitsCount': 0,
                'user': {'__type':'Pointer','className':'_User','objectId':localStorage['userId']},
                'category': {'__type':'Pointer','className':'Category','objectId':category}
            }),
            contentType: 'application/json',
            success: processAddingTagsToQuestion
        });
    }

    function processAddingTagsToQuestion(question) {
        var tagsToBeAdded = $('#question-tags').val().split(/\s*,\s*/),
            tagsFilter = {'$in': tagsToBeAdded};

        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Tag?where={"name":' + JSON.stringify(tagsFilter) + '}',
            success: tagsFound
        });

        function tagsFound(data) {
            var databaseTagsMatches = {};
            data.results.forEach(function (tag) {
                databaseTagsMatches[tag.name] = tag.objectId;
            });

            tagsToBeAdded.forEach(function (tagName) {
                if (databaseTagsMatches.hasOwnProperty(tagName)) {
                    addExistingTagToQuestion(question, databaseTagsMatches[tagName]);
                } else {
                    createNewTagAndAddToQuestion(question, tagName);
                }
            });

            updateActivityAndRedirect(question);
        }
    }

    function createNewTagAndAddToQuestion(question, tagName) {
        $.ajax({
            method: 'POST',
            url: 'https://api.parse.com/1/classes/Tag',
            data: JSON.stringify({
                'name': tagName
            }),
            contentType: 'application/json',
            success: tagCreated
        });

        function tagCreated(tag) {
            addExistingTagToQuestion(question, tag.objectId);
        }
    }

    function addExistingTagToQuestion(question, tag) {
        $.ajax({
            method: 'POST',
            url: 'https://api.parse.com/1/classes/QuestionsByTags',
            data: JSON.stringify({
                'tag': {'__type':'Pointer','className':'Tag','objectId': tag},
                'question': {'__type':'Pointer','className':'Question','objectId': question.objectId}
            }),
            contentType: 'application/json'
        });
    }

    function updateActivityAndRedirect(question) {
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

        function redirectToQuestion() {
            location.href = 'viewQuestion.html?questionId=' + question.objectId;
        }
    }
})(jQuery);
