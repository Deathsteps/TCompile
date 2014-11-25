var sys      = {};
sys.fs       = require('fs');
sys.path     = require('path');

var CONFIG   = require('./config.json');

/**
 * @class File
 * @constructor
 * @param {String} filename The file name
 * @param {String} mode     What kind this file belongs to, eg: mods, tools, src
 * @param {String} [dir]    The specified folder the file is in
 */
var File = function (filename, mode, dir) {
    this.name         = filename;
    this.filePath     = this._getFilePath(filename, mode, dir);
    this.compressPath = this.filePath.replace('.js', '.min.js');
    this.mergePath    = this.filePath.replace('.js', '.merge.js');
    this.destPath     = this._getDestPath(filename, mode);
    // dependent modules
    this.deps         = [];
}

File.prototype = {
    constructor: File,

    deps4Compressing: function () {
        this.deps.forEach(function (item) {
            item.compressPath = item.filePath.replace('.js', '.min.js');
        });
    },

    _getFilePath: function (filename, mode, dir) {
        mode = mode || '';
        dir = dir || CONFIG.path.src;
        if(sys.path.extname(filename) == '')
            filename += '.js'
        return sys.path.join(dir, mode, filename);
    },

    _getDestPath: function (filename, mode) {
        if(sys.path.extname(filename) == '')
            filename += '.js';
        var dir = CONFIG.path[ mode ? mode : 'min' ];
        return sys.path.join(dir, filename);
    }
}

module.exports = File;