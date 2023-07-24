import Cookies from 'js-cookie';

// 定义保存token的cookie键名
const TokenKey = 'vue_houguan';

/**
 * 获取token
 * @returns {string|null} 返回存储在cookie中的token值，若不存在则返回null
 */
export function getToken() {
  return Cookies.get(TokenKey);
}

/**
 * 设置token
 * @param {string} token 要保存的token值
 * @returns {boolean} 返回是否成功设置token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token, { sameSite: 'None', secure: true });
}

/**
 * 移除token
 * @returns {boolean} 返回是否成功移除token
 */
export function removeToken() {
  return Cookies.remove(TokenKey);
}

