import Router from 'vue-router';
import Vue from 'vue';
Vue.use(Router)
const vueRouter = new Router({
  base: process.env.VUE_APP_PATH,
  mode: process.env.VUE_APP_MODE,
  routes: [{
    path: '/',
    component: () => import( /* webpackChunkName: "page" */ '@/page/index'),
    children: [{
      path: '',
      component: () => import( /* webpackChunkName: "page" */ '@/page/list'),
    },
    {
      path: 'category',
      component: () => import( /* webpackChunkName: "page" */ '@/page/list/category'),
    }, {
      path: 'db',
      component: () => import( /* webpackChunkName: "page" */ '@/page/list/db'),
    }, {
      path: 'map',
      component: () => import( /* webpackChunkName: "page" */ '@/page/list/map'),
    }, {
      path: 'document',
      component: () => import( /* webpackChunkName: "page" */ '@/page/list/document'),
    }, {
      path: 'components',
      component: () => import( /* webpackChunkName: "page" */ '@/page/list/components'),

    }, {
      path: 'record',
      component: () => import( /* webpackChunkName: "page" */ '@/page/list/record'),

    }]
  }, {
    path: '/create',
    name: 'create',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/create')
  }, {
    path: '/build/:id',
    name: 'build',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/build')
  }, {
    path: '/view/:id',
    name: 'view',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/view')
  }]
})
export default vueRouter;