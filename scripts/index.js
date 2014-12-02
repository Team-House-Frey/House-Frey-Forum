(function () {
    $(function () {
        $('#header').load('includes/header.html', function () {
            $.getScript('scripts/login.js');
        });
        $.getScript('scripts/common.js', function () {
            loadCategories();
            loadQuestions();
        });
    });
})();
