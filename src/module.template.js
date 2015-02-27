/**
 * Created by Oleg Galaburda on 17.02.2015.
 */
(function () {
  "use strict";
  var module = angular.module('aw.components', []);
  var aw = {};
  module.constant('aw', aw);
  /*--data-*/
  /*--utils-*/
  /*--events-*/
  /*--components-utils-*/
  /*--components-*/
  function Components(){
    /**
     * @name componentsProvider#controller
     * @type {Function}
     * @see aw.components.utils.ComponentScopeRegistry.registerController
     */
    this.registerController = aw.components.Component.registerController;
    /**
     * @name componentsProvider#directive
     * @type {Function}
     * @see aw.components.utils.ComponentScopeRegistry.registerDirective
     */
    this.registerDirective = aw.components.Component.registerDirective;
  }
  var componentsInstance = new Components();
  module.provider('components', function ComponentsProvider() {
    Components.call(this);
    this.$get = [
      function ComponentsFactory() {
        return componentsInstance;
      }
    ];
  });
  /**
   * @name angular.components
   */
  Object.defineProperty(angular, "components", {value: componentsInstance, enumerable: true, writable: false});
  /**
   * @function
   * @name angular.components.registerController
   * @param controllerDefinition
   * @param componentDefinition
   */
  /**
   * @function
   * @name angular.components.registerDirective
   * @param directiveOptions
   * @param componentDefinition
   * @param controllerDefinition
   */
})();