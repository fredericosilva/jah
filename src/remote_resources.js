"use strict";

var util = require('./index'),
    events = require('events');

function RemoteResource(url, path) {
    this.url = url;
    this.path = path;
}

/**
 * Load the remote resource via ajax
 */
RemoteResource.prototype.load = function () {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var path = this.path

            var r = __remote_resources__[path];
            __resources__[path] = util.copy(r);
            __resources__[path].data = xhr.responseText;
            __resources__[path].meta.remote = true;

            events.trigger(this, 'load', this);
        }
    }.bind(this);

    xhr.open('GET', this.url, true);  
    xhr.send(null);
};

function RemoteImage(url, path) {
    RemoteResource.apply(this, arguments);
}

RemoteImage.prototype = Object.create(RemoteResource.prototype);

RemoteImage.prototype.load = function () {
    var img = new Image();
    img.onload = function () {
        var path = this.path

        var r = __remote_resources__[path];
        __resources__[path] = util.copy(r);
        __resources__[path].data = img;
        __resources__[path].meta.remote = true;

        events.trigger(this, 'load', this);
    }.bind(this);
    
    img.src = this.url;

    return img;
};

exports.RemoteImage = RemoteImage;
exports.RemoteResource = RemoteResource;
