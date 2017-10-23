/*

    cloud.js

    a backend API for SNAP!

    written by Jens Mönig

    Copyright (C) 2015 by Jens Mönig

    This file is part of Snap!.

    Snap! is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

// Global settings /////////////////////////////////////////////////////

/*global modules, IDE_Morph, SnapSerializer, hex_sha512, alert, nop,
localize*/

modules.cloud = '2015-December-15';

// Global stuff

var Cloud;
var SnapCloud = new Cloud();

// Cloud /////////////////////////////////////////////////////////////

function Cloud() {}

Cloud.prototype.saveProject = function (ide, callBack) {
    var myself = this,
        pdata,
        size;
    console.log(ide);
    ide.ide.serializer.isCollectingMedia = true;
    pdata = ide.ide.serializer.serialize(ide.ide.stage);

    size = pdata.length;

    // check if serialized data can be parsed back again
    try {
        ide.ide.serializer.parse(pdata);
    } catch (err) {
        ide.ide.showMessage('Serialization of program data failed:\n' + err);
        throw new Error('Serialization of program data failed:\n' + err);
    }

    //Loop through ide.projectList and see if name is there, if it is update.
    let id = 0;
    ide.projectList.forEach(function(project) {
        if(project.name == ide.ide.projectName) {
            id = project.id;
        }
    }, this);

    ide.ide.showMessage('Uploading ' + Math.round(size / 1024) + ' KB...');

    if(id == 0) {
        $.ajax({
            url: "https://app.ingeniarius.pt/api/snap",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Access-Control-Allow-Origin': '*'
            },
            data: { name: ide.ide.projectName, file:pdata },
            type: "STORE"
        })
        .done(function(data) {
            console.log(data);
            ide.ide.showMessage('Uploaded');
            callBack();
        });
    }
    else {
        $.ajax({
            url: "https://app.ingeniarius.pt/api/snap/"+id,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Access-Control-Allow-Origin': '*'
            },
            data: { name: ide.ide.projectName, file:pdata },
            type: "UPDATE"
        })
        .done(function(data) {
            console.log(data);
            ide.ide.showMessage('Uploaded');
            callBack();
        });
    }
};

Cloud.prototype.getProjectList = function (callBack, errorCall) {
    $.ajax({
        url: "https://app.ingeniarius.pt/api/snap",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Access-Control-Allow-Origin': '*'
        },
        type: "GET"
    })
    .done(function( data ) {
        callBack(data);
    });
};

Cloud.prototype.getProject = function (project, callBack) {
    $.ajax({
        url: "https://app.ingeniarius.pt/api/snap/"+project.id,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Access-Control-Allow-Origin': '*'
        },
        type: "SHOW"
    })
    .done(function( data ) {
        callBack(data);
    });
};


Cloud.prototype.deleteProject = function (id,callBack) {
    $.ajax({
        url: "https://app.ingeniarius.pt/api/snap/"+id,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        type: "DESTROY"
    })
    .done(function( data ) {
        callBack();
    });
};

// Cloud: user messages (to be overridden)

Cloud.prototype.message = function (string) {
    alert(string);
};
