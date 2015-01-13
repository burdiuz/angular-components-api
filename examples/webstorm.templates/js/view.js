/**
 * Created by Oleg Galabura on 11.01.2015.
 * @author Oleg Galabura
 * @exports components.View
 */
/**
 * @namespace components
 */
window.components = window.components || {};
(function () {
  var components = window.components;
  // ----------------------- Component Definition
  /**
   * @class ViewController
   * @extends aw.components.utils.ComponentController
   * @param $scope
   * @constructor
   */
  function ViewController($scope) {
    /**
     * @type {ViewController}
     */
    var ctrl = this;
    this.$initialize($scope, null, function () {
      // custom controller actions
      this.getEntity = function (){
        return $scope.entity;
      };
      this.setEntity = function (entity){
        $scope.entity = entity;
        this.$refresh();
      };
    });
  }

  /**
   * @class components.View
   * @extends aw.components.Component
   * @param {Object} $scope
   * @param {aw.components.utils.ComponentController} target
   * @constructor
   */
  function View($scope, target) {
    this.$initialize($scope, target);
    // custom component facade methods, events and properties
    Object.defineProperty(this, "entity", {
      get: function(){
        return target.getEntity();
      },
      set: function(value){
        target.setEntity(value);
      }
    });
  }

  aw.components.Component.extend(View);
  components.View = View;
  // ----------------------- Component Configuration
  /**
   * @type {angular.Module}
   */
  var module;
  View.NAME = 'components.View';
  Object.defineProperty(View, "module", {
    get: function () {
      return module;
    }
  });
  View.register = function () {
    module = angular.module(View.NAME, []);
    module.directive("view", function () {
      return {
        restrict: "AE",
        templateUrl: "templates/view.html"
      }
    });
    module.controller(View.NAME, [
      '$scope',
      aw.components.Component.registerController(ViewController, View)
    ]);
  };
  // ----------------------- Component Registration and Initialization
  View.register();
})();