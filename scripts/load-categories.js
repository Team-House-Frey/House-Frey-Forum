var HEADERS = {
    'X-Parse-Application-Id': 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
    'X-Parse-REST-API-Key': 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
};

$.ajaxSetup({
    headers: HEADERS,
    error: ajaxError
});

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
        url: 'https://api.parse.com/1/classes/Question//?where=' + whereClause,
        success: questionsLoaded
    });
}

function questionsLoaded(data) {
    var $questionsDiv = $('#main-content').empty();
    $('#new-answer-wrapper').empty();
    $questionsDiv.append('', $('<h1> Последни въпроси </h1>'));

    data.results.sort(questionSorter).forEach(function(question) {
        var $question = $('<article>');
        var $questionTitle = $('<a>');
        var $questionDetails = $('<div>');

        $questionTitle
            .attr('href', 'viewQuestion.html?questionId=' + question.objectId)
            .data('question', question)
            .text(question.title);
        $question.append($questionTitle);

        $questionDetails
            .html('Asked on <span class="date">' + convertDate(question.createdAt) +
                '</span> by <span class="nickname">' + question.user_name + '<span>')
            .addClass('meta-data');
        $question.append($questionDetails);

        $questionsDiv.append($question);
    });

    function questionSorter(a, b){
        var firstDate = Date.parse(a.createdAt);
        var secondDate = Date.parse(b.createdAt);
        return firstDate < secondDate;
    }

    function convertDate(date) {
        var dateTokens = date.substring(0, 10).split('-'),
            timeTokens = date.substring(11, 19).split(':');
        return dateTokens[2] + '-' + dateTokens[1] + '-' + dateTokens[0] + ' at ' +
            (Number(timeTokens[0]) + 2) + ':' + timeTokens[1] + ':' + timeTokens[2];
    }
}

function ajaxError() {
    alert('Ajax Error');
}
