import { getUserInfo } from './service/user/index';
import { wxp } from './config/index';
App({
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'development-y2j06',
        traceUser: true,
      })
      const { authSetting } = await wxp.getSetting();
      if(authSetting['scope.userInfo']){
        const { userInfo } = await wxp.getUserInfo({ lang: 'zh_CN' });
        getUserInfo(userInfo)
      }else{
        getUserInfo();
      }
    }
    this.globalData = {}
  }
})
