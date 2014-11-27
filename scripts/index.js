(function () {
    $(function () {
        $('#header').load('includes/header.html', function () {
            $.getScript('scripts/login.js');
        });
        $.getScript('scripts/load-categories.js', function () {
            loadCategories();
            loadQuestions();
        });
    });
})();
