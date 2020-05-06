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

// export const updateUserInfo = async (userInfo) => {
//   const data = await wx.cloud.callFunction({
//     name: NAME,
//     data:{
//       $url: 'update',
//       userInfo
//     }
//   })
// }