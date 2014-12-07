(function ($) {
    $(function () {
        var tagFilter = common.getUrlParameter('tag');
        common.loadCategories();
        getQuestionsInformationForTag(tagFilter);
    });

    function getQuestionsInformationForTag(tagFilter) {
        var currentTagObj = {'__type': 'Pointer', 'className': 'Tag', 'objectId': tagFilter};
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/QuestionsByTags?where={"tag":' + JSON.stringify(currentTagObj) + '}',
            success: getQuestionsIds
        });
    }

    function getQuestionsIds(data) {
        var questionsIds = [];
        data.results.forEach(function (question) {
            questionsIds.push(question.question.objectId);
        });

        loadQuestionsByIds(questionsIds);
    }

    function loadQuestionsByIds(questionsIds) {
        var questionsFilter = {'$in': questionsIds};
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Question?&where={"objectId":' + JSON.stringify(questionsFilter) + '}',
            success: common.visualizeQuestions
        });
    }
})(jQuery);
