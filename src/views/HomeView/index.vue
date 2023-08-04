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
              v-model="keyword"
              show-action
              placeholder="请输入搜索关键词"
              @search="handleSearch"
          >
            <template #action>
              <div @click="handleSearch">搜索</div>
            </template>
          </van-search>
        </div>
      </div>
    </div>

    <van-pull-refresh class="content" v-model="refreshing" @refresh="handleRefresh" ref="view">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="handleLoad"
      >
        <van-cell v-for="item in imageList" :key="item.id" @click="handleImageDetail(item.id)">
          <template>
            <div class="image-detail">
              <vs-image :src="item.file.filepath" wr="200" alt="img" />
              <div class="detail-content">
                <span>{{ item.title }}</span>
                <span>{{ item.updatedAt }}</span>
                <span>{{ item.description }}</span>
              </div>
            </div>
            <div class="image-button-group">
              <button v-preventReClick @click.stop="handleUpdataImage({ ...item } )">更新</button>
              <button @click.stop="handleDeleteImage( item.id) ">删除</button>
            </div>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {doTabulation, doDelete, doDetail} from '@/api/'
import {Dialog} from 'vant';
import {Toast} from 'vant';
import VsImage from "@/components/VsImage.vue";
import {withLoading} from "@/utils/withLoading";

export default {
  data() {
    return {
      keyword: '',
      keyword111: '',
      imageList: [],
      current: 0,
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
    }
  },
  watch: {
    'keyword': {
      immediate: true,
      handler ( nv ) {
        if (!nv) {
          this.keyword111 = nv
          this.handleRefresh()
        }
      }
    }
  },
  methods: {
    //退出
    handleExit() {
      window.localStorage.removeItem('token')
      this.$router.replace('/login')
    },
    //搜索
    handleSearch() {
      this.keyword111 = this.keyword
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      this.handleRefresh()
      this.$refs.view.$el.scrollTop = 0
    },
    //获取图片列表
    reqDataList(current) {
      doTabulation({
        current: current,
        length: 10,
        keyword: this.keyword111,
      }).then(result => {
        const {list, count} = result
        this.imageList = current === 1 ? list : [...this.imageList, ...list]
        this.finished = this.imageList.length >= count
        this.current = current
      }).catch(error => {
        console.log('error =>', error)
        this.error = true
      }).finally(() => {
        this.loading = false
        this.refreshing = false
      })
    },
    handleLoad() {
      this.reqDataList(this.current + 1)
    },
    handleRefresh() {
      this.reqDataList(1)
    },
    //获取图片url路径
    imageUrl(filepath) {
      return ("https://img.daysnap.cn/api/" + filepath)
    },
    handleImageDetail(id) {
      this.$router.push({
        path: '/imagedetail',
        query: {
          id: id
        }
      })
    },
    handleUpdataImage(data = {}) {
      this.$router.push({
        path: '/imagecreate',
        query: {
          data,
        }
      })
    },
    async sheep (ms){
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
    // 删除图片
    async handleDeleteImage(id) {
      const d = withLoading(async ()=>{
        console.log('11')
        await  this.sheep(3000)
        alert(1)
      })
      await d()

      Dialog.confirm({
        title: '温馨提示',
        message: '确认要删除吗',
      }).then(() => {
        doDelete(id).then(() => {
          this.isPopup = false
          this.reqDataList(1)
        }).catch(error => {
          console.dir(error)
        })
      }).catch(() => {
            // on cancel
      });
    },
  },
  components: {
    VsImage
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/define.scss';

.home-view {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  position: relative;
  padding-bottom: j(50);
}

.content {
  flex: 1;
  overflow-y: auto;
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
    flex: 1
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