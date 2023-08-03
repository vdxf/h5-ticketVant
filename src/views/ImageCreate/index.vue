<template>
  <div class="c-view-wrap" >
    <div class="c-card">
      <div class="section-content">
        <label class="choose-image">
          <img :src=imgUrl alt="img" v-if="imgUrl">
          <img src="@/assets/images/imageUpload.jpg" alt="img" v-else>
          <input type="file" @change="handleFiles" style="opacity: 0">
        </label>
        <div class="image-title">
          <input type="text" placeholder="请输入图片的标题" v-model="title">
        </div>
        <div class="image-button-group">
          <label>
            <input type="radio" id="public" name="image" value="public" v-model="type" @change="handleType">public
          </label>
          <label>
            <input type="radio" id="private" name="image" value="private" v-model="type" @change="handleType">private
          </label>
        </div>
        <textarea class="picture-detail" style="resize: none" rows="4" placeholder=" 图片详细信息"
                  v-model="description">
        </textarea>
        <button type="submit" class="c-button" @click="handleUploadImage">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import {doFile, doGain, doUpdata} from "@/api";
import Loading from "@/components/Loading/index.vue";

export default {
  data() {
    return {
      id: '',
      title: '',
      description: '',
      type: '',
      fileId: '',
      files: '',
      imgUrl: '',
      data: '',
      isLoading: false,
    }
  },
  methods: {
    handleFiles(event) {
      this.files = event.target.files
      let formData = new FormData();
      formData.append('file', this.files[0]);

      doFile(formData).then(result => {
        this.fileId = result.id
        this.imgUrl = ("https://img.daysnap.cn/api/" + result.filepath)
      }).catch(error => {
        alert(error.response.data.msg)
      })
    },
    handleType() {
    },
    handleUploadImage() {
      const {title, description, type, fileId, id} = this
      //更新
     if (this.data) {
       doUpdata({title, type, description, fileId}, id).then(result => {
         this.$router.replace('/home')
       }).catch(error => {
         alert(error.response.data.msg)
       })
     } else {
       //创建
       doGain({title, description, type, fileId}).then(result => {
         this.$router.replace('/home')
       }).catch(error => {
         alert(error.response.data.msg)
       })
     }
    },
  },
  mounted() {
    if (this.$route.query.data.file) {
      this.data = this.$route.query.data
      const {id, title, description, type,} = this.$route.query.data
      const {fileId, filepath} = this.$route.query.data.file
      this.id = id
      this.fileId = fileId
      this.title = title
      this.description = description
      this.type = type
      this.imgUrl = "https://img.daysnap.cn/api/" + filepath
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/define.scss';

.c-card {
  padding-bottom: j(80);
}

.section-content {
  display: flex;
  flex-direction: column;
}

.choose-image {
  img {
    display: block;
    width: j(160);
    height: j(160);
  }

  input {
    margin-top: j(10);
  }
}

.image-title {
  padding: j(10);
  border: 1px solid #000000;
  margin-top: j(20);
  margin-bottom: j(20);
  border-radius: j(4);
  display: flex;

  input {
    flex: 1;
    outline: none;
  }
}

.image-button-group {
  display: flex;
  align-items: center;
  height: j(40);
  flex-direction: row;
  margin-bottom: j(20);

  input {
    background-color: transparent;
  }
}

.picture-detail {
  border: 1px solid #333;
  border-radius: j(8);
  outline: none;
  margin-bottom: j(20);
}
</style>