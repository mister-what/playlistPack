# playlistPack
Module based approach on playlists

Example usage:
```
var playlistpack = require("playlistpack");
var rekordbox_xml = new playlistpack.Rekordbox("/Users/jonaswinzen/Git/playlistPack/rekordbox.db.xml");
rekordbox_xml.parseLibrary(function (err, rekordbox_obj) {
  if (err) {
    return console.error(err);
  }
  Object.keys(rekordbox_obj.playlistModules).forEach(function (moduleId) {
    if (moduleId.indexOf("module") !== -1) {
      rekordbox_obj.playlistModules[moduleId].writeToDisk("./rekordbox_modules/");
    }
  });
});
```
