<template>
  <div class="ui equal width center aligned padded grid">
    <div class="row" style="padding: 0">
      <h3 class="ui block header"
          style="width: 100%; margin: 0; border-radius: 0; background: #1769ff; color: white; display: flex; align-items: center; justify-content: space-between">
        <div>
          Trạng Thái Kết Nối
        </div>
        <div @click="setConnected" class="ui toggle checkbox" :class="connected ? 'checked' : ''">
          <input type="checkbox" name="gift" tabindex="0" class="hidden">
          <label>Ngắt kết nối</label>
        </div>
        <!--        <img style="width: 25px; height: 25px; margin-right: 30px; cursor: pointer" src="public/connect.svg">-->
      </h3>
    </div>
    <div class="row" style="padding: 0; background: #E8E8E8">
      <div class="column border-right-1" style="text-align: left; padding: 0; height: calc(100vh - 50px)">
        <div class="" style="padding: 24px">
          <h4 class="ui header">
            <i class="plug icon"></i>
            <div class="content">
              Tạo kết nối
            </div>
          </h4>
          <div style="margin: 24px">
            <div class="ui form">
              <div class="field">
                <label>Group truyền tin</label>
                <select class="ui search dropdown">
                  <option value="">Chọn group truyền tin</option>
                  <option v-for="group in listGroup" :key="group.id" :value="group.id">{{ group.name_group }}</option>
                </select>
              </div>
            </div>
            <div class="ui form" style="margin-top: 24px">
              <div class="field">
                <label>Group nhận tin</label>
                <select class="ui search dropdown">
                  <option value="">Chọn group nhận tin</option>
                  <option v-for="group in listGroup" :key="group.id" :value="group.id">{{ group.name_group }}</option>
                </select>
              </div>
            </div>
            <h4 class="ui header">
              <!--            <i class="plug icon"></i>-->
              <div class="content">
                Thông tin topic của group nhận
              </div>
            </h4>
            <div>
              <div class="ui toggle checkbox">
                <input type="checkbox" name="public">
                <label>Subscribe to weekly newsletter</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column border-right-1" style="background: #E8E8E8; text-align: left">
        <div class="ui small form border-bottom-1" style="padding: 24px">
          <div class="two fields driving">
            <div class="field">
              <label>Tên Nhóm</label>
              <input v-model="dataGroup.name_group" placeholder="First Name" type="text">
            </div>
            <div class="field">
              <label>Token Bot</label>
              <input v-model="dataGroup.token_bot" placeholder="Last Name" type="text">
            </div>
            <div class="field">
              <label>Chat ID</label>
              <input v-model="dataGroup.chat_id" placeholder="Last Name" type="text">
            </div>
          </div>
          <div @click="createGroup()" class="ui grey submit button">Thêm Mới</div>
        </div>
        <div style="padding: 24px; width: 100%">
          <table class="ui celled table">
            <thead>
            <tr>
              <th>Tên Group</th>
              <th>Webhook</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="group in listGroup" :key="group.id">
              <td data-label="Name">{{ group.name_group }}</td>
              <td data-label="Job">{{ group.status_webhook }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row" style="padding: 0">
      {{webhookData}}
      <!--      <div class="column">Custom Row</div>-->
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const {ipcRenderer} = require('electron');

export default {
  name: "ToolTelegram",
  data() {
    return {
      connected: false,
      ngrokUrl: '',
      webhookData: null,
      listGroup: [],
      dataGroup: {
        name_group: "",
        token_bot: "",
        chat_id: ""
      }
    };
  },
  // created() {
  //   // Gửi yêu cầu để nhận URL công khai từ quá trình chính
  //   ipcRenderer.send('getNgrokUrl');
  //
  //   // Lắng nghe sự kiện 'ngrokUrl' và nhận URL công khai
  //   ipcRenderer.on('ngrokUrl', (event, url) => {
  //     this.ngrokUrl = url;
  //     console.log('URL công khai:', url);
  //   });
  // },
  mounted() {
    ipcRenderer.on('webhookData', (event, webhookData) => {
      this.webhookData = webhookData;
    });
    this.fetchData();
  },
  methods: {
    async setConnected() {
      this.connected = !this.connected;
      try {
        const response = await axios.post(`http://127.0.0.1:3000/api/connect-webhook`)

        console.log('Kết quả kết nối webhook', response)
      } catch (e) {
        console.log('Kết nối webhook', e)
      }
    },
    async fetchData() {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/list-group`)

        if (response.data.code == 200) {
          this.listGroup = response.data.data;
        } else {
          this.$notify({
            title: "Lấy danh sách group lỗi!",
            type: 'error'
          });
        }
      } catch (e) {
        this.$notify({
          title: "Lấy danh sách group lỗi!",
          type: "error"
        });
        console.log('Danh sách group', e)
      }
    },
    async createGroup() {
      try {
        const response = await axios.post(`http://127.0.0.1:3000/api/create-group`, {
          values: [
            this.dataGroup.name_group,
            this.dataGroup.token_bot,
            this.dataGroup.chat_id
          ]
        });

        if (response.data.code == 200) {
          this.$notify({
            title: "Tạo mới group thành công!",
            type: 'success'
          });
        } else {
          this.$notify({
            title: "Tạo mới group thất bại!",
            type: 'error'
          });
        }
      } catch (error) {
        this.$notify({
          title: "Tạo mới group thất bại!",
          type: 'error'
        });
        console.error('Lỗi khi gọi API:', error);
      }
      // ipcRenderer.send('create_group', ["Group A", "6203276528:AAFH8V5F8g1v6Tg4F_TcVu6aAg4BkWAOu-I", "-1001912582823"]);
    }
  }
}
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css";

.read-the-docs {
  color: #888;
}
</style>
