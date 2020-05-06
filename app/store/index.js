import { observable, action, configure, runInAction } from 'mobx-miniprogram';
import http from '../utils/http';
// 使用严格模式，只能通过action更改属性
// configure({ enforceActions: true });

export const store = observable({

  userInfo: null,
  // 登录
  setUserInfo: action(function(userInfo){
    this.userInfo = userInfo;
  })
})