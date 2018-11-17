import {HTTP} from '../util/http.js';
class ClassicModel extends HTTP {
  getLatest(sCallback) {
    console.log("ssss");
    this.request({
      url: '/classic/latest',
      success: (res) => {
        sCallback(res);
        this.__setLatestIndex(res.index);
        // 每次获取到新的期刊数据的时候，将数据写入缓存中，不需要判断缓存中是否存在已有数据，因为key不知道
        let key = this.__getKey(res.index);
        wx.setStorageSync(key, res);
      }
    })
  }

  getClassic(index, nextOrPrevious, sCallback) {
    // 缓存中寻找orAPI获得并写入到缓存中
    // key 确定key（在缓存中用来代表是哪一期的期刊）
    let key = nextOrPrevious == 'next' ? this.__getKey(index+1) : this.__getKey(index-1);
    let classic = wx.getStorageSync(key);
    // 此时无法从缓存中找到所需的值，需要通过api调用的方式，进行获取
    if (!classic) {
      this.request({
        url: 'classic/' + index + '/' + nextOrPrevious,
        success: (res) => {
          wx.setStorageSync(this.__getKey(res.index), res);
          sCallback(res);
        }
      })
    } 
    else { // 直接拿缓存中的数据
      sCallback(classic);
    }

    
  }

  isFirst(index) {
    return index == 1 ? true : false
  }  

  isLatest(index) {
    let latestIndex = this.__getLatestIndex();
    return latestIndex == index ? true : false; 
  }

  __setLatestIndex(index) {
    wx.setStorageSync('latest', index);
  }

  __getLatestIndex() {
    let index = wx.getStorageSync('latest');
    return index;
  }

  __getKey(index) {
    let key = 'classic-' + index;
    return key;
  }

  getMyFavor(success) {
    let params = {
      url: 'classic/favor',
      success: success
    }
    this.request(params)
  }

}

export { ClassicModel};