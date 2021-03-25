import axios from "axios"
import Keys from "@/util/keys"

// constants
const CONTEXT_PATH = "api"
const ACCEPTS = 'application/json'
const CONTENT_TYPE = 'application/json'

console.log(Keys)

const axiosInstance = axios.create({
    baseURL: `http://localhost/${CONTEXT_PATH}/`,
    responseType: 'json'
})

axiosInstance.defaults.headers.post['Content-Type'] = CONTENT_TYPE;
axiosInstance.defaults.headers.post['Accepts'] = ACCEPTS;

export default axiosInstance;

export const URL = {
    VERIFY: 'auth/verify',
    SIGN_IN: 'auth/signIn',
    SIGN_UP: 'auth/signUp',
    SIGN_IN_GOOGLE: 'auth/google/signIn',
    SIGN_IN_GITHUB: 'auth/github/signIn',
    SIGN_IN_FACEBOOK: 'auth/facebook/signIn',
    GOOGLE_AUTH_URL: 'auth/google/authURL',
    GITHUB_AUTH_URL: 'auth/github/authURL',
    FACEBOOK_AUTH_URL: 'auth/facebook/authURL',
    RESET_PASSWORD: 'auth/resetPassword',
    FORGOT_PASSWORD: 'auth/forgotPassword',
}
