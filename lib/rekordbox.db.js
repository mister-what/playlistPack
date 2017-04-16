"use strict";
var xml2js = require("xml2js");
var fs = require("fs");
var path = require("path");
var PlaylistModule = require("./PlaylistModule");

function Rekordbox(pathToRekordbox_xml) {
  this.textContents = fs.readFileSync(path.resolve(pathToRekordbox_xml), "utf8");
  this.library = null;
  //this.playlists = {};
  this.playlistModules = {};
  this.tracks = {};
}

Rekordbox.prototype.parseLibrary = function (cb) {
  xml2js.parseString(this.textContents, {preserveChildrenOrder: true}, function (err, result) {
    if (err) {
      return cb(err);
    }
    this.library = result;
    this.library["DJ_PLAYLISTS"]["COLLECTION"][0]["TRACK"].forEach(function (elem) {
      this.tracks[elem["$"]["TrackID"]] = elem;
    }, this);
    this.library["DJ_PLAYLISTS"]["PLAYLISTS"][0]["NODE"][0]["NODE"].forEach(function playlistIterator(parentName) {
      //console.log(playlist);
      return function (playlist) {
        if (playlist["$"]["Type"] === "0") {
          playlist["NODE"].forEach(playlistIterator(playlist["$"]["Name"].replace(/\s/gi, "_")), this);
        } else {
          var name = playlist["$"]["Name"].replace(/\s/gi, "_");
          if (parentName) {
            name = `${parentName} : ${name}`;
          }
          var playlistModule = new PlaylistModule(name);
          playlist["TRACK"].forEach(function (track) {
            playlistModule.addTrack(this.tracks[track["$"]["Key"]], track["$"]["Key"]);
          }, this);
          this.playlistModules[name] = playlistModule;
        }
      };
    }(null), this);
    cb(null, this);
  }.bind(this));
};


module.exports = Rekordbox;
