'use strict';

define(
    [
        'angular',
        'angular-ui-router',
        'rpc.module'
    ],
    function (angular) {
        
        var module = angular
            .module(
                'logs.module',
                [
                    'ui.router',
                    'rpc.module'
                ]
            )
            .config(config);
        
        config.$inject = ['$stateProvider'];
        
        function config($stateProvider) {
            
            $stateProvider
                .state(
                    'logs',
                    {
                        url    : '/logs',
                        views  : {
                            'main@': {
                                controller  : LogsController,
                                controllerAs: '$ctrl',
                                templateUrl : '/tpl/logs.html'
                            }
                        },
                        resolve: {
                            logs: ['rpc', function (rpc) {
                                return rpc('logs.get');
                            }]
                        }
                    }
                );
            
        }
        
        LogsController.$inject = ['$scope', 'logs', 'rpc'];
        
        function LogsController($scope, logs, rpc) {
            var self  = this;
            self.logs = logs;
            
            $scope.$on('$destroy', function () {
                clearInterval(updateLogsID)
            });
            
            var updateLogsID = setInterval(updateServers, 5000);
            
            /**
             * Update logs list.
             */
            function updateServers() {
                rpc('logs.get')
                    .then(function (result) {
                        self.logs = result;
                    });
            }
            
        }
        
        return module;
    }
);