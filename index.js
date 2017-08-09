var f = require('fs');
var fs = require('fs-extra');
var gfm = require('get-module-file');

module.exports = function publishToLocal(dependencyIds) {

  var readme = 'README.md';
  var localDocs = './docs/index.md';

  // Copy the project README to ./docs/index.md - this is your jumping-off point
  fs.copySync(readme, localDocs);

  // Copy dependency READMEs into dependency-named sub-dirs as index.md files
  // and as we go, remember the descriptions from each project, to be inserted
  // into the main page (./docs/index.md)
  var mainLinkSection = "";
  var description = null;
  var currentDependency = "";
  var node_modules = './node_modules';

  for (i = 0; i < dependencyIds.length; i++) {
    currentDependency = dependencyIds[i];
    console.dir("currentDependency: " + currentDependency);
    var readmeFile = gfm.sync(node_modules, currentDependency, readme);

    if (readmeFile != false) {
      fs.copySync(readmeFile, './docs/' + currentDependency + '/index.md');
    }

    // Get the description of the current dependency it's package.json (for use in the main page link text)
    var dependencyPackageFileLoc = gfm.sync(node_modules, currentDependency, 'package.json');

    var file = f.readFileSync(dependencyPackageFileLoc, 'utf8');
    var matches = file.match(/"description": "[a-zA-Z0-9 :\/()-]*"/);

    if (matches[0] != null) {
      description = JSON.parse('{' + matches[0] + '}')["description"];
    }
    else if (description == null) {
      description = currentDependency;
    }

    mainLinkSection += "  * [" + description + "](./" + currentDependency + ")\n";

    console.dir("Processed");

  }

  // Add links to dependency pages into main page
  fs.readFile(localDocs, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace("[MODULE-LINKS WILL BE AUTO-INSERTED HERE]", mainLinkSection);

    fs.writeFile(localDocs, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}
