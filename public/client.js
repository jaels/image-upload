
$('#submit').on('click', function() {

    var file = $('input[type="file"]').get(0).files[0];

    var formData = new FormData();
    formData.append('file', file);


    $.ajax({
        url: '/upload',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            $("#uploaded").attr('src', data.file);
        }
    });
});
