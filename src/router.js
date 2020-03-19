import Vue from 'vue';
import Router from 'vue-router';
import Startup from './views/startup.vue';
import Login from './views/login.vue';
import DoctorList from './views/doctorlist.vue';
import DoctorDetail from './views/doctordetail.vue';
import Perfectinfo from './views/perfectinfo.vue';
import Consult from './views/consult.vue';
import Thepatient from './views/thepatient.vue';
import Order from './views/order.vue';
import Drugorder from './views/drugorder.vue';
import Orderdetail from './views/orderdetail.vue';
import Chat from './views/chat.vue';
import RoomTalk from './views/roomTalk.vue';
import Prescription from './views/prescription.vue';
import Address from './views/address.vue';
import EditAddress from './views/editaddress.vue';
import Member from './views/member.vue';
import EditMember from './views/editmember.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    path:'/page',
    component: Startup
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/doctorlist',
    component: DoctorList
  }, 
  {
    path:'/doctordetail',
    component: DoctorDetail
  }, 
  {
    path:'/perfectinfo',
    component: Perfectinfo
  }, 
  {
    path:'/consult',
    component: Consult
  },
  {
    path:'/thepatient',
    component: Thepatient
  },
  {
    path:'/order',
    component: Order
  },
  {
    path:'/drugorder',
    component: Drugorder
  },
  {
    path:'/orderdetail',
    component: Orderdetail
  },
  {
    // 咨询问诊聊天室
    path: '/',
    name: 'chat',
    component: Chat,
    children: [
      {
        path: 'talk',
        name: 'talk',
        component: RoomTalk
      }
    ]
  }, 
  {
    path: '/prescription',
    name: 'prescription',
    component: Prescription
  }, 
  {
    path: '/address',
    name: 'addresslist',
    component: Address
  }, 
  {
    path: '/editaddress',
    name: 'editaddress',
    component: EditAddress
  }, 
  {
    path: '/member',
    name: 'member',
    component: Member
  }, 
  {
    path: '/editmember',
    name: 'editmember',
    component: EditMember
  }]
});
