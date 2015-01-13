/**
 * Created by Oleg Galabura on 11.01.2015.
 * @author Oleg Galabura
 * @exports pages.Page
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
  function PageController($scope, $http) {
    console.log('PageController');
    /**
     * @type {PageController}
     */
    var ctrl = this;
    /**
     * @type {Object[]}
     */
    var data;
    /**
     * @type {components.List}
     */
    var listComponent;
    /**
     * @type {components.View}
     */
    var viewComponent;
    this.$initialize($scope, null, function () {
      this.$childAdded.handleOfType(components.List, function (childComponent) {
        // child component of specific type was added
        listComponent = childComponent;
        listComponent.list = data;
        listComponent.selected.handle(listSelectedHandler);
      });
      this.$childAdded.handleOfType(components.View, function (childComponent) {
        // child component of specific type was added
        viewComponent = childComponent;
        if(data){
          viewComponent.entity = data;
        }
      });
    });
    function listSelectedHandler(item){
      if(viewComponent) {
        viewComponent.entity = item;
      }
    }
    $http.get("data/list.json").then(function(response){
      data = response.data;
      if(listComponent){
        listComponent.list = data;
      }
    });
  }

  /**
   * @class pages.Page
   * @extends aw.components.Component
   * @param {Object} $scope
   * @param {aw.components.utils.ComponentController} target
   * @constructor
   */
  function Page($scope, target) {
    this.$initialize($scope, target);


  }

  aw.components.Component.extend(Page);
  // ----------------------- Component Configuration
  /**
   * @type {angular.Module}
   */
  var module;
  Page.NAME = 'pages.Page';
  Object.defineProperty(Page, "module", {
    get: function () {
      return module;
    }
  });
  Page.register = function () {
    module = angular.module(Page.NAME, [
      // component dependencies
      "components.List",
      "components.View"
    ]);
    // name for component directive -- name of the component class name starting from lowercase character
    module.directive("page", function () {
      return {
        restrict: "E",
        templateUrl: "templates/page.html"
      }
    });
    module.controller(Page.NAME, [
      "$scope",
      "$http",
      aw.components.Component.registerController(PageController, Page)
    ]);
  };
  // ----------------------- Component Registration and Initialization
  Page.register();
})();