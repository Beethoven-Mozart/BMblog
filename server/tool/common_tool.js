import {system_config} from '../config.js';

//截取字符串，多余的部分用...代替
export let setString = (str, len) => {
    let str_len = 0;
    let s = "";
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            str_len += 2;
        } else {
            str_len++;
        }
        s += str.charAt(i);
        if (str_len >= len) {
            return s + "...";
        }
    }
    return s;
};

//格式化设置
export let option_format = (get_options) => {
    let options = "{";
    for (let n = 0; n < get_options.length; n++) {
        options = options + "\"" + get_options[n].option_name + "\":\"" + get_options[n].option_value + "\"";
        if (n < get_options.length - 1) {
            options = options + ",";
        }
    }
    return JSON.parse(options + "}");
};

//替换SQL字符串中的前缀
export let sql_format = (str) => {
    if (system_config.mysql_prefix != "bm_") {
        str = str.replace(/bm_/g, system_config.mysql_prefix);
    }
    return str;
};

//数组去重
export let hovercUnique = (arr) => {
    let result = [], hash = {};
    for (let i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
};

//获取json长度
export let getJsonLength = (jsonData) => {
    let jsonLength = 0;
    for (let item in jsonData) {
        jsonLength++;
    }
    return jsonLength;
};


