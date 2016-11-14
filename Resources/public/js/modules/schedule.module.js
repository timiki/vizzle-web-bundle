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
                'schedule.module',
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
                    'schedule',
                    {
                        url    : '/schedule',
                        views  : {
                            'main@': {
                                controller  : ScheduleController,
                                controllerAs: '$ctrl',
                                templateUrl : '/tpl/schedule.html'
                            }
                        },
                        resolve: {
                            schedules: ['rpc', function (rpc) {
                                
                                return rpc('schedule.get');
                                
                            }]
                        }
                    }
                );
            
        }
        
        ScheduleController.$inject = ['schedules', 'rpc'];
        
        function ScheduleController(schedules) {
            
            var self               = this;
            self.schedules         = schedules;
            self.schedulesTotal    = schedules.length;
            self.schedulesEnabled  = 0;
            self.schedulesDisabled = 0;
            
            self.schedules.forEach(function (item) {
                
                if (item.enabled) {
                    ++self.schedulesEnabled;
                } else {
                    ++self.schedulesDisabled;
                }
                
            })
            
        }
        
        return module;
    }
);