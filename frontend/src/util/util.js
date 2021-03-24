import Moment from 'moment'

export const processDate = (date) => {
   return Moment(date).format('MMMM Do YYYY, h:mm:ss a');
}

export const catchError = func => {
   return async ({ commit, rootState }, payload) => {
      try {
         return await func({ commit, rootState }, payload);
      } catch (error) {
         if (error.response) {
            const errors = error.response.data.errors
            if (errors.length === 1) {
               throw errors[0]
            } else {
               throw errors.join(', ')
            }
         } else {
            throw 'Server Error'
         }
      }
   };
};