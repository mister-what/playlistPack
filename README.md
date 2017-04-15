# playlistPack
Module based approach on playlists

Example usage:
```
var PlaylistModule = require("playlistpack");

var playlist = new PlaylistModule("playlistWithTwoModules");

playlist.addTrack("track ab").addModule("./newPlaylist.module.json").addTrack("track cool").addTrack("cool track").addModule("./moduledPlaylist.module.json").addTrack("another cool track");

playlist.writeToDisk();

console.log(playlist.generate(true));
```
