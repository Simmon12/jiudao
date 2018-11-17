  const paginationBev = Behavior({
    data: {
      dataArray:[],
      total: null,
      noneResult: false,
      loading: false
    },
    methods: {
      setMoreData(dataArray) {
        const tempArray = this.data.dataArray.concat(dataArray);
        this.setData({
          dataArray: tempArray
        })
      },

      getCurrentStart() {
        return this.data.dataArray.length
      },

      setTotal(total) {
        this.data.total = total;
        if (total == 0) {
          this.setData({
            noneResult: true
          })
        }
      }, 

      // 是否还有更多的数据需要加载
      hasMore() {
        if (this.data.dataArray.length >= this.data.total) {
          return false;
        }
        return true;
      },

      initialize() {
        this.setData({
          dataArray: [],
          noneResult: false,
          loading: false
        })
        this.data.total = null;
      },

      // 锁的封装
      isLocked() {
        return this.data.loading ? true : false;
      },

      locked() {
        this.setData({
          loading: true
        })
      },

      unLocked() {
        this.setData({
          loading: false
        })
      },

    }
  })

export { paginationBev};