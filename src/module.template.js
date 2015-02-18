/**
 * Created by Oleg Galaburda on 17.02.2015.
 */
(function () {
  "use strict";
  var module = angular.module('aw.components');
  module.constant('aw', {});
  /*--data-*/
  /*--utils-*/
  /*--events-*/
  /*--components-utils-*/
  /*--components-*/
  module.service('registerComponent', [
      'aw',
      function RegisterComponentService(aw) {
        var self = this;
        /**
         * @type {aw.components.utils.ComponentScopeRegistry}
         */
        var registry = aw.components.utils.ComponentScopeRegistry;
        /**
         * @type {Function}
         * @see aw.components.utils.ComponentScopeRegistry.registerController
         */
        self.controller = registry.registerController;
        /**
         * @type {Function}
         * @see aw.components.utils.ComponentScopeRegistry.registerDirective
         */
        self.directive = registry.registerDirective;
      }
    ]
  );
})();