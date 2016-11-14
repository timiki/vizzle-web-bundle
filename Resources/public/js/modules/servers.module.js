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
                'servers.module',
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
                    'servers',
                    {
                        url    : '/servers',
                        views  : {
                            'main@': {
                                controller  : ServersController,
                                controllerAs: '$ctrl',
                                templateUrl : '/tpl/servers.html'
                            }
                        },
                        resolve: {
                            servers: ['rpc', function (rpc) {
                                return rpc('servers.get');
                            }]
                        }
                    }
                );
            
        }
        
        ServersController.$inject = ['$rootScope', '$scope', 'servers', 'rpc'];
        
        function ServersController($rootScope, $scope, servers, rpc) {
            var self     = this;
            self.servers = servers;
            
            $scope.$on('$destroy', function () {
                clearInterval(updateServersID)
            });
            
            var updateServersID = setInterval(updateServers, 5000);
            
            /**
             * Update servers list.
             */
            function updateServers() {
                rpc('servers.get')
                    .then(function (result) {
                        self.servers = result;
                    });
                $rootScope.loadServersCount();
            }
            
        }
        
        return module;
    }
);