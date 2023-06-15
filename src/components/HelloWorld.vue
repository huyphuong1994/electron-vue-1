<template>
  <div class="ui equal width center aligned padded grid">
    <div class="row" style="padding: 0">
      <h3 class="ui block header" style="width: 100%; margin: 0; border-radius: 0; background: #1769ff; color: white">
        Trạng Thái Kết Nối
      </h3>
    </div>
    <div class="row" style="padding: 0; background: #E8E8E8">
      <div class="column border-right-1" style="text-align: left; padding: 0; height: calc(100vh - 50px)">
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
          <div @click="createGroup()" class="ui submit button">Thêm Mới</div>
        </div>
        <div class="" style="padding: 24px">
          <h4 class="ui header">
            <i class="plug icon"></i>
            <div class="content">
              Tạo kết nối
            </div>
          </h4>
        </div>
      </div>
      <div class="column border-right-1" style="background: #E8E8E8">
        <div style="padding: 24px; width: 100%">
          <table class="ui celled table">
            <thead>
            <tr>
              <th>Tên Group</th>
              <th>Token Bot</th>
              <th>Chat ID</th>
              <th>Admins</th>
              <th>Topic</th>
              <th>Cấm Chat</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="group in listGroup" :key="group.id">
              <td data-label="Name">{{group.name_group}}</td>
              <td data-label="Age">{{group.token_bot}}</td>
              <td data-label="Job">{{group.chat_id}}</td>
              <td data-label="Job">{{group.admins}}</td>
              <td data-label="Job">{{group.topic_id}}</td>
              <td data-label="Job">{{group.status_chat}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {{ webhookData }}
    <div class="row" style="padding: 0">
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
    async fetchData() {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/list-group`)

        this.listGroup = response.data;
      } catch (e) {
        console.log('123213')
      }
    },
    async createGroup() {
      try {
        const response = await axios.post(`${this.ngrokUrl}/api/create-group`, {
          values: [
            this.dataGroup.name_group,
            this.dataGroup.token_bot,
            this.dataGroup.chat_id
          ]
        });

        // const data = response.data;
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
      // ipcRenderer.send('create_group', ["Group A", "6203276528:AAFH8V5F8g1v6Tg4F_TcVu6aAg4BkWAOu-I", "-1001912582823"]);

      // ipcRenderer.send('create_group', [this.dataGroup.name_group, this.dataGroup.token_bot, this.dataGroup.chat_id]);
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
