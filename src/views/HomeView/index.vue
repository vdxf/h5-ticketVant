<template>
  <div class="home-view">

    <div class="home-nav">
      <div class="nav-info">
        <span>{商户名称}</span>
        <p>业务员名称</p>
        <div class="exit" @click="handleExit">
          <i></i>
          退出
        </div>
      </div>
      <div class="nav-search">
        <div class="search-form">
          <van-search
              v-model="searchValue"
              show-action
              placeholder="请输入车牌号"
              @search="handleSearch"

          >
            <template #action>
              <div @click="handleSearch">搜索</div>
            </template>
          </van-search>
        </div>
        <button class="screen" @click.stop="handleFilter">
          <i></i>
          筛选
        </button>
      </div>
    </div>

    <div class="screen-view" v-show="isFilter" @click="isFilter = false">
      <div class="screen-wrap" @click.stop="$emit('null')">
        <div class="screen-content">
          <div class="screen-item">
            <span>状态</span>
            <button>待发放</button>
            <button>领取完成</button>
            <button>部分领取</button>
            <button>已作废</button>
          </div>
          <div class="screen-item">
            <span>车牌号</span>
            <input type="text" placeholder="请输入车牌号">
          </div>
          <div class="screen-item">
            <span>车主姓名</span>
            <input type="text" placeholder="请输入车主姓名">
          </div>
          <div class="screen-item">
            <span>创建时间</span>
            <input class="start-time time" type="text" placeholder="开始时间" @click.stop="isStartTime = true"
                   v-model="startTime">
            <div class="start-time-info" v-show="isStartTime" @click.stop="isStartTime = false">
              <van-datetime-picker
                  v-model="currentDate"
                  type="date"
                  :columns-order="['year', 'month', 'day']"
                  :formatter="formatter"
                  @confirm="handleConfirmStart"
              />
            </div>
            <div class="icon">-</div>
            <input class="end-time time" type="text" placeholder="结束时间" @click.stop="isEndTime = true"
                   v-model="endTime">
            <div class="end-time-info" v-show="isEndTime" @click.stop="isEndTime = false">
              <van-datetime-picker
                  v-model="currentDate"
                  type="date"
                  :columns-order="['year', 'month', 'day']"
                  :formatter="formatter"
                  @confirm="handleConfirmEnd"
              />
            </div>
          </div>
        </div>
        <button class="reset-button" type="reset">重置</button>
        <button class="screen-button" @click="isFilter = false">筛选</button>
      </div>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
      >
        <van-cell v-for="item in currentPageData" :key="item.id" @click="handleImageDetail(item.id)">
          <template>
            <div class="image-detail">
              <img :src="imageUrl(item.file.filepath)" alt="img">
              <div class="detail-content">
                <span>{{ item.title }}</span>
                <span>{{ item.updatedAt }}</span>
                <span>{{ item.description }}</span>
              </div>
            </div>
            <div class="image-button-group">
              <button @click.stop="handleUpdataImage({...item})">更新</button>
              <button @click.stop="handleDeleteImage(item.id)">删除</button>
            </div>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>

    <div class="popup-view" v-show="isPopup" @click="isPopup = false">
      <div class="content" @click.stop="$emit('null')">
        <h2>温馨提示</h2>
        <p>确认要删除这条数据吗？</p>
        <div class="button-box">
          <button class="cancle-button" @click.stop="isPopup = false">取消</button>
          <button class="grant-button" @click.stop="handleReissue">删除</button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <loading v-if="isLoading"></loading>
    </transition>

  </div>
</template>

<script>
import {doTabulation, doDelete} from '@/api/'
import {Throttle} from "@/utils/common";

export default {
  data() {
    return {
      isFilter: false,
      isStartTime: false,
      isEndTime: false,
      currentDate: new Date(),
      startTime: '',
      endTime: '',
      searchValue: '',
      searchList: '',
      imageList: '',
      current: 1,
      length: 10,
      currentPageData: '',
      totalPage: 1,
      type: '',
      title: '',
      description: '',
      loading: false,
      finished: false,
      refreshing: false,
      isLoading: false,
      id: '',
      isPopup: false,
    }
  },
  methods: {
    //退出
    handleExit() {
      window.localStorage.removeItem('token')
      this.$router.replace('/login')
    },
    //筛选
    handleFilter() {
      this.isFilter = !this.isFilter
    },
    formatter(type, val) {
      if (type === 'year') {
        return val + '年';
      }
      if (type === 'month') {
        return val + '月';
      }
      if (type === 'day') {
        return val + '日';
      }
      return val;
    },
    handleConfirmStart(val) {
      this.formatter()
      this.startTime = val
    },
    handleConfirmEnd(val) {
      this.formatter()
      this.endTime = val
    },
    handleSearch() {
      this.isLoading = true;
      const { searchValue } = this
      if ( searchValue ) {
        this.searchList = this.imageList.filter((item => (item.title).toString().indexOf(searchValue) >= 0))
        this.onLoad()
      }
    },
    //获取图片列表
    reqDataList(current) {
      doTabulation({current: current, length: 10}).then(result => {
        this.imageList = result.list.reverse()
        this.totalPage = Math.ceil(this.imageList.length / this.length)
        this.totalPage = this.totalPage === 0 ? 1 : this.totalPage
        this.current = current
        this.loading = false;
        this.isLoading = false;
        this.refreshing = false;
        this.getCurrentPageData()
      }).catch(error => {
        this.finished = true
      })
    },
    getCurrentPageData() {
      let end = this.current * this.length;
      this.currentPageData = this.imageList.slice(0, end);
      this.current ++
    },
    onLoad: Throttle(function () {
          if ( this.searchList ) {
            this.currentPageData = this.searchList
            this.isLoading = false;
          } else {
            this.reqDataList(this.current)
            this.loading = false;
            if (this.current > this.totalPage) {
              this.finished = true
            }
          }
        },1000),
    onRefresh(){
      this.finished = false;
      this.reqDataList(1)
      this.loading = true;
    },
    //获取图片url路径
    imageUrl(filepath) {
      return ("https://img.daysnap.cn/api/" + filepath)
    },
    handleImageDetail(id){
      this.$router.push({
        path: '/imagedetail',
        query: {
          id: id
        }
      })
    },
    handleUpdataImage(data = {}){
      this.$router.push({
        path: '/imagecreate',
        query: {
          data,
        }
      })
    },
    // 删除图片
    handleDeleteImage(id) {
      this.id = id
      this.isPopup = true
    },
    handleReissue() {
      const {id} = this
      doDelete(id).then(() => {
        this.isPopup = false
        this.reqDataList(1)
      }).catch(error => {
        console.dir(error)
      })
    },
  },
  mounted() {
    this.isLoading = true
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/define.scss';

.home-view {
  overflow-y: auto;
  height: 100vh;
  position: relative;
  padding-bottom: j(50);
}

.home-nav {
  background: #EB1E23;
  position: relative;
}

.nav-info {
  display: flex;
  align-items: center;
  padding: 0 j(12);
  box-sizing: border-box;
  padding-bottom: j(10);

  span {
    height: j(24);
    font-size: j(18);
    font-weight: 500;
    color: #FFFFFF;
    line-height: j(24);
    margin-right: j(5);
  }

  p {
    flex: 1;
    height: j(20);
    font-size: j(15);
    font-weight: 500;
    color: #FFFFFF;
    line-height: j(20);
  }
}

.exit {
  display: flex;
  align-items: center;
  align-self: flex-end;
  height: j(20);
  font-size: j(14);
  color: #FFFFFF;
  line-height: j(20);
  padding-left: j(3);

  i {
    display: block;
    width: j(16);
    height: j(16);
    background: url(@/assets/images/exit.png) left center no-repeat;
    background-size: j(16) j(16);
  }
}

.nav-search {
  height: j(60);
  background: rgba(255, 255, 255, 1);
  border-radius: j(20) j(20) 0 0;
  padding: j(12);
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.search-form {
  flex: 1;
  height: j(36);
  box-sizing: border-box;
  background: #F5F5F5;
  border-radius: j(8);
  display: flex;
  align-items: center;

  .van-search {
    flex: 1;
    background: transparent;
    padding: 0 !important;

    .van-search__action {
      height: j(24);
      line-height: j(24);
      font-size: j(12);
      border-radius: j(4);
      background-color: red;
      color: #fff;
      margin-right: j(10);
    }
  }
}

.screen {
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  height: j(20);
  font-size: j(14);
  color: #333333;
  line-height: j(20);
  margin-left: j(5);

  i {
    width: j(16);
    height: j(16);
    background: url(@/assets/images/filter.png) no-repeat;
    background-size: j(16) j(16);
    margin-right: j(5);
  }
}

.screen-view {
  position: fixed;
  top: j(96);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 3;
}

.screen-wrap {
  box-sizing: border-box;
  background: #FFFFFF;
}

.screen-content {
  display: flex;
  flex-direction: column;
  padding: 0 j(12) j(20);
}

.screen-item {
  height: j(36);
  margin-top: j(52);
  position: relative;
  display: flex;

  span {
    position: absolute;
    left: 0;
    top: j(-32);
  }

  input {
    flex: 1;
    text-align: center;
    min-width: 0;
    border: none;
    box-sizing: border-box;
    padding: 0 j(16);
    font-size: j(16);
    color: #333;
    background: #F5F5F5;
    border-radius: 8px;
  }

  button {
    width: j(81);
    height: j(36);
    background: #F5F5F5;
    border-radius: 8px;
    border: none;
    color: #333;
  }

  &:first-child {
    justify-content: space-between;
  }
}

.icon {
  width: j(9);
  height: j(36);
  line-height: j(36);
  font-size: j(20);
  color: #333333;
  padding: 0 j(5);
}

.reset-button, .screen-button {
  width: 50%;
  border: none;
  box-sizing: border-box;
}

.reset-button {
  height: j(45);
  border-top: 1px solid #D6D6D6;
  background: #FFFFFF;
  font-size: j(16);
  font-weight: 500;
  color: #666666;
  line-height: j(24);

}

.screen-button {
  background: #EB1E23;
  height: j(46);
  font-size: j(16);
  font-weight: 600;
  color: #FFFFFF;
  line-height: j(16);
}

.start-time-info, .end-time-info {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.image-detail {
  display: flex;
  align-items: center;

  img {
    display: block;
    width: j(100);
    height: j(100);
    margin-right: j(10);
  }
}

.detail-content {
  display: flex;
  flex-direction: column;
  flex: 1;

  span {
    font-size: j(16);
    line-height: j(32);
    text-align: right;
    margin-bottom: j(10);
  }
}

.image-button-group {
  display: flex;
  margin-top: j(20);
  button {
    width: j(40);
    border: none;
    background-color: rgba(150, 250, 250, 0.99);
    border-radius: j(8);
    flex:1
  }
  button:last-child {
    margin-left: j(10);
  }
}
.van-list {
  margin-bottom: j(50);
}
.popup-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  .content {
    width: j(320);
    margin: 0 auto;
    background: #FFFFFF;
    border-radius: j(8);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    h2 {
      font-size: j(17);
      font-weight: 500;
      color: #333333;
      line-height: j(24);
      margin-top: j(32);
      margin-bottom: j(16);
    }
    p {
      font-size: j(17);
      color: #666666;
      line-height: j(24);
      margin-bottom: j(32);
    }
  }
}
.button-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #D9D9D9;
  button {
    border: none;
    width: 50%;
    height: j(54);
    background-color: transparent;
    font-size: j(17);
    font-weight: 500;
    line-height: j(24);
    letter-spacing: j(1);
    box-sizing: border-box;
  }
}
.cancle-button {
  border: none;
  color: #333333;
  border-right: 1px solid #D9D9D9;
}
.grant-button {
  border: none;
  color: #2061E6;
}
</style>