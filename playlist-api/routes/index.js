var express = require('express');
var router = express.Router();

var snmp = require ('net-snmp');
var hostip = "127.0.0.1";
var options = {
    port: '4161'
};
var session = snmp.createSession(hostip, "public", options);
var maxRepetitions = 20;
var musics = [];
var re;
var hosts = [
    '127.0.0.1',
    '192.168.1.67',
    '192.168.1.1',
];
//var oid = "1.3.6.1.4.1.2";
var mount = [[],[],[],[]];
var oids = [
    "1.3.6.1.4.1.2.1"
];

var nonRepeaters = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
    re = res;
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    //session.table(oid, maxRepetitions, getMusics);

    session.getBulk (oids, nonRepeaters,60, function (error, varbinds) {
        if (error) {
            console.error (error.toString ());
        } else {
            // step through the non-repeaters which are single varbinds
            for (var i = 0; i < nonRepeaters; i++) {
                if (i >= varbinds.length)
                    break;

                if (snmp.isVarbindError (varbinds[i]))
                    console.error (snmp.varbindError (varbinds[i]));
                else
                    console.log (varbinds[i].oid + "|" + varbinds[i].value);
            }

            // then step through the repeaters which are varbind arrays
            for (var i = nonRepeaters; i < varbinds.length; i++) {
                for (var j = 0, nm = ((varbinds[i].length)/4), p = 0, m = 0; j < varbinds[i].length; j++, p++) {
                    if (snmp.isVarbindError (varbinds[i][j]))
                        console.error (snmp.varbindError (varbinds[i][j]));
                    else {
                        console.log ((varbinds[i].length) + '------' + varbinds[i][j].value.toString() + '------' + j);
                        if(p === nm) { p = 0; m++ }
                        mount[m].push(varbinds[i][j].value.toString());

                        console.log (varbinds[i][j].oid + "|" + varbinds[i][j].value);
                    }
                }
            }
            for (var i = 0; i < mount[0].length; i++){
                var music = {
                    id: mount[0][i],
                    artist: mount[1][i],
                    title: mount[2][i],
                    path: mount[3][i]
                }
                musics.push(music);
            }
            mount = [[],[],[],[]];
        }
        
        res.jsonp(musics);
        musics = [];
    });
  });


/* GET home page. */
router.get('/music/:musica', function(req, res, next) {
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    var varbinds = [
        {
            oid: "1.3.6.1.4.1.1.0",
            type: snmp.ObjectType.OctetString,
            value: '*path*' + req.params.musica
        }
    ];
    session.set (varbinds, (error, varbinds) => { 
        if (error) {
            console.error (error.toString ());
        } else {
            for (var i = 0; i < varbinds.length; i++) {
             // for version 2c we must check each OID for an error condition
                if (snmp.isVarbindError (varbinds[i]))
                    console.error (snmp.varbindError (varbinds[i]));
                else
                    console.log (varbinds[i].oid + "|" + varbinds[i].value);

                    session.get(["1.3.6.1.4.1.3.0"], (error, varbinds) => {    
                        if (error) { console.error (error.toString ());
                        } else {
                            for (var i = 0; i < varbinds.length; i++) {
                                // for version 2c we must check each OID for an error condition
                                if (snmp.isVarbindError (varbinds[i]))
                                    console.error (snmp.varbindError (varbinds[i]));
                                else {
                                     res.send( varbinds[i].value.toString() );
                                    console.log (varbinds[i].oid + "|" + varbinds[i].value);
                                }
                            }
                        }
                    });
                }
            }
    });
});

/* GET home page. */
router.get('/hosts', function(req, res, next) {
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    res.jsonp(hosts)
});

/* GET home page. */
router.post('/hostip', function(req, res, next) {
    hostip = req.body.host;
    session = snmp.createSession(hostip, "public", options);
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    res.send({'udp':'done'})
});

/* GET home page. */
router.get('/sysname', function(req, res, next) {
    session.get(["1.3.6.1.2.1.1.5.0"], (error, varbinds) => {    
        if (error) { 
            console.error (error.toString ());
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                // for version 2c we must check each OID for an error condition
                if (snmp.isVarbindError (varbinds[i]))
                    console.error (snmp.varbindError (varbinds[i]));
                else {
                    res.send( varbinds[i].value.toString() );
                    console.log (varbinds[i].oid + "|" + varbinds[i].value);
                }
            }
        }
    });
});

module.exports = router;