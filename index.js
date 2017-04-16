/**
 * Created by jonas on 13.04.17.
 */
"use strict";

var Rekordbox = require("./lib/rekordbox.db");

var PlaylistModule = require("./lib/PlaylistModule");

module.exports = PlaylistModule;

//var playlist = new PlaylistModule(null, "./moduledPlaylist.module.json");
//var playlist = new PlaylistModule("playlistWithTwoModules");
//playlist.addTrack("track ab").addModule("./example_modules/newPlaylist.module.json").addTrack("track cool").addTrack("cool track").addModule("./example_modules/moduledPlaylist.module.json").addTrack("another cool track");
//playlist.writeToDisk();
//console.log(playlist.generate(true));

var rekordbox_xml = new Rekordbox("/Users/jonaswinzen/Git/playlistPack/rekordbox.db.xml");
rekordbox_xml.parseLibrary(function (err, rekordbox_obj) {
  if (err) {
    return console.error(err);
  }
  Object.keys(rekordbox_obj.playlistModules).forEach(function (moduleId) {
    console.log(moduleId);
  });
  //console.log(library["DJ_PLAYLISTS"]["COLLECTION"][0]["TRACK"]);
  //console.log(rekordbox_obj.tracks);
});
