(function() {
    var PARSE_APP_ID = "Zu3U44A1aWWNW4OhXnIHXWNQ7VONCUN3HD0AyvKY";
    var PARSE_REST_API_KEY = "ibxBIPfgMp63zCsDwOFqAVDs1wGgbtF1mOuxz0FR";
    var headers = {
        "X-Parse-Application-Id": PARSE_APP_ID,
        "X-Parse-REST-API-Key": PARSE_REST_API_KEY
    };

    $(function() {
        loadCategories();
    });

    function loadCategories() {
        jQuery.ajax({
            method: 'GET',
            headers: headers,
            url: 'https://api.parse.com/1/classes/Categories',
            success: categoriesLoaded,
            error: ajaxError
        });
    }

    function categoriesLoaded(data) {
        data.results.forEach(function(category) {
            $('#categories')
                .append($('<li>')
                    .text(category.Name));
        });
    }

    function ajaxError() {
        alert('Ajax Error');
    }
})();
