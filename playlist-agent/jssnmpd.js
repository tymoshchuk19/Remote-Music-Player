var snmp = require('net-snmp');
var os = require('os');
var mpg = require('mpg123');
player = new mpg.MpgPlayer();

// Default options
var options = {
    port: 4161,
    disableAuthorization: true,
    transport: "udp4"
};
var lastMusic = "default.mp3"
var pause = false;
var callback = function (error, data) {
    if ( error ) {
        console.error (error);
    } else {
        if (data.pdu.varbinds[0].value) {
            name = data.pdu.varbinds[0].value.toString();
            if(name.includes('*path*')) {
                var nome = name.slice(6);
                console.log (lastMusic + ' ' + nome);
                if(lastMusic != nome) {
                    player.play('./musicas/'+ nome);
                    pause = false;
                } else if (pause) {
                    player.pause();
                } else {
                    player.pause();
                    pause = true;
                }
            }
        }
        // console.log (JSON.stringify(data, null, 2));
    }
};

agent = snmp.createAgent (options, callback);
var mib = agent.getMib();
console.log('SNMP agent running on port: ' + options.port)
player.on('resume', function(data){ 
    mib.setScalarValue ("playedLength", a = parseInt(player.length)); 
})



// Create a module store, load a MIB module, and fetch its JSON representation
var store = snmp.createModuleStore ();
store.loadFromFile ("/usr/local/share/snmp/mibs/SNMPv2-MIB.txt");
//var jsonModule = store.getModule ("SNMPv2-MIB");

// Fetch MIB providers, create an agent, and register the providers with your agent
var providersMIB = store.getProvidersForModule ("SNMPv2-MIB");

mib.registerProviders (providersMIB);


// Create a module store, load a MIB module, and fetch its JSON representation
var store = snmp.createModuleStore ();
store.loadFromFile ("/usr/local/share/snmp/mibs/SNMPv2-SMI.txt");
//var jsonModule = store.getModule ("SNMPv2-SMI");

// Fetch SMI providers, create an agent, and register the providers with your agent
var providersSMI = store.getProvidersForModule ("SNMPv2-SMI");

mib.registerProviders (providersSMI);


// Create a module store, load a MIB module, and fetch its JSON representation
var store = snmp.createModuleStore ();
store.loadFromFile ("/usr/local/share/snmp/mibs/SNMPv2-CONF.txt");
//var jsonModule = store.getModule ("SNMPv2-CONF");

// Fetch CONF providers, create an agent, and register the providers with your agent
var providersCONF = store.getProvidersForModule ("SNMPv2-CONF");

mib.registerProviders (providersCONF);


// Create a module store, load a MIB module, and fetch its JSON representation
var store = snmp.createModuleStore ();
store.loadFromFile ("/usr/local/share/snmp/mibs/SNMPv2-TC.txt");
//var jsonModule = store.getModule ("SNMPv2-TC");

// Fetch TC providers, create an agent, and register the providers with your agent
var providersTC = store.getProvidersForModule ("SNMPv2-TC");

mib.registerProviders (providersTC);

var play = {
    name: "playedMusic",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.4.1.1",
    scalarType: snmp.ObjectType.OctetString,
    handler: function (mibRequest) {
        var nome = mibRequest.instanceNode.value.slice(6);
        lastMusic = nome;
        mibRequest.done ();
    }
};

var size = {
    name: "playedLength",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.4.1.3",
    scalarType: snmp.ObjectType.Integer,
    handler: function (mibRequest) {
        mibRequest.done ();
    }
};

var musicsTable = {
    name: "playListTable",
    type: snmp.MibProviderType.Table,
    oid: "1.3.6.1.4.1.2",
    tableColumns: [
        {
            number: 1,
            name: "musicIndex",
            type: snmp.ObjectType.Integer
        },
        {
            number: 2,
            name: "musicArtist",
            type: snmp.ObjectType.OctetString
        },
        {
            number: 3,
            name: "musicTitle",
            type: snmp.ObjectType.OctetString
        },
        {
            number: 4,
            name: "musicPath",
            type: snmp.ObjectType.OctetString
        }
    ],
    tableIndex: [
        {
            columnName: "musicIndex"
        }
    ]
};

mib.registerProvider (play);
mib.registerProvider (size);
mib.registerProvider (musicsTable);

mib.setScalarValue ("playedMusic", "default.mp3");
mib.setScalarValue ("playedLength", 0);
mib.addTableRow ("playListTable", [1, "Rupert Holmes", "Escape", "PinaColada.mp3"]);
mib.addTableRow ("playListTable", [2, "Toploader", "Dancing in the Moonlight", "DancingInTheMoonlight.mp3"]);
mib.addTableRow ("playListTable", [3, "Tame Impala", "BorderLine", "Borderline.mp3"]);
mib.addTableRow ("playListTable", [4, "Kodaline", "HighHopes", "HighHopes.mp3"]);
mib.addTableRow ("playListTable", [5, "Johnny Cash", "God's Gonna Cut You Down", "GodsGonnaCutYouDown.mp3"]);
mib.addTableRow ("playListTable", [6, "Bryan Adams", "Summer Of '69", "SummerOf69.mp3"]);
mib.addTableRow ("playListTable", [7, "Bon Jovi", "Runaway", "Runaway.mp3"]);
mib.addTableRow ("playListTable", [8, "Richie Sambora", "When a blind man cries", "Whenablindmancries.mp3"]);
mib.addTableRow ("playListTable", [9, "R.E.M.", "Losing My Religion", "LosingMyReligion.mp3"]);
mib.addTableRow ("playListTable", [10, "System Of A Down", "Lonely Day", "LonelyDay.mp3"]);
mib.addTableRow ("playListTable", [11, "Linkin Park", "Breaking The Habit", "BreakingtheHabit.mp3"]);
mib.addTableRow ("playListTable", [12, "Linkin Park", "In The End", "InTheEnd.mp3"]);
mib.addTableRow ("playListTable", [13, "Red Hot Chili Peppers", "Can't Stop", "CantStop.mp3"]);
mib.addTableRow ("playListTable", [14, "Foo Fighters", "The Pretender", "ThePretender.mp3"]);
mib.addTableRow ("playListTable", [15, "System Of A Down", "Toxicity", "Toxicity.mp3"]);

// Start manipulating the MIB through the registered providers using the `Mib` API calls
mib.setScalarValue ("sysDescr", "The most powerful system you can think of");
mib.setScalarValue ("sysName", os.hostname());
mib.addTableRow ("sysOREntry", [1, "1.3.6.1.4.1.47491.42.43.44.45", "I've dreamed up this MIB", 20]);
