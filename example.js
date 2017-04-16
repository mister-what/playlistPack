"use strict";
var playlistPack = require("./index");

var rekordbox_xml = new playlistPack.Rekordbox();
var playlist = new playlistPack.PlaylistModule(null, "./rekordbox_modules/modules.offbeat.happy.module.json");
rekordbox_xml.addPlaylist("offbeat_happy");
playlist.generate().forEach(function (track) {
  rekordbox_xml.addTrack(track, "offbeat_happy");
});
rekordbox_xml.writeLibraryXml("./rekordbox.db.offbeat.happy.xml");
console.log(rekordbox_xml.textContents);
