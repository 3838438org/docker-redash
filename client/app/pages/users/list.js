import { Paginator } from '../../utils';
import template from './list.html';

function UsersCtrl(currentUser, Events, User) {
  Events.record('view', 'page', 'users');

  this.currentUser = currentUser;
  this.users = new Paginator([], { itemsPerPage: 20 });
  User.query((users) => {
    this.users.updateRows(users);
  });
}

export default function (ngModule) {
  ngModule.component('usersListPage', {
    controller: UsersCtrl,
    template,
  });

  return {
    '/users': {
      template: '<users-list-page></users-list-page>',
      title: '用户',
    },
  };
}
