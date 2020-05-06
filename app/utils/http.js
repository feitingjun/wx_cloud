import { base } from '../config/index';
import { store } from '../store/index';

function requset(url, method, data, config={}){
  return new Promise((resolve, reject) => {
    wx.request({
      url: base + '/api' + url, 
      method: method,
      data: data,
      dataType: 'json',
      header: {
        'content-type': 'application/json', // 默认值
        ...config.headers
      },
      success: async function (res) {
        if(res.statusCode >=200 && res.statusCode<=300){
            resolve(res.data)
        }else{
          reject(res)
        }
      },
      fail: function (err) {
        isCirculation = 0;
        wx.showModal({
          content: '请求错误' + JSON.stringify(err),
          showCancel: false,
        })
        reject(err)
      }
    })
  })
}
export function uploadFile(filePath, formData, header ){
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: base + '/api' + '/upload_img',
      filePath,
      name: 'file',
      header: {
        ...header
      }, // 设置请求的 header
      formData, // HTTP 请求中其他额外的 form data
      success: function(res){
        let data;
        try {
          data = JSON.parse(res.data);
        } catch (error) {
          data = res.data
        }
        if(res.statusCode >=200 && res.statusCode<=300){
          resolve(data);
        }else{
          wx.showModal({
            content: '上传失败',
            showCancel: false,
          })
          reject(data);
        }
      },
      fail: function(err) {
        wx.showModal({
          content: '上传失败',
          showCancel: false,
        })
        reject(err);
      }
    })
  })
}

export default {
  get: (url, data, config) => {
    return requset(url, 'GET', data, config)
  },
  post: (url, data, config) => {
    return requset(url, 'POST', data, config)
  }
}