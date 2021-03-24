/* eslint-disable no-unused-vars */
import { catchError } from '@/util/util.js'
import axios, { URL } from '@/util/AxiosConfig.js';

const state = {
   accessToken: localStorage.getItem('accessToken') || null,
   user: localStorage.getItem('user') || null,
};

const mutations = {
   setAccessToken(state, payload) {
      state.accessToken = payload;
   },
   signOut(state) {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
   },
   setCurrentUser(state, payload) {
      state.user = payload;
      localStorage.setItem('user', JSON.stringify(state.user));
   },
   initialiseAuth(state) {
      if (state.user) {
         state.user = JSON.parse(state.user);
      }
   },
};

const actions = {
   signInUser: catchError(async ({ commit, rootState }, payload) => {
      const response = await axios.post(URL.SIGN_IN, payload);
      const data = response.data.data;
      const user = data.user;
      const accessToken = data.token;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      commit('setAccessToken', accessToken);
      commit('setCurrentUser', user);
      return user;
   }),
   signUpUser: catchError(async ({ commit, rootState }, payload) => { 
      const response = await axios.post(URL.SIGN_UP, payload);
      return response.data.data;
   }),
   verifyUser: catchError(async ({ commit, rootState }, payload) => { 
      const response = await axios.post(URL.VERIFY, payload);
      return response.data.data;
   }),
   forgotPassword: catchError(async ({ commit, rootState }, payload) => { 
      const response = await axios.post(URL.FORGOT_PASSWORD, payload);
      return response.data.data;
   }),
   resetPassword: catchError(async ({ commit, rootState }, payload) => { 
      const response = await axios.post(URL.RESET_PASSWORD, payload);
      return response.data.data.message;
   }),
};

const getters = {
   isUserSignedIn(state) {
      return state.accessToken !== null;
   },
   getCurrentUser(state) {
      return state.user;
   },
};

export default {
   state,
   mutations,
   actions,
   getters,
};
