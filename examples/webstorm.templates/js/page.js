/**
 * Created by Oleg Galabura on 11.01.2015.
 * @author Oleg Galabura
 * @exports components.Page
 */
/**
 * @namespace components
 */
window.pages = window.pages || {};
(function () {
  var pages = window.pages;
  // ----------------------- Component Definition
  /**
   * @class PageController
   * @extends aw.components.utils.ComponentController
   * @param $scope
   * @constructor
   */
  function PageController($scope) {
    /**
     * @type {PageController}
     */
    var ctrl = this;
    this.$initialize($scope, null, function () {
      this.$childAdded.handleOfType(components.List, function (childComponent) {
        // child component of specific type was added


      });
    });
  }

  /**
   * @class components.Page
   * @extends aw.components.Component
   * @param {Object} $scope
   * @param {aw.components.utils.ComponentController} target
   * @constructor
   */
  function Page($scope, target) {
    this.$initialize($scope, target);


  }

  pages.Component.extend(Page);
  // ----------------------- Component Configuration
  /**
   * @type {angular.Module}
   */
  var module;
  Page.NAME = 'components.Page';
  Object.defineProperty(Page, "module", {
    get: function () {
      return module;
    }
  });
  Page.register = function () {
    module = angular.module(Page.NAME, [
      // component dependencies
      "components.List"
    ]);
    // name for component directive -- name of the component class name starting from lowercase character
    module.directive(page, function () {
      return {
        restrict: "E",
        templateUrl: "templates/page.html"
      }
    });
    module.controller(Page.NAME, [
      '$scope',
      aw.components.Component.registerController(PageController, Page)
    ]);
  };
  // ----------------------- Component Registration and Initialization
  Page.register();
})();