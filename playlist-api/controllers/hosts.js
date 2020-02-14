const Host = require('../models/hosts');

var Hosts = module.exports;

//Devolve lista dos Hosts
Hosts.listar = () => {
    return Host
        .find()
        .exec();
}

//Devolve lista dos Hosts
Hosts.consultar = id => {
    return Host
        .findOne({_id: id})
        .exec();
}

//Devolve lista dos Hosts
Hosts.contar = () => {
    return Host
        .countDocuments()
        .exec();
}

Hosts.inserir = host => {
    var novo = new Host(host);
    return novo.save();
}