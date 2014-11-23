(function() {
    var HEADERS = {
        "X-Parse-Application-Id": 'q8K93DShEidGUj4LnNjUtdc0ifunrQLgC6J1F6h3',
        "X-Parse-REST-API-Key": 'VAkyH0zeF83ZB5BHHdRs7iLXFtmOBRZqj2J5kQBF'
    };

    $.ajaxSetup({
        headers: HEADERS,
        error: ajaxError
    });

    $(function() {
        loadCategories();
        loadQuestions();
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
        var questionsDiv = $('#questions').empty();
        data.results.forEach(function(question) {
            questionsDiv.append($('<article>')
                .append($('<a>')
                    .attr('href', '#')
                    .data('question', question)
                    //.click(viewQuestion)
                    .text(question.title)));
        });
    }

    function ajaxError() {
        alert('Ajax Error');
    }
})();
