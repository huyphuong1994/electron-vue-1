<template>
  <div class="ui equal width center aligned padded grid">
    <div class="row" style="padding: 0">
      <h3 class="ui block header"
          style="width: 100%; margin: 0; border-radius: 0; background: rgb(31 41 55); color: white; display: flex; align-items: center; justify-content: space-between">
        <div>
          Trạng Thái Kết Nối
        </div>
        <div style="display: flex; align-items: center; justify-content: center; cursor: pointer">
          <Toggle @change="setConnected" v-model="connected" offLabel="OFF" onLabel="ON"/>
          <i @click="openModal = true" style="margin-left: 10px; height: 100%" class="plus icon"></i>
        </div>
      </h3>
    </div>
    <div class="row" style="padding: 0; background: #E8E8E8">
      <div class="column border-right-1" style="text-align: left; padding: 0; height: calc(100vh - 50px)">
        <div class="" style="padding: 24px">
          <div class="border-bottom-1">
            <h4 class="ui header">
              <i class="plug icon"></i>
              <div class="content">
                Tạo kết nối
              </div>
            </h4>
            <div>
              <div style="margin: 24px">
                <div class="ui form">
                  <div class="field">
                    <label>Group truyền tin</label>
                    <select class="ui search dropdown">
                      <option value="">Chọn group truyền tin</option>
                      <option v-for="group in listGroup" :key="group.id" :value="group.id">{{
                          group.name_group
                        }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="ui form" style="margin-top: 24px; margin-bottom: 24px">
                  <div class="field">
                    <label>Group nhận tin</label>
                    <select class="ui search dropdown">
                      <option value="">Chọn group nhận tin</option>
                      <option v-for="group in listGroup" :key="group.id" :value="group.id">
                        {{ group.name_group }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="ui grey submit button">Thêm Mới</div>
              </div>
            </div>
          </div>

          <div style="margin-top: 24px">
            <h4 class="ui header">
              <i class="wifi icon"></i>
              <div class="content">
                Danh sách kết nối
              </div>
            </h4>
            <div style="margin: 24px">
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
                  <td data-label="Job">{{ group.status_webhook ? 'Đã Kết Nối' : "Gián Đoạn" }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="column border-right-1" style="background: #E8E8E8; text-align: left">
        <div style="padding: 24px; width: 100%" class="border-bottom-1">
          <h4 class="ui header">
            <i class="book icon"></i>
            <div class="content">
              Danh sách group
            </div>
          </h4>
          <div style="padding: 24px">
            <table class="ui celled table">
              <thead>
              <tr>
                <th>Tên Group</th>
                <th>Webhook</th>
              </tr>
              </thead>
              <tbody>
              <tr style="cursor: pointer" :class="group.id == groupActive ? 'background-active' : ''"
                  @click="getListTopicByG(group.id)" v-for="group in listGroup" :key="group.id">
                <td data-label="Name">{{ group.name_group }}</td>
                <td data-label="Job">{{ group.status_webhook ? 'Đã Kết Nối' : "Gián Đoạn" }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style="margin: 24px">
          <h4 class="ui header">
            <i class="plug icon"></i>
            <div class="content">
              Cập nhật quyền nhắn tin
            </div>
          </h4>
          <div style="margin: 24px" v-for="topic in listTopic">
            <div style="margin-bottom: 16px">
              <Toggle @change="setConnected" v-model="connected" offLabel="OFF" onLabel="ON"/>
              {{ topic.name_topic }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui modal" :class="openModal ? 'active' : ''" style="margin-top: 60px">
      <i @click="openModal = false" class="close icon"></i>
      <div class="header">Thêm mới kết nối</div>
      <div class="content">
        <div class="ui small form" style="padding: 24px">
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
          <!--          <div @click="createGroup()" class="ui grey submit button">Thêm Mới</div>-->
        </div>
      </div>
      <div class="actions">
        <div @click="openModal = false" class="ui red approve button">Bỏ Qua</div>
        <div @click="createGroup()" class="ui primary approve button">Tạo Group</div>
      </div>
    </div>
    <div class="row" style="padding: 0">
      {{ webhookData }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Toggle from '@vueform/toggle'

const {ipcRenderer} = require('electron');

export default {
  name: "ToolTelegram",
  components: {
    Toggle,
  },
  data() {
    return {
      openModal: false,
      connected: false,
      ngrokUrl: '',
      webhookData: null,
      listGroup: [],
      dataGroup: {
        name_group: "",
        token_bot: "",
        chat_id: ""
      },
      dataConnectGroup: {
        group_a_id: '',
        group_b_id: '',
      },
      groupActive: 0,
      listTopic: []
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
    async setConnected(value) {
      if (value) {
        try {
          const response = await axios.post(`http://127.0.0.1:3000/api/connect-webhook`)

          if (response.data.code = 200) {
            this.$notify({
              title: "Tạo kết nối webhook thành công!",
              type: 'success'
            });
            await this.fetchData();
          } else {
            this.$notify({
              title: "Tạo kết nối webhook thất bại!",
              type: 'error'
            });
          }
        } catch (e) {
          this.$notify({
            title: "Tạo kết nối webhook thất bại!",
            type: 'error'
          });
        }
      } else {
        try {
          const response = await axios.post(`http://127.0.0.1:3000/api/delete-webhook`)

          if (response.data.code = 200) {
            this.$notify({
              title: "Ngắt kết nối webhook thành công!",
              type: 'success'
            });
            await this.fetchData();
          } else {
            this.$notify({
              title: "Ngắt kết nối webhook thất bại!",
              type: 'error'
            });
          }
        } catch (e) {
          this.$notify({
            title: "Ngắt kết nối webhook thất bại!",
            type: 'error'
          });
        }
      }
    },

    async fetchData() {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/list-group`)

        if (response.data.code == 200) {
          this.listGroup = response.data.data;

          if (this.listGroup) {
            this.listGroup.forEach((group) => {
              if (group.status_webhook) {
                this.connected = true;
              }
            })
          }
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
    },

    async createConnectGroup() {
      try {
        const response = await axios.post(`http://127.0.0.1:3000/api/create-connect`, {
          values: [this.dataConnectGroup.group_a_id, this.dataConnectGroup.group_b_id]
        })

        if (response.data.code = 200) {
          this.$notify({
            title: "Tạo kết nối webhook thành công!",
            type: 'success'
          });
          await this.fetchData();
        } else {
          this.$notify({
            title: "Tạo kết nối webhook thất bại!",
            type: 'error'
          });
        }
      } catch (e) {
        this.$notify({
          title: "Tạo kết nối webhook thất bại!",
          type: 'error'
        });
      }
    },

    async getListTopicByG(id) {
      this.groupActive = id;
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/list-topic/${id}`);

        if (response.data.code == 200) {
          this.listTopic = response.data.data;
        } else {
          this.$notify({
            title: "Lấy danh sách group lỗi!",
            type: "error"
          });
        }
      } catch (e) {
        this.$notify({
          title: "Lấy danh sách topic lỗi!",
          type: "error"
        });
      }
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

<style src="@vueform/toggle/themes/default.css"></style>

