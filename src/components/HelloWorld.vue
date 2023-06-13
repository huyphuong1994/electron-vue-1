<template>
  <div class="ui small form">
    <div class="two fields">
      <div class="field">
        <label>Tên Nhóm Gửi</label>
        <input placeholder="First Name" type="text">
      </div>
      <div class="field">
        <label>Token Bot Gửi</label>
        <input placeholder="Last Name" type="text">
      </div>
      <div class="field">
        <label>Chat ID Gửi</label>
        <input placeholder="Last Name" type="text">
      </div>
    </div>
    <div class="ui submit button">Thêm Mới</div>
  </div>
</template>

<script>
// const { ipcRenderer } = require('electron');

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
