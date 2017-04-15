/**
 * Created by jonas on 13.04.17.
 */
"use strict";
var fs = require("fs");
var path = require("path");
var shortid = require('shortid');

function PlaylistModule(moduleName, pathToModule) {
  if (pathToModule) {
    try {
      this.readFromDisk(pathToModule);
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
    this.playlist = [];
  }
}

PlaylistModule.prototype.addTrack = function (trackName) {
  var trackId = `track_${shortid.generate()}`;
  this.tracks[trackId] = {
    name: trackName,
    type: "track"
  };
  this.playlist.push(trackId);
  return this;
};

PlaylistModule.prototype.addModule = function (modulePath) {
  try {
    var module = new PlaylistModule(null, modulePath);
    if (!module.id) {
      module.id = `module_${module.name}_${shortid.generate()}`;
      module.writeToDisk(modulePath);
      delete require.cache[modulePath];
    }
    var moduleId = module.id;
    this.modules[moduleId] = {
      name: module.name || "unnamed module",
      path: modulePath
    };
    this.playlist.push(moduleId);
  } catch (e) {
    console.error(e);
  }
  return this;
};

PlaylistModule.prototype.writeToDisk = function (modulePath) {
  modulePath = modulePath || path.resolve(process.cwd(), `${this.name}.module.json`);
  var filepath = path.resolve(process.cwd(), modulePath);
  var contents = JSON.stringify(this, null, 2);
  fs.writeFileSync(filepath, contents, "utf8");
  return this;
};

PlaylistModule.prototype.readFromDisk = function (pathToModule) {
  if (!fs.existsSync(pathToModule)) {
    console.error(`Error loading module. ${pathToModule} not found.`);
    return this;
  }
  try {
    var loaded = JSON.parse(fs.readFileSync(pathToModule, "utf8"));
    this.name = loaded.name || `unnamed_module_${shortid.generate()}`;
    this.modules = loaded.modules || {};
    this.tracks = loaded.tracks || {};
    this.playlist = loaded.playlist || [];
    return this;
  } catch (e) {
    console.error(e);
    return this;
  }
};

PlaylistModule.prototype.generate = function (asString) {
  var playlist = [];
  var that = this;
  this.playlist.forEach(function (playlistItem) {
    if (playlistItem.startsWith("track_")) {
      playlist.push(that.tracks[playlistItem].name);
    } else if (playlistItem.startsWith("module_")) {
      var module = new PlaylistModule(null, that.modules[playlistItem].path);
      playlist = playlist.concat(module.generate());
    }
  });
  if (asString) {
    var playlistString = "";
    playlist.forEach(function (entry, index) {
      playlistString = playlistString + (index + 1) + ". " + entry + "\n";
    });
    return playlistString;
  } else {
    return playlist;
  }
};

module.exports = PlaylistModule;

//var playlist = new PlaylistModule(null, "./example_modules/moduledPlaylist.module.json");
//var playlist = new PlaylistModule("playlistWithTwoModules");
//playlist.addTrack("track ab").addModule("./example_modules/newPlaylist.module.json").addTrack("track cool").addTrack("cool track").addModule("./example_modules/moduledPlaylist.module.json").addTrack("another cool track");
//playlist.writeToDisk();
//console.log(playlist.generate(true));
