YouTubeSubtitleDownloader = (function() {
    return {
        _callback: []
    }
})();

YouTubeSubtitleDownloader.webjs = require("webjs-helper").initialize("YouTubeSubtitleDownloader.web", "__$_bridge");
YouTubeSubtitleDownloader.srt   = require("srt-parser");

YouTubeSubtitleDownloader.initialize = function(id) {
    view.object(id).property({ 
        "filename":this.__ENV__["dir-path"] + "/" + "web.sbml"
    })

    return this;
}

YouTubeSubtitleDownloader.download = function(video_id) {
    var self = this;

    return new Promise(function(resolve, reject) {
        var youtube_url = "https://www.youtube.com/watch?v=" + video_id;
        var url = "https://downsub.com/?url=" + encodeURIComponent(youtube_url);

        self._callback = [ resolve, reject ]

        view.object("YouTubeSubtitleDownloader.web").property({ "url":url })
    })
}

YouTubeSubtitleDownloader.on_web_loaded = function(data) {
    if (data["url"].startsWith("https://downsub.com")) {
        this.webjs.import(this.__ENV__["dir-path"] + "/" + "downsub.js")
        this.webjs.call("downloadSubtitle").then(function(result) {
            /* Do nothing */
        }, function(error) {
            console.log(JSON.stringify(error));
        })

        return
    }
}

YouTubeSubtitleDownloader.on_web_start = function(data) {
    var self = this;

    if (data["url"].startsWith("https://subtitle.downsub.com")) {
        fetch(data["url"]).then(function(response) {
            if (response.ok) {
                response.text().then(function(text) {
                    self._callback[0](self.srt.parse(text));
                })
            } else {
                self._callback[1]({ "status":response.status });
            }
        }, function(error) {
            self._callback[1](error);
        })

        return
    }
}

/* external interface */

YouTubeSubtitleDownloader__on_web_loaded = function(data) {
    YouTubeSubtitleDownloader.on_web_loaded(data);
}

YouTubeSubtitleDownloader__on_web_start = function(data) {
    YouTubeSubtitleDownloader.on_web_start(data);
}

__MODULE__ = YouTubeSubtitleDownloader;
