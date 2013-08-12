function initAudio (url) {

    var audioReady = function() {

        var audio = this;

        var $playPauseBtn = $('#play-pause'),
            $playPauseIcon = $playPauseBtn.find('i');

        var $stopBtn = $('#stop'),
            $stopIcon = $stopBtn.find('i');

        audio.load(url);
        $('#time').html(formatTime(audio.position)+' / '+formatTime(audio.duration));

        $playPauseBtn.click(function() {audio.playPause()});

        $('#stop').click(function() {
            audio.seek(0);
            audio.pause();
        });

        audio.on('play', function() {
            $playPauseIcon.removeClass('icon-play');
            $playPauseIcon.addClass('icon-pause');
        });

        audio.on('pause', function() {
            $playPauseIcon.removeClass('icon-pause');
            $playPauseIcon.addClass('icon-play');
        });

        audio.on('timeupdate', function(position,duration) {
            $('#time').html(formatTime(position)+' / '+formatTime(duration));
            var pos = position/duration*100;
            $('.audio').css('width', pos+'%');
        }, audio);

        audio.on('progress', function(percent) {

        }, audio);


        var seekPoint = 0;

        $('.progress').click(function(e){
            var x = e.pageX - this.offsetLeft;
            seekPoint = x/$(this).width();
            $('.audio').css('width', seekPoint*100+'%');
            audio.seek(seekPoint*audio.duration);
        });
    }

    var formatTime = function (seconds) {
        var hours = parseInt(seconds / 3600, 10) % 24;
        var minutes = parseInt(seconds / 60, 10) % 60;
        var secs = parseInt(seconds % 60, 10);
        var result, fragment = (minutes < 10 ? "0" + minutes : minutes) + ":" + (secs  < 10 ? "0" + secs : secs);
        if (hours > 0) {
            result = (hours < 10 ? "0" + hours : hours) + ":" + fragment;
        } else {
            result = fragment;
        }
        return result;
    }

    var audio5js = new Audio5js({
        format_time: false,
        ready: audioReady
    });

}