import { store } from '../../store/index';

const NAME = 'user';

export const getUserInfo = async (wxInfo) => {
  const data = await wx.cloud.callFunction({
    name: NAME,
    data: {
      $url: 'get',
      wxInfo
    }
  })
  if(data.errMsg === 'cloud.callFunction:ok'){
    store.setUserInfo(data.result)
  }
}

export const getWeather = async (lat, lng) => {
  const data = await wx.cloud.callFunction({
    name: NAME,
    data: {
      $url: 'weather',
      lat,
      lng
    }
  })
  if(data.errMsg === 'cloud.callFunction:ok'){
    return data.result;
  }
  return null;
}

// export const updateUserInfo = async (userInfo) => {
//   const data = await wx.cloud.callFunction({
//     name: NAME,
//     data:{
//       $url: 'update',
//       userInfo
//     }
//   })
// }