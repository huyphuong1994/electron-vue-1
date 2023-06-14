<template>
  <div class="ui equal width center aligned padded grid">
    <div class="row" style="padding: 0">
      <h3 class="ui block header" style="width: 100%; margin: 0; border-radius: 0">
        Block Header
      </h3>
    </div>
    <div class="row" style="padding: 0">
      <div class="column border-right-1" style="text-align: left; padding: 0; height: calc(100vh - 50px)">
        <div class="ui small form border-bottom-1" style="padding: 24px">
          <div class="two fields driving">
            <div class="field">
              <label>Tên Nhóm</label>
              <input placeholder="First Name" type="text">
            </div>
            <div class="field">
              <label>Token Bot</label>
              <input placeholder="Last Name" type="text">
            </div>
            <div class="field">
              <label>Chat ID</label>
              <input placeholder="Last Name" type="text">
            </div>
          </div>
          <div class="ui submit button">Thêm Mới</div>
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
      <div class="column border-right-1">
        <div style="padding: 24px; width: 100%">
          <table class="ui celled table">
            <thead>
            <tr><th>Name</th>
              <th>Age</th>
              <th>Job</th>
            </tr></thead>
            <tbody>
            <tr>
              <td data-label="Name">James</td>
              <td data-label="Age">24</td>
              <td data-label="Job">Engineer</td>
            </tr>
            <tr>
              <td data-label="Name">Jill</td>
              <td data-label="Age">26</td>
              <td data-label="Job">Engineer</td>
            </tr>
            <tr>
              <td data-label="Name">Elyse</td>
              <td data-label="Age">24</td>
              <td data-label="Job">Designer</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row" style="padding: 0">
      <!--      <div class="column">Custom Row</div>-->
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');

export default {
  name: "ToolTelegram",
  data() {
    return {
      webhookData: null
    };
  },
  mounted() {
    ipcRenderer.on('webhookData', (event, webhookData) => {
      this.webhookData = webhookData;
    });

    ipcRenderer.send('getUsers');
    // ipcRenderer.send('create_group_a', ["Group A", "6203276528:AAFH8V5F8g1v6Tg4F_TcVu6aAg4BkWAOu-I", "-1001912582823"]);

    ipcRenderer.on('users', (event, users) => {
      console.log('1av', users)
      this.users = users;
    });
  }
}
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css";
.read-the-docs {
  color: #888;
}
</style>
