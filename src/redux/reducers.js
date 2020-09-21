import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import alert from './alert/reducer';
import cart from './cart/reducer';


const reducers = combineReducers({
  menu,
  settings,
  authUser,
  alert,
  cart
});

export default reducers;