import { config } from '../config.js';

const tips = {
  1: '抱歉，出现了一个错误',
  1005: 'appkey无效',
  3000: '期刊不存在'
}


class HTTP {
  request({url, data={}, method='GET'}) {
    return new Promise((resolve, reject)=>{
      this._request(url, resolve, reject, data, method);
    })
  }
  _request(url, resolve, reject, data={}, method='GET') {
    wx.request({
      url: config.api_base_url + url,
      data: data,
      header: {
        'content-type': 'application/json',
        'appkey': config.appkey
      },
      method: method,
      success: (res) => {
        // es6提供的两个新的字符串函数
        // startsWith 
        // endsWith
        // http返回码2xx和4xx都是在这里调用

        let code = res.statusCode.toString();
        // code是以2开头则返回成功，否则
        if (code.startsWith('2')) {
          resolve(res.data);
        } else {
          // 服务器异常
          reject(); // 无须传入参数，只是用来告诉promise状态发生了改变
          let error_code = res.data.error_code;
          this._show_error(error_code);

        }
      },
      fail: function (res) {
        // api调用失败
        reject();
        this._show_error(1);
      },
      complete: function (res) { },
    })
  }

  _show_error(error_code) {
    if (!error_code) {
      error_code = 1;
    }
    const tip = tips[error_code];
    wx.showToast({
      title: tip?tip:tips[1],
      icon: 'none',
      duration: 2000
    })
  }
}

export { HTTP };