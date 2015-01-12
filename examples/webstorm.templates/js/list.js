/**
 * Created by Oleg Galabura on 11.01.2015.
 * @author Oleg Galabura
 * @exports components.List
 */
/**
 * @namespace components
 */
window.components = window.components || {};
(function () {
  var components = window.components;
  // ----------------------- Component Definition
  /**
   * @class ListController
   * @extends aw.components.utils.ComponentController
   * @param $scope
   * @constructor
   */
  function ListController($scope) {
    /**
     * @type {ListController}
     */
    var ctrl = this;
    this.$initialize($scope, null, function () {
      this.$addedToParent.handle(function (parentComponent) {
        // added to parent component


        // tell parent component is ready
        ctrl.facade.ready.$fire();
      });
      // custom controller actions



    });
  }

  /**
   * @class components.List
   * @extends aw.components.Component
   * @param {Object} $scope
   * @param {aw.components.utils.ComponentController} target
   * @constructor
   */
  function List($scope, target) {
    this.$initialize($scope, target);
    // event for ready state of the component
    this.ready = this.$createListener();
    // custom component facade methods, events and properties

  }

  components.Component.extend(List);
  // ----------------------- Component Configuration
  /**
   * @type {angular.Module}
   */
  var module;
  List.NAME = 'components.List';
  Object.defineProperty(List, "module", {
    get: function () {
      return module;
    }
  });
  List.register = function () {
    module = angular.module(List.NAME, [
      // component dependencies
      "components."
    ]);
    module.directive(list, function () {
      return {
        restrict: "AE",
        templateUrl: "templates/list.html"
      }
    });
    module.controller(List.NAME, [
      '$scope',
      aw.components.Component.registerController(ListController, List)
    ]);
  };
  // ----------------------- Component Registration and Initialization
  List.register();
})();