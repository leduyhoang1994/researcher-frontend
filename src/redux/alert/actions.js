import {
  TOGGLE_ALERT
} from '../actions';


export const toggleAlert = (data) => {
  return (
      {
          type: TOGGLE_ALERT,
          payload: data
      }
  )
}

