var module = (function() {
    const webjs = require("webjs-helper"),
          srt   = require("srt-parser");

    var _id = "", _callback = [];
    var _dir_path = "";

    function _on_web_loaded(data) {
        if (data["url"].startsWith("https://downsub.com")) {
            webjs.import(_dir_path + "/downsub.js");
            webjs.call("downloadSubtitle").then(function(result) {
                /* Do nothing */
            }, function(error) {
                console.log(JSON.stringify(error));
            })
    
            return;
        }
    }
    
    function _on_web_start(data) {
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
    }

    return {
        initialize: function(id) {
            var web_prefix = id.replace(".", "_");
            var dir_path = this.__ENV__["dir-path"];
            
            global[web_prefix + "__on_web_loaded"] = function (data) {
                _on_web_loaded(data);
            }

            global[web_prefix + "__on_web_start"] = function (data) {
                _on_web_start(data);
            }

            webjs.initialize(id + ".web", "__$_bridge");
            view.object(id).action("load", { 
                "filename":dir_path + "/web.sbml",
                "web-id":id, 
                "web-prefix":web_prefix
            });

            _id = id, _dir_path = dir_path;

            return this;
        },
        
        download: function(video_id) {
            return new Promise(function(resolve, reject) {
                var youtube_url = "https://www.youtube.com/watch?v=" + video_id;
                var url = "https://downsub.com/?url=" + encodeURIComponent(youtube_url);
        
                _callback = [ resolve, reject ];
        
                view.object(_id + ".web").property({ "url":url })
            })
        }
    }
})();

__MODULE__ = module;
