function whereinit(where) {
    var up_where='';
    for (let i in where) {
        if (!where[i]['op']) {
            where[i]['op'] = "=";
        }
        if (up_where.length == 0) {
            up_where = where[i]['name'] + where[i]['op'] + where[i]['value'];
        } else {
            up_where = +(i + where[i]['name'] + where[i]['op'] + where[i]['value']);
        }
    }
    return up_where
}
export var insert = function (db, table, data) {
    var field, value;
    for (let i in data) {
        field = "`" + i + "`,";
        value = "'" + data[i] + "',";
    }
    field = field.slice(0, -1);
    value = value.slice(0, -1);
    return "INSERT INTO `" + db + "`.`" + table + "` (" + field + ") VALUES (" + value + ");";
};
export var updata = function (db, table, data, where) { //{"or":{'name':id,value:1,op:"="},and:{name:11},and:{data:22}}
    if (!where) {
        throw('sql条件不能为空');
    }
    var updata;
    for (let i in data) {
        updata = "`" + i + "`='" + data[i] + "',";
    }
    updata = updata.slice(0, -1);
    var upwhere;
    upwhere = whereinit(where);
    return "UPDATE `" + table + "` SET " + updata + " WHERE " + upwhere+";";
};
export var find = function (table, field, where, limit, order) {
    var data = '';
    for (let i in field) {
        data += "`" + field[i] + "`,";
    }
    data = data.slice(0, -1);
    var where_sql='';

    var up_where = whereinit(where);
    if (up_where) {
        where_sql = 'where ' + up_where;
    }
    if (limit) {
        limit = " LIMIT " + limit;
    } else {
        limit = '';
    }
    if (order) {
        order = "order by " + order;
    } else {
        order = '';
    }
    //console.log("select " + data + " from `" + table + "`" + where_sql + order + limit)
    return "select " + data + " from `" + table + "`" + where_sql + order + limit +";";
};
export var findone = function (table, field, where, order) {
    return find(table, field, where, 1, order)
};