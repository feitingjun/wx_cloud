// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
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

    const user = await User.where({
      openid
    }).field({
      openid: 0
    }).get();

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
        await User.doc(_id).update({
          data: {
            wxInfo
          }
        })
      }
      const { data } = await User.doc(_id).field({ openid: 0 }).get();
      ctx.body = { ...data, createAt: dateFormat('YYYY-mm-dd HH:SS:MM', data.createAt) };
    }
  })

  // 更新用户信息
  app.use('update', async (ctx, next) => {
    const user = await User.where({
      openid
    }).update({
      data: {
        wxInfo: ctx._req.event.wxInfo
      }
    })
  })

  return app.serve()
}