// componentts/like/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    like: {
      type: Boolean,
    },
    count: {
      type: Number
    },
    readOnly: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据 
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLike: function(event) {
      if (this.properties.readOnly) {
        return;
      }
      let like = this.properties.like;
      let count = this.properties.count;
     count = !like?count+1:count-1;

     this.setData({
       count: count,
       like: !like
     })

     // 激活 通知父组件，子组件的点击事件发生了, 在父组件中监听该时间
     let behavior = this.properties.like?'like':'cancel';
     this.triggerEvent('like', {
       behavior: behavior
     }, {});

    }

  }
})
