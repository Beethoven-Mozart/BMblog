import {system_config} from '../config.js';
import request from 'request';
import moment from 'moment-timezone';
import nodemailer from 'nodemailer';

//这个文件中存在很多例如key之类的敏感信息，暂时不要暴露

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

//生成6位随机数（不保证唯一）
export let getrandom = () => {
    return Math.floor(Math.random() * 1000000);
};

//发送短信Promise
//使用的聚合数据发送接口
//这是一个Promise接口。对应请求是参数。使用请引入import {sendsms} from "tool/common_tool.js"; ，注意路径。
//该接口前端不能直接引用，需要后端进行二次封装。
//这是模板审核制接口，暂只支持发送通知和验证码类短信，不支持发邀请营销等短信。
//验证码同1个号码同1个签名的内容30秒内只能发1条，1分钟内只能发2条，30分钟内只能发3条，过快的频率可能会导致运营商系统屏蔽，用户无法正常接收。
// code	短信变量		模板免审接口
// phone	用户手机号		11位国内手机号
// tpl_id	模板ID		使用的短信模板ID
//返回值：
// /****失败示例**/
// {
//     "reason": "错误的短信模板ID,请通过后台确认!!!",
//     "result": [],
//     "error_code": 205402
// }
//
// /****成功示例**/
// {
//     "reason": "短信发送成功",
//     "result": {
//     "count": 1, /*发送数量*/
//         "fee": 1, /*扣除条数*/
//         "sid": "2029865577" /*短信ID*/
// },
//     "error_code": 0 /*发送成功*/
// }
// 服务级错误码参照(error_code)：
// 错误码	说明
// 205401	错误的手机号码
// 205402	错误的短信模板ID
// 205403	网络错误,请重试
// 205404	发送失败，具体原因请参考返回reason
// 205405	号码异常/同一号码发送次数过于频繁
// 205406	不被支持的模板
// 系统级错误码参照：
// 错误码	说明	旧版本（resultcode）
// 10001	错误的请求KEY	101
// 10002	该KEY无请求权限	102
// 10003	KEY过期	103
// 10004	错误的OPENID	104
// 10005	应用未审核超时，请提交认证	105
// 10007	未知的请求源	107
// 10008	被禁止的IP	108
// 10009	被禁止的KEY	109
// 10011	当前IP请求超过限制	111
// 10012	请求超过次数限制	112
// 10013	测试KEY超过请求限制	113
// 10014	系统内部异常(调用充值类业务时，请务必联系客服或通过订单查询接口检测订单，避免造成损失)	114
// 10020	接口维护	120
// 10021	接口停用	121
// 错误码格式说明（示例：200201）：
// 2	002	01
// 服务级错误（1为系统级错误）	服务模块代码(即数据ID)	具体错误代码
//
//模板ID	模板	审核状态 权限等级越高，每日可请求的次数越高



export let sendsms = (phone, tpl_id, code, last_send_time) => {
    return new Promise(function (resolve) {
        if (phone != "" && phone != undefined) {
            tpl_id = tpl_id || 23696;
            code = code || getrandom();
            last_send_time = last_send_time || "2016-11-25 18:00:00"; //可以在业务中判断，也可以传时间戳给函数判断。
            if ((new Date(moment().format("YYYY-MM-DD HH:mm:ss")).getTime() - new Date(moment(last_send_time).format("YYYY-MM-DD HH:mm:ss")).getTime()) > 60000) {
                request.get('http://v.juhe.cn/sms/send?mobile=' + phone + '&tpl_id=' + tpl_id + '&tpl_value=%23code%23%3D' + encodeURIComponent(code) + '&key=XXXXXXX', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        resolve({
                            error_code: 300201,
                            reason: "第三方发信接口未响应"
                        });
                    }
                });
            } else {
                resolve({
                    error_code: 300102,
                    reason: "发送过于频繁"
                });
            }
        } else {
            resolve({
                error_code: 300101,
                reason: "参数不正确，手机号未填写。"
            });
        }
    });
};


//发送Email（目前使用的是阿里云SMTP发送邮件）
//receivers 目标邮箱，可以用英文逗号分隔多个。（我没试过）
//subject 邮件标题
//text 文本版本的邮件内容
//html HTML版本的邮件内容
//返回
//result 200是成功，500是失败
//info 是返回的消息，可能是结果的文本，也可能是对象。（这个错误不要暴露给用户）
export let sendemail = (receivers, subject, text, html) => {
    return new Promise(function (resolve) {
        let transporter = nodemailer.createTransport('smtp://postmaster%40XXX.com:pass@smtp.XXX.com');

        // setup e-mail data with unicode symbols
        let mailOptions = {
            from: '"名字 👥" <postmaster@xxx.com>', // sender address
            to: receivers,
            subject: subject,
            text: text || 'Hello world 🐴', // plaintext body
            html: html || '<b>Hello world 🐴</b>' // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve({
                    result: 500,
                    info: error
                });
            } else {
                resolve({
                    result: 200,
                    info: info.response
                });
            }
        });
    });
};

