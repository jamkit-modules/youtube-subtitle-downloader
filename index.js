var module = (function() {
    const webjs = require("webjs-helper"),
          srt   = require("srt-parser");

    var _id = "", _dir_path = "";
    var _callback = [], _options = {};
    
    function _on_web_loaded(data) {
        if (data["url"].startsWith("https://downsub.com")) {
            webjs.import(`${_dir_path}/downsub.js`);
            webjs.call("downloadSubtitle")
                .catch((error) => {
                    console.log(JSON.stringify(error));
                });
    
            return;
        }
    }
    
    function _on_web_start(data) {
        if (data["url"].startsWith("https://subtitle.downsub.com") || data["url"].startsWith("https://subtitle2.downsub.com")) {
            Promise.resolve()
                .then(() => {
                    if (!_options["url-only"]) {
                        return fetch(data["url"])
                            .then((response) => {
                                if (response.ok) {
                                    return response.text();
                                } else {
                                    return Promise.reject({ "status": response.status });
                                }
                            })
                            .then((text) => {
                                if (!_options["srt-only"]) {
                                    return srt.parse(text);
                                } else {
                                    return text;
                                }
                            });
                    } else {
                        return data["url"];
                    }
                })
                .then((result) => {
                    _callback[0](result);
                })
                .catch((error) => {
                    _callback[1](error);
                });
        }
    }

    function _get_object(id, handler) {
        const object = view.object(id);

        if (!object) {
            timeout(0.1, function() {
                _get_object(id, handler);
            });
        } else {
            handler(object);
        }
    }

    return {
        initialize: function(id) {
            const sbml_prefix = id.replace(".", "_");
            const dir_path = this.__ENV__["dir-path"];
            
            global[`${sbml_prefix}__on_web_loaded`] = function(data) {
                if (data["is-for-main-frame"] === "yes") {
                    webjs.initialize(`${id}.web`, "__web_bridge__");
                }
                
                _on_web_loaded(data);
            }

            global[`${sbml_prefix}__on_web_start`] = function(data) {
                _on_web_start(data);
            }

            view.object(id).action("load", { 
                "filename": `${dir_path}/web.sbml`,
                "dir-path": dir_path,
                "sbml-id": id, 
                "sbml-prefix": sbml_prefix
            });

            _id = id, _dir_path = dir_path;

            return this;
        },
        
        download: function(video_id, options = {}) {
            return new Promise((resolve, reject) => {
                const youtube_url = `https://www.youtube.com/watch?v=${video_id}`;
                const url = `https://downsub.com/?url=${encodeURIComponent(youtube_url)}`;
        
                _callback = [ resolve, reject ];
                _options = options;
        
                _get_object(`${_id}.web`, (object) => {
                    object.property({ "url": url });
                });
            });
        }
    }
})();

__MODULE__ = module;
