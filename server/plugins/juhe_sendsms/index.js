/**
 * Created by wangyi on 2016/11/30.
 */
import request from 'request';
import moment from 'moment-timezone';
//生成6位随机数（不保证唯一）
let getrandom = () => {
    return Math.floor(Math.random() * 1000000);
};

//发送短信Promise
//使用的是聚合数据的短信接口
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

export default (ctx, next) => {
    console.log(`plugin "test" start`);
    console.log(`request time ${new Date()}`);
}

export let sendsms = (phone, tpl_id, code, last_send_time) => {
    return new Promise(function (resolve) {
        if (phone != "" && phone != undefined) {
            tpl_id = tpl_id || 23696;
            code = code || getrandom();
            last_send_time = last_send_time || "2016-11-25 18:00:00"; //可以在业务中判断，也可以传时间戳给函数判断。
            if ((new Date(moment().format("YYYY-MM-DD HH:mm:ss")).getTime() - new Date(moment(last_send_time).format("YYYY-MM-DD HH:mm:ss")).getTime()) > 60000) {
                request.get('http://v.juhe.cn/sms/send?mobile=' + phone + '&tpl_id=' + tpl_id + '&tpl_value=%23code%23%3D' + encodeURIComponent(code) + '&key=5013d0f53aa9b3ff4a741ce546f298cc', function (error, response, body) {
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