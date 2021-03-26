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

const signIn = async (url, payload, commit) => {
   const response = await axios.post(url, payload);
   const { token: accessToken, user } = response.data.data;
   localStorage.setItem('accessToken', accessToken);
   localStorage.setItem('user', JSON.stringify(user));
   commit('setAccessToken', accessToken);
   commit('setCurrentUser', user);
   return user;
}

const actions = {
   signInUser: catchError(async ({ commit, rootState }, payload) => {
      return await signIn(URL.SIGN_IN, payload, commit)
   }),
   signInGoogle: catchError(async ({ commit, rootState }, payload) => { 
      return await signIn(URL.SIGN_IN_GOOGLE, payload, commit)
   }),
   signInGithub: catchError(async ({ commit, rootState }, payload) => { 
      return await signIn(URL.SIGN_IN_GITHUB, payload, commit)
   }),
   signInFacebook: catchError(async ({ commit, rootState }, payload) => { 
      return await signIn(URL.SIGN_IN_FACEBOOK, payload, commit)
   }),
   signUpUser: catchError(async ({ commit, rootState }, payload) => { 
      const response = await axios.post(URL.SIGN_UP, payload);
      return response.data.data;
   }),
   retrieveCurrentUser: catchError(async ({ commit, rootState }) => { 
      const response = await axios.get(URL.CURRENT_USER, {
         headers: { 'Authorization': `Bearer ${state.accessToken}` }
      })
      return response.data.data.user
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
   getGoogleAuthURL: catchError(async ({ commit, rootState }, payload) => { 
      const response = await axios.get(URL.GOOGLE_AUTH_URL);
      return response.data.data.googleURL
   }),
   getGithubAuthURL: catchError(async ({ commit, rootState }, payload) => { 
      const response = await axios.get(URL.GITHUB_AUTH_URL);
      return response.data.data.githubURL
   }),
   getFacebookAuthURL: catchError(async ({ commit, rootState }, payload) => { 
      const response = await axios.get(URL.FACEBOOK_AUTH_URL);
      return response.data.data.facebookURL
   })
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
