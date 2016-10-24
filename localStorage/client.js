(function() {
    var area = $('#textarea');
    if (localStorage.getItem('text')) {
        area.val(localStorage.getItem('text'));
    }
    area.on('input', function() {
        var value = $('#textarea').val();
        try {
            localStorage.setItem('text', value);
        } catch (e) {
            console.log('What a nuisance');
        }

    });
})();
