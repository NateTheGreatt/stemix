$(function() {

    var showInfo = function(message) {
        $('div.progress').hide();
        $('strong.message').text(message);
        $('div.alert').show();
    };

    $('input[type="submit"]').on('click', function(evt) {
        //stop the form from submitting
        evt.preventDefault();

        $('div.progress').show();
        var formData = new FormData();
        var file = document.getElementById('songFile').files[0];
        formData.append('songFile', file);
        formData.append('songName', $('#songName').val());

        var xhr = new XMLHttpRequest();

        xhr.open('post', '/upload', true);

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;
                $('div.progress div.bar').css('width', percentage + '%');
            }
        };

        xhr.onerror = function(e) {
            showInfo('An error occurred while submitting the form. Maybe your file is too big');
        };

        xhr.onload = function() {
            showInfo(this.statusText);
        };

        xhr.send(formData);

    });

});