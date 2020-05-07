// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
const rp = require('request-promise');
const dateFormat = require('./dateFormat');

const ENV = 'development-y2j06' || cloud.DYNAMIC_CURRENT_ENV

cloud.init({
  env: ENV
})

console.log(cloud.getWXContext())
const db = cloud.database();
const User = db.collection('users');
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  const wxContext = cloud.getWXContext()

  const openid = wxContext.OPENID

  // 获取或者创建用户信息
  app.use('get', async (ctx, next) => {
    const wxInfo = ctx._req.event.wxInfo;
    const user = await User.where({ openid }).field({ openid: 0 }).get();
    if (user.data.length == 0) {
      const { _id } = await User.add({
        data: {
          openid: wxContext.OPENID,
          unioniD: wxContext.UNIONID,
          wxInfo,
          createAt: db.serverDate()
        }
      })
      const { data } = await User.doc(_id).field({ openid: 0 }).get();
      ctx.body = { ...data, createAt: dateFormat('YYYY-mm-dd HH:SS:MM', data.createAt) };
    } else {
      const _id = user.data[0]._id;
      if (wxInfo) {
        await User.doc(_id).update({ data: { wxInfo } })
      }
      const { data } = await User.doc(_id).field({ openid: 0 }).get();
      ctx.body = { ...data, createAt: dateFormat('YYYY-mm-dd HH:SS:MM', data.createAt) };
    }
  })

  // 获取天气信息
  app.use('weather', async (ctx, next) => {
    const { lat, lng } = ctx._req.event;
    const data = await rp({
      url: 'https://free-api.heweather.net/s6/weather/now',
      qs: {
        location: `${lng},${lat}`,
        key: '62638ae6517247a5999826224b080e06'
      },
      json: true
    })
    const cid = data.HeWeather6[0].basic.cid.replace(/[^0-9]/ig,"");
    const values = await Promise.all([
      rp({
        url: 'https://tianqiapi.com/free/day',
        qs: {
          appid: '59714388',
          appsecret: 'gr5tLagu',
          cityid: cid
        },
        json: true
      }),
      rp({
        url: 'https://www.tianqiapi.com/free/week',
        qs: {
          appid: '59714388',
          appsecret: 'gr5tLagu',
          cityid: cid
        },
        json: true
      }),
      rp({
        url: 'https://free-api.heweather.net/s6/weather/lifestyle',
        qs: {
          location: `${lng},${lat}`,
          key: '62638ae6517247a5999826224b080e06'
        },
        json: true
      })
    ])
    debugger
    ctx.body = { 
      cityid: cid,
      ...data.HeWeather6[0], 
      now1: values[0],
      week: values[1].data,
      lifestyle: values[2].HeWeather6[0].lifestyle
    }
  })

  return app.serve()
}