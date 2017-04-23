/**
 * Created by napalm on 17.04.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var shortid = require("shortid");
var Track = (function () {
    function Track(trackData, TrackID) {
        this.toTrackArray = function () {
            return [this.trackData];
        };
        this.name = trackData["name"] || shortid.generate();
        this.TrackID = TrackID;
        this.trackData = trackData;
    }
    return Track;
}());
var playlistModule = (function () {
    function playlistModule(moduleName, pathToModule) {
        if (pathToModule) {
            try {
                this.basepath = path.dirname(path.resolve(process.cwd(), pathToModule));
                //console.log(this.basepath);
                this.readFromDisk(path.basename(pathToModule));
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        }
        else {
            moduleName = moduleName || "unnamed_module_" + shortid.generate();
            this.name = moduleName.replace(/(\s|\/)+/gi, "_").replace(/\.(module|json)/gi, "");
            this.id = "module_" + this.name + "_" + shortid.generate();
            this.modules = {};
            this.tracks = {};
        }
    }
    playlistModule.prototype.readFromDisk = function (pathToModule) {
        try {
            var loaded = JSON.parse(fs.readFileSync(path.resolve(this.basepath, pathToModule), "utf8"));
            this.name = loaded.name || "unnamed_module_" + shortid.generate();
            this.modules = loaded.modules || {};
            this.tracks = loaded.tracks || {};
            this.playlist = loaded.playlist || [];
            return this;
        }
        catch (e) {
            console.error(e);
            return this;
        }
    };
    return playlistModule;
}());
//# sourceMappingURL=index.typed.js.map