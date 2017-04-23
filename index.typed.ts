/**
 * Created by napalm on 17.04.17.
 */
"use strict";

import * as path from "path";
import * as fs from "fs";
import * as shortid from "shortid";
interface Listable {
    toTrackArray: Function;
    name: string;
}

class Track implements Listable {
    toTrackArray: Function = function () {
        return [this.trackData];
    };
    name: string;
    trackData: object;
    TrackID: string;
    constructor(trackData: object, TrackID: string) {
        this.name = trackData["name"] || shortid.generate();
        this.TrackID = TrackID;
        this.trackData = trackData;
    }
}

class playlistModule implements Listable {
    toTrackArray: Function;
    name: string;
    id: string;
    modules: object;
    tracks: object;
    basepath: string;
    playlists: Array<Listable>;
    constructor(moduleName, pathToModule) {
        if (pathToModule) {
            try {
                this.basepath = path.dirname(path.resolve(process.cwd(), pathToModule));
                //console.log(this.basepath);
                this.readFromDisk(path.basename(pathToModule));
            } catch (err) {
                console.error(err);
                throw err;
            }
        } else {
            moduleName = moduleName || `unnamed_module_${shortid.generate()}`;
            this.name = moduleName.replace(/(\s|\/)+/gi, "_").replace(/\.(module|json)/gi, "");
            this.id = `module_${this.name}_${shortid.generate()}`;
            this.modules = {};
            this.tracks = {};
        }
    }
    readFromDisk(pathToModule) {
        try {
            var loaded = JSON.parse(fs.readFileSync(path.resolve(this.basepath, pathToModule), "utf8"));
            this.name = loaded.name || `unnamed_module_${shortid.generate()}`;
            this.modules = loaded.modules || {};
            this.tracks = loaded.tracks || {};
            this.playlist = loaded.playlist || [];
            return this;
        } catch (e) {
            console.error(e);
            return this;
        }
    }
}
