import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../store/index';
import { getUserInfo, getWeather } from '../../service/user/index';
import QQMapWX from '../../utils/qqmap-wx-jssdk.min';

const Map = new QQMapWX({
  key: 'YQCBZ-AVAWS-R2POH-6XY5K-VNOKV-NWFBP'
});

const { statusBarHeight, screenWidth } = wx.getSystemInfoSync();
const { left } = wx.getMenuButtonBoundingClientRect();
const app = getApp()
Page({
  data: {
    cloud_img: app.globalData.cloud_img,
    weather: {},
    statusBarHeight: statusBarHeight,
    right: screenWidth - left + 10,
    scrollTop: 0
  },
  onLoad: function() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['userInfo']
    })
    this.storeBindings.updateStoreBindings()
    this.getLocation()
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  getLocation(){
    const _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: async res => {
        const data = await getWeather(res.latitude, res.longitude);
        Map.reverseGeocoder({
          location: { latitude: res.latitude, longitude: res.longitude },
          coord_type: 1,
          success: (r, d) => {
            _this.setData({
              weather: data,
              city: d.reverseGeocoderSimplify.city,
              province: d.reverseGeocoderSimplify.province,
              district: d.reverseGeocoderSimplify.district
            })
          }
        })
      }
    })
  },
  bindscroll(e){
    this.setData({
      scrollTop: e.detail.scrollTop + 44 + statusBarHeight
    })
  },
  bindgetuserinfo(e){
    getUserInfo(e.detail.userInfo);
  }
})
