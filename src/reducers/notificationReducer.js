
//reducer function for updating updateNotificaton state
export default function reducer (state,action) {
    const {type,payload,sendId} = action
    switch (type) {
      //for addition of a new message notification 
      case 'add-notification':
        console.log('add-notification:',payload);
        return {updateObj:[{
          dateTime:Date.now(),
          read:false,
          ...payload}],
          sendId:sendId};   
      //case to clear data usually in case of when uplaod of notificaiton is finished 
      case 'clear-data':
          return  [] ;
      //default to retun current state  
      default:
          return state;
      }
  };