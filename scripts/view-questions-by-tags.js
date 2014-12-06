$(function () {
    var tagFilter = getUrlParameter('tag');

    common.loadCategories();
    getQuestionsInformationForTag(tagFilter);

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
        loadQuestions(questionsIds);
    }

    function loadQuestions(questionsIds) {
        var questionsFilter = {'$in': questionsIds};
        $.ajax({
            method: 'GET',
            url: 'https://api.parse.com/1/classes/Question?&where={"objectId":' + JSON.stringify(questionsFilter) + '}',
            success: common.visualizeQuestions
        });
    }
});