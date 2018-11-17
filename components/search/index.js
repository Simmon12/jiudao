// components/search/index.js
import {KeywordModel} from '../../models/keyword.js';
import {BookModel} from '../../models/book.js'
import {paginationBev} from '../behaviors/pagination.js';

const keywordModel = new KeywordModel();
const bookModel = new BookModel();

Component({
  /**
   * 组件的属性列表
   */
  behaviors: [paginationBev],
  properties: {
    more:{
      type: String,
      observer: 'loadMore'
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords: [],
    hotWords:[],
    searching: false,
    q: '',
    loading: false,
    loadingCenter: false
  },

  attached() {
    this.setData({
      historyWords: keywordModel.getHistory()
    })

    keywordModel.getHot().then(res=>{
      this.setData({
        hotWords: res.hot
      })
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadMore:function() {
      console.log("ssssss");

      if(!this.data.q) {
        return;
      }
      // 同时 发送两个请求(由于用户速度过快，两次请求的参数一致) 导致数据重新加载
      // 增加锁， 锁住search方法的调用，使得一次只发送一个请求
      if (this.isLocked()) {
        return;
      }
      
      if (this.hasMore()) {
        // 加锁
        this.locked();
        bookModel.search(this.getCurrentStart(), this.data.q)
          .then(res => {
            this.setMoreData(res.books)
            // 解锁 如果wxml不需要显示loading的变量，则可以不用this.setData的方式重新赋值，进行绑定
            this.unLocked();
          },(res) => {
            this.unLocked(); // 当网络出现异常时，也必须解锁，否则会出现死锁的问题
          });
      }

    },


    onCancel:function() {
      this.triggerEvent('cancel',{},{});
      this.initialize();
    },

    onDelete:function(event) {
      this._closeResult();
      this.initialize();
    },
    onConfirm:function(event) {
      this._showResult();
      this._showLoadingCenter();
      // event.detail.value是用户在文本框中输入的文本
      // event.detail.text是监听到的自定义事件里携带有标签text的文本
      const word = event.detail.value || event.detail.text;
      bookModel.search(0, word).then(res=>{
        this.setMoreData(res.books);
        this.setTotal(res.total);
        this.setData({
          q: word
        })
        keywordModel.addToHistory(word);
        this._hideLoadingCenter();

      });

    },

    _showLoadingCenter() {
      this.setData({
        loadingCenter: true
      })
    },

    _hideLoadingCenter() {
      this.setData({
        loadingCenter: false
      })
    },
    
    _showResult() {
      this.setData({
        searching: true
      })
    },

    _closeResult() {
      this.setData({
        searching: false,
        q: ''
      })
    }
  }
})
