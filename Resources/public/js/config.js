'use strict';

/**
 * Requirejs config
 */
requirejs.config(
    {
        
        baseUrl: 'bundles/vizzleweb',
        
        /**
         * Modules ids.
         */
        paths: {
            'domReady'         : 'lib/requirejs-domready/domReady',
            'angular'          : 'lib/angular/angular',
            'angular-ui-router': 'lib/angular-ui-router/angular-ui-router',
            'jquery'           : 'lib/jquery/jquery',
            'rpc.module'       : 'js/modules/rpc.module',
            'schedule.module'  : 'js/modules/schedule.module',
            'tasks.module'     : 'js/modules/tasks.module',
            'servers.module'   : 'js/modules/servers.module',
            'services.module'  : 'js/modules/services.module',
            'logs.module'      : 'js/modules/logs.module'
        },
        
        /**
         * for libs that either do not support AMD out of the box, or
         * require some fine tuning to dependency mgt'
         */
        shim: {
            'angular'          : {
                exports: 'angular'
            },
            'angular-ui-router': {
                deps: ['angular']
            }
        },
        
        deps: [
            'js/main'
        ]
        
    }
);