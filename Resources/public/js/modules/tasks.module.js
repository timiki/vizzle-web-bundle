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
                'tasks.module',
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
                    'tasksQueue',
                    {
                        url    : '/tasks/queue',
                        views  : {
                            'main@': {
                                controller  : TasksQueueController,
                                controllerAs: '$ctrl',
                                templateUrl : '/tpl/tasks/queue.html'
                            }
                        },
                        resolve: {
                            tasks: ['rpc', function (rpc) {
                                return rpc('queue.getNotComplete');
                            }],
                            stat : ['rpc', function (rpc) {
                                return rpc('queue.stat');
                            }]
                        }
                    }
                );
            
        }
        
        TasksQueueController.$inject = ['$rootScope', '$scope', 'tasks', 'rpc', 'stat'];
        
        function TasksQueueController($rootScope, $scope, tasks, rpc, stat) {
            
            var self = this;
            
            self.tasks = tasks;
            self.stat  = [];
            
            var chartTotal;
            var chartRun;
            var chartWait;
            var chartMemory;
            
            $scope.$on('$destroy', function () {
                clearInterval(updateStatID);
                clearInterval(updateTasksID);
            });
            
            var updateStatID  = setInterval(updateStat, 5000);
            var updateTasksID = setInterval(updateTasks, 5000);
            
            // Chart task
            
            chartTotal = AmCharts
                .makeChart(
                    'chart-total',
                    {
                        'type'          : 'serial',
                        'theme'         : 'light',
                        'dataDateFormat': 'YYYY-MM-DD HH:NN:SS',
                        'categoryField' : 'date',
                        'categoryAxis'  : {
                            'parseDates': true,
                            'minPeriod' : 'ss'
                        },
                        'valueAxes'     : [
                            {
                                'id'          : 'val',
                                'title'       : 'Tasks',
                                'integersOnly': true
                            }
                        ],
                        'graphs'        : [
                            {
                                'fillAlphas'   : 0.8,
                                'id'           : 'g1',
                                'title'        : 'Count total tasks',
                                'valueField'   : 'total',
                                'lineThickness': 2
                            }
                        ],
                        'dataProvider'  : self.stat
                    }
                );
            
            chartRun = AmCharts
                .makeChart(
                    'chart-executing',
                    {
                        'type'          : 'serial',
                        'theme'         : 'light',
                        'dataDateFormat': 'YYYY-MM-DD HH:NN:SS',
                        'categoryField' : 'date',
                        'categoryAxis'  : {
                            'parseDates': true,
                            'minPeriod' : 'ss'
                        },
                        'valueAxes'     : [
                            {
                                'id'   : 'val',
                                'title': 'Time (sec)'
                            }
                        ],
                        'graphs'        : [
                            {
                                'fillAlphas'   : 0.8,
                                'id'           : 'g1',
                                'title'        : 'Average executing time',
                                'valueField'   : 'aExecutingTime',
                                'lineThickness': 2
                            }
                        ],
                        'dataProvider'  : self.stat
                    }
                );
            
            chartWait = AmCharts
                .makeChart(
                    'chart-wait',
                    {
                        'type'          : 'serial',
                        'theme'         : 'light',
                        'dataDateFormat': 'YYYY-MM-DD HH:NN:SS',
                        'categoryField' : 'date',
                        'categoryAxis'  : {
                            'parseDates': true,
                            'minPeriod' : 'ss'
                        },
                        'valueAxes'     : [
                            {
                                'id'          : 'val',
                                'title'       : 'Time (sec)',
                                'integersOnly': true
                            }
                        ],
                        'graphs'        : [
                            {
                                'fillAlphas'   : 0.8,
                                'id'           : 'g1',
                                'title'        : 'Average wait time',
                                'valueField'   : 'aWaitTime',
                                'lineThickness': 2
                            }
                        ],
                        'dataProvider'  : self.stat
                    }
                );
            
            chartMemory = AmCharts
                .makeChart(
                    'chart-memory',
                    {
                        'type'          : 'serial',
                        'theme'         : 'light',
                        'dataDateFormat': 'YYYY-MM-DD HH:NN:SS',
                        'categoryField' : 'date',
                        'categoryAxis'  : {
                            'parseDates': true,
                            'minPeriod' : 'ss'
                        },
                        'valueAxes'     : [
                            {
                                'id'          : 'val',
                                'title'       : 'Memory (Mb)',
                                'integersOnly': true
                            }
                        ],
                        'graphs'        : [
                            {
                                'fillAlphas'   : 0.8,
                                'id'           : 'g1',
                                'title'        : 'Average memory use',
                                'valueField'   : 'aMemoryTotal',
                                'lineThickness': 2
                            }
                        ],
                        'dataProvider'  : self.stat
                    }
                );
            
            
            /**
             * Process stat data
             * @param data
             */
            function processStatData(data) {
                var stat = [];
                
                data.forEach(function (item) {
                    item['aMemory']      = (item['aMemory'] / 1048576).toFixed(2);
                    item['aMemoryTotal'] = (item['aMemoryTotal'] / 1048576).toFixed(2);
                    stat.push(item);
                });
                
                self.stat                = stat;
                chartTotal.dataProvider  = self.stat;
                chartRun.dataProvider    = self.stat;
                chartWait.dataProvider   = self.stat;
                chartMemory.dataProvider = self.stat;
                
                chartTotal.validateData();
                chartRun.validateData();
                chartWait.validateData();
                chartMemory.validateData();
                
                self.aTaskMemory  = self.stat.length > 0 ? self.stat[self.stat.length - 1].aMemory : null;
                self.aTasksMemory = self.stat.length > 0 ? (self.stat[self.stat.length - 1].aMemory * self.stat[self.stat.length - 1].run).toFixed(2) : null;
                self.taskPerSec   = self.stat.length > 0 ? (self.stat[self.stat.length - 1].aWaitTime / self.stat[self.stat.length - 1].aExecutingTime ).toFixed(1) : null;
            }
            
            /**
             * Update stat
             */
            function updateStat() {
                rpc('queue.stat').then(processStatData);
            }
            
            /**
             * Update tasks list
             */
            function updateTasks() {
                rpc('queue.getNotComplete').then(function (result) {
                    self.tasks = result;
                });
                $rootScope.loadTasksCount()
            }
            
            processStatData(stat);
        }
        
        return module;
    }
);