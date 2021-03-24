import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index.js';
Vue.use(VueRouter);

// auth
import Home from '@/components/home/index.vue';
import Auth from '@/components/auth/Auth.vue';
import AuthSignInForm from '@/components/auth/AuthSignInForm.vue';
import AuthSignUpForm from '@/components/auth/AuthSignUpForm.vue';
import AuthVerification from '@/components/auth/AuthVerification.vue';
import AuthResetPassword from '@/components/auth/AuthResetPassword.vue';
import AuthForgotPasswordForm from '@/components/auth/AuthForgotPasswordForm.vue';

const routes = [
   {
      path: '/auth',
      component: Auth,
      children: [
         {
            path: 'sign-in',
            name: 'auth.signIn',
            component: AuthSignInForm,
         },
         { 
            path: 'sign-up',
            name: 'auth.signUp',
            component: AuthSignUpForm,
         },
         { 
            path: 'verification',
            name: 'auth.verification',
            component: AuthVerification,
         },
         {
            path: 'forgot-password',
            name: 'auth.forgotPassword',
            component: AuthForgotPasswordForm,
         },
         {
            path: 'reset-password',
            name: 'auth.resetPassword',
            component: AuthResetPassword,
         },
      ],
      meta: {
         requiresVisitor: true,
      },
   },
   {
      path: '/',
      component: Home,
      name: 'home',
      meta: {
         requiresAuth: true,
      },
   },
];

const router = new VueRouter({ routes, mode: 'history' });

router.beforeEach((to, from, next) => {
   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
   const requiresVisitor = to.matched.some(record => record.meta.requiresVisitor);

   if (requiresAuth && !store.getters.isUserSignedIn) {
      next({ name: 'auth.signIn' });
   } else if (requiresVisitor && store.getters.isUserSignedIn) {
      next({ name: 'home' });
   } else {
      next();
   }
});

export default router;
