const origin = "http://localhost:5000";

const noAuthUrls = [
  '/api/mini_program/login'
];

function checkAuthUrl(url) {
  for (const o in noAuthUrls) {
    if (url.indexOf(o) !== -1) {
      return false;
    }
  }
  return true;
}

function handleErrorResponse(resp) {
  var msg = '服务器开小差了';
  if (resp.statusCode === 401) {
    msg = '请重新登录';
  } else if (resp.statusCode === 403) {
    msg = '请重新登录';
  } else {

  }

  return msg;
}

function handleSuccessResponse(resp) {
  if (!resp) {
    return;
  }
  return resp.data;
}

function getDefaultHeader() {
  return {
    'content-type': 'application/json'
  }
}

async function addAuthHeader(headers) {
  var user = wx.getStorageSync('user');
  if (user && user.token) {
    var accessToken = user.token.AccessToken;
    var refreshToken = user.token.RefreshToken;

    // 刷新 token 过期
    if (new Date(refreshToken.Expires) < new Date()) {
      wx.clearStorageSync('user');
      console.log('登录过期');
      return false;
    }

    // token 过期
    if (new Date(accessToken.TokenContent) < new Date()) {
      user.token.AccessToken = user.token.RefreshToken;
      wx.setStorageSync('user', user);
      var resp = await get('api/auth_user/refresh_access_token');
      wx.setStorageSync('user', resp)
      return true;
    }

    headers.Authorization = `Bearer ${accessToken.TokenContent}`
    return true
  }

  return false;
}

function get(url, header) {
  return new Promise(async (resolve, reject) => {
    if (!header) {
      header = getDefaultHeader();
    }
    var result = await addAuthHeader(header);
    if (result || !checkAuthUrl(url)) {
      wx.request({
        url: origin + url,
        method: 'GET',
        header: header,
        success: res => resolve(handleSuccessResponse(res)),
        fail: res => reject(handleErrorResponse(res))
      })
    }
  })
}

function post(url, data, header) {
  return new Promise(async (resolve, reject) => {
    if (!header) {
      header = getDefaultHeader();
    }
    var result = await addAuthHeader(header);
    if (result || !checkAuthUrl(url)) {
      wx.request({
        url: origin + url,
        method: 'POST',
        data,
        success: res => resolve(handleSuccessResponse(res)),
        fail: res => reject(handleErrorResponse(res))
      })
    }
  })
}

export default {
  get,
  post
}