import moment from 'moment';

import { Paginator } from '../../../utils';
import template from './tasks.html';
import registerCancelQueryButton from './cancel-query-button';

moment.locale('zh-cn');

function TasksCtrl($scope, $location, $http, $timeout, Events) {
  Events.record('view', 'page', 'admin/tasks');
  $scope.autoUpdate = true;

  $scope.selectedTab = 'in_progress';

  $scope.tasks = {
    waiting: [],
    in_progress: [],
    done: [],
  };

  this.tasksPaginator = new Paginator([], { itemsPerPage: 50 });

  $scope.setTab = (tab) => {
    $scope.selectedTab = tab;
    this.tasksPaginator.updateRows($scope.tasks[tab]);
  };

  $scope.setTab($location.hash() || 'in_progress');

  const refresh = () => {
    if ($scope.autoUpdate) {
      $scope.refresh_time = moment().add(1, 'minutes');
      $http.get('/api/admin/queries/tasks').success((data) => {
        $scope.tasks = data;
        this.tasksPaginator.updateRows($scope.tasks[$scope.selectedTab]);
      });
    }

    const timer = $timeout(refresh, 5 * 1000);

    $scope.$on('$destroy', () => {
      if (timer) {
        $timeout.cancel(timer);
      }
    });
  };

  refresh();
}

export default function (ngModule) {
  ngModule.component('tasksPage', {
    template,
    controller: TasksCtrl,
  });

  registerCancelQueryButton(ngModule);

  return {
    '/admin/queries/tasks': {
      template: '<tasks-page></tasks-page>',
      title: '运行查询',
    },
  };
}
