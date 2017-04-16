"use strict";
var xml2js = require("xml2js");
var fs = require("fs");
var path = require("path");
var PlaylistModule = require("./PlaylistModule");

function Rekordbox(pathToRekordbox_xml) {
  if (pathToRekordbox_xml) {
    this.textContents = fs.readFileSync(path.resolve(pathToRekordbox_xml), "utf8");
  } else {
    this.textContents = "";
  }
  this.library = {
    "DJ_PLAYLISTS": {
      "$": {
        "Version": "1.0.0"
      },
      "PRODUCT": [
        {
          '$': {
            "Name": "playlistPack",
            "Version": "0.0.1",
            "Company": "IBM"
          }
        }
      ],
      "COLLECTION": [{
        "$": {},
        "TRACK": []
      }],
      "PLAYLISTS": [
        {
          "NODE": [
            {
              "$": {
                "Type": "0",
                "Name": "ROOT"
              },
              "NODE": []
            }
          ]
        }
      ]
    }
  };
  var that = this;
  Object.defineProperty(this.library["DJ_PLAYLISTS"]["PLAYLISTS"][0]["NODE"][0]["$"], "Count", {
    enumerable: true,
    get: function () {
      return that.library["DJ_PLAYLISTS"]["PLAYLISTS"][0]["NODE"][0]["NODE"].length;
    }
  });
  Object.defineProperty(this.library["DJ_PLAYLISTS"]["COLLECTION"][0]["$"], "Entries", {
    enumerable: true,
    get: function () {
      return that.library["DJ_PLAYLISTS"]["COLLECTION"][0]["TRACK"].length;
    }
  });
  this.playlistModules = {};
  this.tracks = {};
  this.playlistMappings = {};
}

Rekordbox.prototype.addPlaylist = function (playlistName) {
  var playlistObj = {
    "$": {
      "Name": playlistName,
      "Type": "1",
      "KeyType": "0"
    },
    "TRACK": []
  };
  Object.defineProperty(playlistObj["$"], "Entries", {
    enumerable: true,
    get: function () {
      return playlistObj["TRACK"].length;
    }
  });
  this.playlistMappings[playlistName] = playlistObj;
  this.library["DJ_PLAYLISTS"]["PLAYLISTS"][0]["NODE"][0]["NODE"].push(this.playlistMappings[playlistName]);
};

Rekordbox.prototype.addTrack = function (track, playlistName) {
  if (!this.tracks[track["$"]["TrackID"]]) {
    this.library["DJ_PLAYLISTS"]["COLLECTION"][0]["TRACK"].push(track);
    this.tracks[track["$"]["TrackID"]] = track;
  }
  var trackNode = {
    "$": {
      "Key": track["$"]["TrackID"]
    }
  };
  this.playlistMappings[playlistName]["TRACK"].push(trackNode);
};

Rekordbox.prototype.writeLibraryXml = function (writePath) {
  var builder = new xml2js.Builder();
  this.textContents = builder.buildObject(this.library);
  if (writePath) {
    fs.writeFileSync(path.resolve(process.cwd(), writePath), this.textContents, "utf8");
  }
};

Rekordbox.prototype.parseLibrary = function (cb) {
  xml2js.parseString(this.textContents, {}, function (err, result) {
    if (err) {
      return cb(err);
    }
    this.library = result;
    //console.log(this.library["DJ_PLAYLISTS"]["PRODUCT"]);
    this.library["DJ_PLAYLISTS"]["COLLECTION"][0]["TRACK"].forEach(function (elem) {
      this.tracks[elem["$"]["TrackID"]] = elem;
    }, this);
    this.library["DJ_PLAYLISTS"]["PLAYLISTS"][0]["NODE"][0]["NODE"].forEach(function playlistIterator(parentName) {
      //console.log(playlist);
      return function (playlist) {
        var name = playlist["$"]["Name"].replace(/(\s|\.)+/gi, "_").replace(/(\n)+/gi, "");
        if (parentName) {
          name = `${parentName}.${name}`;
        }
        if (playlist["$"]["Type"] === "0") {
          playlist["NODE"].forEach(playlistIterator(name), this);
        } else {
          var playlistModule = new PlaylistModule(name);
          playlist["TRACK"] = playlist["TRACK"] || [];
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
