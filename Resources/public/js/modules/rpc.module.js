'use strict';

define(
    [
        'angular'
    ],
    function (angular) {
        
        var module = angular
            .module(
                'rpc.module',
                []
            )
            .service('rpc', rpc);
        
        rpc.$inject = [
            '$q',
            '$http'
        ];
        
        function rpc($q, $http) {
            
            var id  = 0;
            var url = '/rpc';
            
            return call;
            
            /**
             * Base RPC function
             */
            function call(method, params, isResponse) {
                
                return $q(
                    function (resolve, reject) {
                        
                        if (typeof method === 'string') {
                            var request = {
                                jsonrpc: '2.0',
                                method : method
                            };
                            
                            if (isResponse !== false && params !== false) {
                                request['id'] = ++id;
                            }
                            
                            if (angular.isObject(params) || angular.isArray(params)) {
                                request['params'] = params;
                            } else if (angular.isString(params) || angular.isNumber(params)) {
                                request['params'] = [params];
                            }
                            
                            $http({
                                method: "POST",
                                url   : url,
                                data  : request
                            }).then(
                                function (response) {
                                    if (response.data.error) {
                                        reject(response.data.error);
                                    } else if (response.data.hasOwnProperty('result')) {
                                        resolve(response.data.result);
                                    } else {
                                        reject();
                                    }
                                },
                                function () {
                                    reject();  // Reject http request
                                }
                            );
                            
                        } else {
                            reject(); // Not set method name
                        }
                        
                    }
                );
                
            }
            
        }
        
        return module;
    }
);