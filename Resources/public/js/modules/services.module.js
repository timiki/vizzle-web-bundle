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
                'services.module',
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
                    'services',
                    {
                        url    : '/services',
                        views  : {
                            'main@': {
                                controller  : ServicesController,
                                controllerAs: '$ctrl',
                                templateUrl : '/tpl/services.html'
                            }
                        },
                        resolve: {
                            services: ['rpc', function (rpc) {
                                return rpc('services.get');
                            }]
                        }
                    }
                );
            
        }
        
        ServicesController.$inject = ['$rootScope', '$scope', 'services', 'rpc'];
        
        function ServicesController($rootScope, $scope, services, rpc) {
            var self          = this;
            self.serversCount = 0;
            parseServices(services);
            
            $scope.$on('$destroy', function () {
                clearInterval(updateServicesID)
            });
            
            var updateServicesID = setInterval(updateServices, 5000);
            
            /**
             * Parse services list
             */
            function parseServices(services) {
                
                var servers       = {};
                self.serversCount = 0;
                
                services.forEach(function (service) {
                    if (!servers[service.server]) {
                        servers[service.server] = [];
                        self.serversCount++;
                    }
                    servers[service.server].push(service);
                });
                
                self.servers = servers;
            }
            
            /**
             * Update servers list.
             */
            function updateServices() {
                rpc('services.get').then(parseServices);
                $rootScope.loadServicesCount();
            }
            
        }
        
        return module;
    }
);