/**
 * Created by ${USER} on ${DATE}.
 * @author ${USER}
 * @exports components.${Component_name}
 */
/**
 * @namespace components
 */
window.pages = window.pages || {};
(function(){
  var pages = window.pages;
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
      this.${DS}childAdded.handleOfType(components.${Child_component}, function(childComponent){
        // child component of specific type was added



      });
    });
    // custom controller actions
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



  }
  aw.components.Component.extend(${Component_name});
  pages.${Component_name} = ${Component_name};
  // ----------------------- Component Configuration
  /**
   * @type {angular.Module}
   */
  var module;
  ${Component_name}.NAME = 'pages.${Component_name}';
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
    // name for component directive -- name of the component class name starting from lowercase character
    module.directive("${Page_directive}", function(){
      return{
        restrict: "E",
        templateUrl: "templates/${Page_directive}.html"
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