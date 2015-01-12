/**
 * Created by ${USER} on ${DATE}.
 * @author ${USER}
 * @exports components.${Component_name}
 */
/**
 * @namespace components
 */
window.components = window.components || {};
(function(){
  var components = window.components;
  // ----------------------- Component Definition
  /**
   * @class ${Component_name}Controller
   * @extends aw.components.utils.ComponentController
   * @param ${DS}scope
   * @constructor
   */
  function ${Component_name}Controller(${DS}scope) {
    /**
     * @type {${Component_name}Controller}
     */
    var ctrl = this;
    this.${DS}initialize(${DS}scope, null, function(){
      this.${DS}addedToParent.handle(function(parentComponent){
        // added to parent component


        // tell parent component is ready
        ctrl.facade.ready.${DS}fire();
      });
      this.${DS}childAdded.handleOfType(components.${Child_component}, function(childComponent){
        // child component of specific type was added


        // wait till child component is ready
        childComponent.ready.handle(childComponentReadyHandler);
      });
    });
    // custom controller actions



    function childComponentReadyHandler(data){
      // childComponent ready handler
    }
  }
  /**
   * @class components.${Component_name}
   * @extends aw.components.Component
   * @param {Object} ${DS}scope
   * @param {aw.components.utils.ComponentController} target
   * @constructor
   */
  function ${Component_name}(${DS}scope, target){
    this.${DS}initialize(${DS}scope, target);
    // event for ready state of the component
    this.ready = this.${DS}createListener();
    // custom component facade methods, events and properties

  }
  components.Component.extend(${Component_name});
  // ----------------------- Component Configuration
  /**
   * @type {angular.Module}
   */
  var module;
  ${Component_name}.NAME = 'components.${Component_name}';
  Object.defineProperty(${Component_name}, "module", {
    get: function(){
      return module;
    }
  });
  ${Component_name}.register = function(){
    module = angular.module(${Component_name}.NAME, [
      // component dependencies
      "components.${Child_component}"
    ]);
    module.directive(${Component_directive}, function(){
      return {
        restrict: "AE",
        templateUrl: "templates/${Component_directive}.html"
      }
    });
    module.controller(${Component_name}.NAME, [
      '${DS}scope',
      aw.components.Component.registerController(${Component_name}Controller, ${Component_name})
    ]);
  };
  // ----------------------- Component Registration and Initialization
  ${Component_name}.register();
})();