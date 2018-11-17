import {
  BookModel
} from '../../models/book.js';

import { LikeModel } from '../../models/like.js'
const bookModel = new BookModel();
const likeModel = new LikeModel();

// pages/book-detail/book-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    book: null,
    likeStatus: false,
    likeCount:0,
    posting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    const id = options.bid;
    const detail = bookModel.getDetail(id);
    const comments = bookModel.getComments(id);
    const likeStatus = bookModel.getLikeStatus(id);

    // 新的promise 合体 ，等待所有子promise完成之后，才会触发回调函数，其将等待最长耗时的请求结束之后，才会触发回调函数
    // 假如第一个请求耗时2s， 2.5s， 1.8s，最终耗时为最长的那个2.5s
    // .race 竞争，任何一个子promise率先完成之后，马上就会触发回调函数，因此res是最先完成的子promise的结果
    Promise.all([detail, comments, likeStatus])
    .then(res=> {
      console.log(res);
      this.setData({
        book: res[0],
        comments: res[1].comments,
        likeStatus: res[2].like_status,
        likeCount: res[2].fav_nums
      })
      wx.hideLoading();
    })

    // detail.then(res=>{
    //   this.setData({
    //     book: res
    //   })
    // })

    // comments.then(res=>{
    //   this.setData({
    //     comments: res.comments
    //   })
    // })

    // likeStatus.then(res=>{
    //   this.setData({
    //     likeStatus: res.like_status,
    //     likeCount: res.fav_nums
    //   })
    // })   
  },

  onLike(event) {
    const like_or_cancel = event.detail.behavior;
    likeModel.like(like_or_cancel, this.data.book.id, 400);
  },

  onFakePost(event) {
    console.log(this.data.comments.length);
    this.setData({
      posting: true
    })
  },

  onPost(event) {
    const comment = event.detail.text || event.detail.value;
    if (!comment) {
      return;
    }

    console.log('input' + comment);

    if(comment.length > 12) {
      wx.showToast({
        title: '短评最多12个字',
        icon: 'none'
      })
      return;
    }

    bookModel.postComment(this.data.book.id, comment)
      .then(res=>{
        wx.showToast({
          title: '+ 1',
          icon: 'none'
        })
        return bookModel.getComments(this.data.book.id)
      })
      .then(res=>{
        this.setData({
          comments: res.comments,
          posting: false
        })
        
      })

  },

  onCancel(event) {
    this.setData({
      posting: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})