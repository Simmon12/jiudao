import {HTTP} from '../util/http-p.js'
class KeywordModel extends HTTP{
  key = 'q'
  maxLength = 10
  getHistory() {
    const words = wx.getStorageSync(this.key);
    if (!words) {
      return [];
    }
    return words;
  }

  getHot() {
    return this.request({
      url: '/book/hot_keyword'
    })
  }

  addToHistory(keyword) {
    let words = this.getHistory();
    const has = words.includes(keyword);
    // 实现了数据结构中的队列
    if (!has) {
      const length = words.length;
      if (length >= this.maxLength) {
        // 数组末尾的元素删除，把keyword放入数组第一位
        words.pop();
      }
      // unshift在数组的开头插入数据
      words.unshift(keyword)
      wx.setStorageSync(this.key, words)
    }
    
  }
}

export {KeywordModel}