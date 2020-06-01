/**
 * api接口统一管理
 */
import {get, post, patch, put} from '@/utils/http'
// 登录
export const login = p => post('login', p)
// 登出
export const logout = p => post('logout', p)

/**
 * 用户管理
 */
export const user_list = p => post('user/list', p)
export const user_add = p => post('user/add', p)
export const user_modify = p => post('user/modify', p)
export const user_del = p => post('user/del', p)
export const user_findModelByUserId = p => post('user/findModelByUserId', p)
// 授权角色给用户
export const user_addRoleToUser = p => post('user/addRoleToUser', p)
// 根据用户查询角色
export const user_queryRoleByUser = p => post('user/queryRoleByUser', p)

/**
 * 角色管理
 */
export const role_list = p => post('role/list', p)
export const role_add = p => post('role/add', p)
export const role_modify = p => post('role/modify', p)
export const role_del = p => post('role/del', p)
export const role_addMenuToRole = p => post('role/addMenuToRole', p)

/**
 * 菜单管理
 */
// 添加菜单
export const menu_add = p => post('/menu/add', p)
// 修改菜单
export const menu_modify = p => post('/menu/modify', p)
// 查询指定用户的菜单
export const menu_findUserMenu = p => post('/menu/findUserMenu', p)
// 查询所有菜单
export const menu_findAllMenu = p => post('/menu/findAllMenu', p)
// 查询所有菜单通过角色
export const menu_findAllMenuByRoleId = p => post('/menu/findAllMenuByRoleId', p)
// 启用菜单
export const menu_enable = p => post('/menu/enable', p)
// 停用菜单
export const menu_stop = p => post('/menu/stop', p)

/**
 * 日报相关
 */
export const daily_list = p => post('daily/list', p)
export const daily_exportDaily = p => post('daily/exportDaily', p)
