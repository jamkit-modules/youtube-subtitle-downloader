var module = (function() {
    const webjs = require("webjs-helper"),
          srt   = require("srt-parser");

    var _id = "", _callback = [];

    return {
        initialize: function(id) {
            webjs.initialize(id + ".web", "__$_bridge");

            global[id.replace(".", "_") + "__on_web_loaded"] = function (data) {
                this.on_web_loaded(data);
            }

            global[id.replace(".", "_") + "__on_web_start"] = function (data) {
                this.on_web_start(data);
            }

            view.object(id).action("load", { 
                "filename":this.__ENV__["dir-path"] + "/" + "web.sbml",
                "web-id":id, 
                "web-prefix":id.replace(".", "_")
            })

            _id = id;

            return this;
        },
        
        download: function(video_id) {
            return new Promise(function(resolve, reject) {
                var youtube_url = "https://www.youtube.com/watch?v=" + video_id;
                var url = "https://downsub.com/?url=" + encodeURIComponent(youtube_url);
        
                _callback = [ resolve, reject ];
        
                view.object(_id + ".web").property({ "url":url })
            })
        },
        
        on_web_loaded: function(data) {
            if (data["url"].startsWith("https://downsub.com")) {
                webjs.import(this.__ENV__["dir-path"] + "/" + "downsub.js")
                webjs.call("downloadSubtitle").then(function(result) {
                    /* Do nothing */
                }, function(error) {
                    console.log(JSON.stringify(error));
                })
        
                return;
            }
        },
        
        on_web_start: function(data) {
            if (data["url"].startsWith("https://subtitle.downsub.com")) {
                fetch(data["url"]).then(function(response) {
                    if (response.ok) {
                        response.text().then(function(text) {
                            _callback[0](srt.parse(text));
                        })
                    } else {
                        _callback[1]({ "status":response.status });
                    }
                }, function(error) {
                    _callback[1](error);
                })
        
                return;
            }
        },
    }
})();

__MODULE__ = module;
