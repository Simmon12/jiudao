import { classicBeh } from '../classic-beh.js';
const mMgr = wx.getBackgroundAudioManager();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String
  },
  behaviors: [classicBeh],

  /**
   * 组件的初始数据
   */
  data: {
    playing: false,
    pauseSrc: 'images/player@waitting.png',
    playSrc: 'images/player@playing.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPlay: function(event) {

      if (!this.data.playing) {
        mMgr.src = this.properties.src;
        // this.setData
      } else {
        mMgr.pause();
      }
      // 图片切换
      this.setData({
        playing: !this.data.playing
      })

    },

    _recoverStatus:function() {
      if(mMgr.paused) {
        this.setData({
          playing: false
        })
        return;
      }
      if(mMgr.src == this.properties.src) {
        this.setData({
          playing: true
        })
      }
    },

    _monitorSwitch:function() {
       mMgr.onPlay(()=>{
          this._recoverStatus();
       })
       mMgr.onPause(()=>{
         this._recoverStatus();
       })
       mMgr.onStop(()=>{
         this._recoverStatus();
       })
       mMgr.onEnded(()=>{
         this._recoverStatus();
       })
    }

  },

  /**
   * 生命周期函数，当组件从页面节点树移除的时候触发
   */
  attached: function(event) {
    this._recoverStatus();
    this._monitorSwitch();
  },

  detached:function(event) {
    // mMgr.stop();
  }

})
