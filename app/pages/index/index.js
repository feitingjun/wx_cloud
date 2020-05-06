import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../store/index';
import { getUserInfo } from '../../service/user/index';

const app = getApp()

Page({
  data: {
    
  },
  onLoad: function() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['userInfo']
    })
    this.storeBindings.updateStoreBindings()
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  bindgetuserinfo(e){
    getUserInfo(e.detail.userInfo);
  }
})
