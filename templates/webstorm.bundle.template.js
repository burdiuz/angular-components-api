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
    this.${DS}initialize(${DS}scope);
    // custom controller code




    });
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
    // custom component facade methods, events and properties


  }
  aw.components.Component.extend(${Component_name});
  components.${Component_name} = ${Component_name};
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
    ]);
    module.controller(${Component_name}.NAME, [
      '${DS}scope',
      aw.components.Component.registerController(${Component_name}Controller, ${Component_name})
    ]);
  };
  // ----------------------- Component Registration and Initialization
  ${Component_name}.register();
})();