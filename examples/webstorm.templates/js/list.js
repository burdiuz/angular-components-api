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
    this.$initialize($scope);
    /**
     * @type {Object}
     */
    this.selected = null;
    this.select = function(item){
      ctrl.selected = item;
      this.facade.selected.$fire(item);
    }
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
    // custom component facade methods, events and properties
    Object.defineProperty(this, "list", {
      get: function(){
        return $scope.list;
      },
      set: function(value){
        $scope.list = value;
      }
    });
    this.selected = this.$createListener();
  }
  aw.components.Component.extend(List);
  components.List = List;
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
    module = angular.module(List.NAME, []);
    module.directive("list", function () {
      return {
        restrict: "AE",
        templateUrl: "templates/list.html"
      }
    });
    module.directive("listItem", function () {
      return {
        restrict: "E",
        templateUrl: "templates/listitem.html"
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