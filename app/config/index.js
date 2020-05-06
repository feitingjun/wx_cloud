/*
  为什么不放在globalData里面？
  globalData加载时机的问题，在app.js的onLaunch方法里面globalData还未定义，如果在这儿调用http请求会导致http请求里的globalData参数不存在
*/
import { promisifyAll } from 'miniprogram-api-promise';
const wxp = {};
promisifyAll(wx, wxp);

const base = 'https://wqxz.h-passer.com';

export {
  wxp,
  base
}