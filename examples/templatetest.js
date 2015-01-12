/**
 * Created by Oleg Galabura on 11.01.2015.
 * @exports components.TemplateTest
 */
/**
 * @namespace components
 */
window.components = window.components || {};
(function () {
  // ----------------------- Component Definition
  /**
   * @class TemplateTestController
   * @extends aw.components.utils.ComponentController
   * @param $scope
   * @constructor
   */
  function TemplateTestController($scope) {
    /**
     * @type {TemplateTestController}
     */
    var ctrl = this;
    this.$initialize($scope, null, function () {
      this.$addedToParent.handle(function (parentComponent) {

      });
    });
  }

  /**
   * @class components.TemplateTest
   * @extends aw.components.Component
   * @param {Object} $scope
   * @param {aw.components.utils.ComponentController} target
   * @constructor
   */
  function TemplateTest($scope, target) {
    this.$initialize($scope, target);


  }

  aw.components.Component.extend(TemplateTest);
  // ----------------------- Component Configuration
  /**
   * @type {Module}
   */
  var module;
  TemplateTest.NAME = 'components.TemplateTest';
  Object.defineProperty(TemplateTest, "module", {
    get: function () {
      return module;
    }
  });
  TemplateTest.register = function () {
    module = angular.module(TemplateTest.NAME, [
      // component dependencies
    ]);
    // name for component directive
    var name = TemplateTest.NAME;
    name = name.charAt().toLowerCase() + name.substr(1);
    module.directive(name, function () {
      return {
        restrict: "AE",
        template: '<div ng-controller="components.TemplateTest as ' + name + '"></div>'
      }
    });
    module.controller(TemplateTest.NAME, [
      '$scope',
      aw.components.Component.registerController(TemplateTestController, TemplateTest)
    ]);
  };
  // ----------------------- Component Registration and Initialization
  TemplateTest.register();
})();