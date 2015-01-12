/**
 * Created by ${USER} on ${DATE}.
 * @author ${USER}
 * @exports components.${COMPONENT_NAME}
 */
/**
 * @namespace components
 */
window.components = window.components || {};
(function(){
  // ----------------------- Component Definition
  /**
   * @class ${COMPONENT_NAME}Controller
   * @extends aw.components.utils.ComponentController
   * @param ${DS}scope
   * @constructor
   */
  function ${COMPONENT_NAME}Controller(${DS}scope) {
    /**
     * @type {${COMPONENT_NAME}Controller}
     */
    var ctrl = this;
    this.${DS}initialize(${DS}scope, null, function(){
      this.${DS}addedToParent.handle(function(parentComponent){

      });
    });
  }
  /**
   * @class components.${COMPONENT_NAME}
   * @extends aw.components.Component
   * @param {Object} ${DS}scope
   * @param {aw.components.utils.ComponentController} target
   * @constructor
   */
  function ${COMPONENT_NAME}(${DS}scope, target){
    this.${DS}initialize(${DS}scope, target);



  }
  aw.components.Component.extend(${COMPONENT_NAME});
  // ----------------------- Component Configuration
  /**
   * @type {Module}
   */
  var module;
  ${COMPONENT_NAME}.NAME = 'components.${COMPONENT_NAME}';
  Object.defineProperty(${COMPONENT_NAME}, "module", {
    get: function(){
      return module;
    }
  });
  ${COMPONENT_NAME}.register = function(){
    module = angular.module(${COMPONENT_NAME}.NAME, [
      // component dependencies
    ]);
    // name for component directive
    var name = ${COMPONENT_NAME}.NAME;
    name = name.charAt().toLowerCase()+name.substr(1);
    module.directive(name, function(){
      return {
        restrict: "AE",
        template: '<div ng-controller="components.${COMPONENT_NAME} as '+name+'"></div>'
      }
    });
    module.controller(${COMPONENT_NAME}.NAME, [
      '${DS}scope',
      aw.components.Component.registerController(${COMPONENT_NAME}Controller, ${COMPONENT_NAME})
    ]);
  };
  // ----------------------- Component Registration and Initialization
  ${COMPONENT_NAME}.register();
})();