'use strict';

/**
 * Main module
 */
define(
    [
        'jquery',
        'angular',
        'angular-ui-router',
        'rpc.module',
        'schedule.module',
        'tasks.module',
        'servers.module',
        'services.module',
        'logs.module'
    ],
    function ($, angular) {
        
        /**
         * Modules list
         */
        
        var modules = [
            'rpc.module',
            'ui.router',
            'schedule.module',
            'tasks.module',
            'servers.module',
            'services.module',
            'logs.module'
        ];
        
        /**
         * Dump component
         */
        
        var DumpComponent = {
            bindings    : {
                var: '<?'
            },
            template    : '<div class="dump"><span class="string" ng-if="$ctrl.string">{{ $ctrl.string }}</span><table class="array"><tr ng-repeat="(key, value) in $ctrl.array"><td class="key">{{ key }}</td><td class="value">{{ value }}</td></tr></table></div>',
            controller  : function () {
                var self = this;
                self.var = self.var || 'undefined';
                
                if (angular.isString(self.var) || angular.isNumber(self.var)) {
                    self.string = self.var;
                } else if (angular.isArray(self.var) || angular.isObject(self.var)) {
                    self.array = self.var;
                } else {
                    self.var = 'undefined';
                }
            },
            controllerAs: '$ctrl'
        };
        
        /**
         * Main module
         */
        
        angular
            .module('main', modules)
            .controller('MainController', MainController)
            .config(config)
            .run(run)
            .component('dump', DumpComponent);
        
        /**
         * Loader functions
         */
        
        function showLoader() {
            $('body > .loader').css({display: 'flex'});
            $('body').css({overflow: 'hidden'});
        }
        
        function hiddenLoader() {
            $('body > .loader').css({display: 'none'});
            $('body').css({overflow: 'auto'});
        }
        
        /**
         * Run
         */
        run.$inject = ['$rootScope'];
        
        function run($rootScope) {
            
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                showLoader()
            });
            
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                hiddenLoader()
            });
            
        }
        
        /**
         * Config
         */
        config.$inject = ['$locationProvider', '$urlRouterProvider'];
        function config($locationProvider, $urlRouterProvider) {
            
            $locationProvider.html5Mode(true).hashPrefix('!');
            $urlRouterProvider.otherwise("/servers");
            
        }
        
        /**
         * Main controller
         */
        
        MainController.$inject = ['$rootScope', 'rpc'];
        
        function MainController($rootScope, rpc) {
            
            /**
             * Update all counts
             */
            $rootScope.updateCounts = function () {
                $rootScope.loadScheduleCount();
                $rootScope.loadTasksCount();
                $rootScope.loadServersCount();
                $rootScope.loadServicesCount();
            };
            
            /**
             * Load services count.
             */
            $rootScope.loadServicesCount = function () {
                rpc('services.count')
                    .then(function (result) {
                        $rootScope.servicesCount = result;
                    });
            };
            
            /**
             * Load servers count.
             */
            $rootScope.loadServersCount = function () {
                rpc('servers.count')
                    .then(function (result) {
                        $rootScope.serversCount = result;
                    });
            };
            
            /**
             * Load schedule count.
             */
            $rootScope.loadScheduleCount = function () {
                rpc('schedule.getCount')
                    .then(function (result) {
                        $rootScope.scheduleCount = result;
                    });
            };
            
            /**
             * Load tasks count in queue.
             */
            $rootScope.loadTasksCount = function () {
                rpc('queue.getCount')
                    .then(function (result) {
                        $rootScope.queueCount = result;
                    });
            };
            
            $rootScope.updateCounts();
            setInterval($rootScope.updateCounts, 30000);
        }
        
        // On ready run.
        
        require(['domReady!'], function (document) {
            
            hiddenLoader();
            $('.app').removeAttr('style');
            
            angular.bootstrap(document, ['main']);
        });
    }
);

