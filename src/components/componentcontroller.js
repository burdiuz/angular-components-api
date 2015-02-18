/**
 * Created by Oleg Galaburda on 11.01.2015.
 */
//TODO Add support for states should be $getState(), $setState() and facade.state, facade.stateChanged
//TODO Component always must have states CREATED, INITIALIZED and DESTROY
module.config([
  'aw',
  function (aw) {
    "use strict";
    /**
     * @namespace aw.components
     */
    aw.components = aw.components || {};
    /**
     * @namespace aw.components.utils
     */
    aw.components.utils = aw.components.utils || {};
    /**
     * Base class for all components controllers
     * @class
     * @name aw.components.utils.ComponentController
     * @constructor
     */
    function ComponentController() {
      var instance = this;
      /**
       * @function
       * @name aw.components.utils.ComponentController#$initialize
       * @param {Object} $scope
       * @param {aw.components.Component} facade
       * @param {Function} preinitHandler
       * @instance
       */
      this.$initialize = function ComponentController_$initialize($scope, facade, preinitHandler) {
        if (this.$$initialized) {
          throw new Error('Component instance initialized already.');
        }
        /**
         * @type {aw.utils.ValidationHandler}
         * @private
         */
        var refreshValidation = aw.utils.ValidationHandler.create(function () {
          //console.log(' - call $digest');
          if (!$scope.$$phase) {
            //console.log(' -- start $digest');
            $scope.$digest();
          }
        });
        /**
         * Register watcher to prevent double $digest() calls if component will use $refresh() method
         * @type {Function}
         */
        var digestListenerRemove = $scope.$watch(function () {
          //console.log(' --- exec $digest');
          refreshValidation.prevent();
        });
        /*FIXME only if currentTarget === target
         $scope.$on('$destroy', function(event){
         _destroy.call(instance);
         digestListenerRemove();
         refreshValidation = null;
         componentInterface = null;
         instance = null;
         facadde = null;
         });
         var _destroy;
         this.$destroy = function(handler){
         _destroy = handler;
         };
         */
        /**
         * @function
         * @name aw.components.utils.ComponentController#$refresh
         * Simply forces $scope.$apply()
         * Shortcut to if(!$scope.$$phase){ $scope.$apply() };
         * @instance
         */
        this.$refresh = function () {
          //console.log('$refresh');
          refreshValidation.call();
        };
        /**
         * @function
         * @name aw.components.utils.ComponentController#$refreshImmediately
         * Simply forces $scope.$apply()
         * Shortcut to if(!$scope.$$phase){ $scope.$apply() };
         * @instance
         */
        this.$refreshImmediately = function () {
          refreshValidation.callImmediately();
        };
        /**
         * @type {aw.components.utils.ComponentInterface}
         * @private
         */
        var componentInterface = new aw.components.utils.ComponentInterface();
        /**
         * @function
         * @returns {aw.events.EventListener}
         */
        this.$createListener = componentInterface.createListener;
        /**
         * @type {aw.events.EventListener}
         */
        this.$childAdded = componentInterface.childAdded;
        /**
         * @type {aw.events.EventListener}
         */
        this.$childRemoved = componentInterface.childRemoved;
        /**
         * @type {aw.events.EventListener}
         */
        this.$addedToParent = componentInterface.addedToParent;
        /**
         * @type {aw.events.EventListener}
         */
        this.$removedFromParent = componentInterface.removedFromParent;
        /**
         * @type {aw.events.EventListener}
         */
        this.$stateChanged = componentInterface.stateChanged;
        /**
         * @property
         * @name  aw.components.utils.ComponentController#facade
         * @type {Object}
         * @readOnly
         * @instance
         */
        Object.defineProperty(this, 'facade', {value: facade});
        /**
         * @property
         * @name aw.components.utils.ComponentController#$children
         * @type {aw.components.utils.Component[]}
         * @instance
         */
        Object.defineProperty(this, '$children', {get: componentInterface.getChildren()});
        /**
         * Parent component
         * @property
         * @name  aw.components.utils.ComponentController#$parent
         * @type {aw.components.utils.ComponentController}
         * @instance
         */
        Object.defineProperty(this, '$parent', {get: componentInterface.getParent()});
        /**
         *
         * @type {Function}
         */
        this.$getState = componentInterface.getState;
        this.$setState = componentInterface.setState;
        /*
         Call preinitHandler if setup. Called after initialization but before being added to parent component.
         */
        if (typeof(preinitHandler) == "function") {
          preinitHandler.call(this);
        }
        if ($scope) {
          $scope.$$component = facade;
          $scope.$$interface = componentInterface;
        }
        /**
         * @property
         * @name aw.components.utils.ComponentController#$initialized
         * @type {boolean}
         * @instance
         * @private
         */
        Object.defineProperty(this, '$initialized', {value: true});
        /*
         Register component and find its parent. Starts event sequence $childAdded/$addedToParent if parent found.
         */
        aw.components.utils.ComponentScopeRegistry.add($scope, facade, componentInterface);
        /*
         Tell that this component changed state to initialized
         */
        componentInterface.setState(aw.data.ComponentStates.INITIALIZED);
      };
    }

    aw.components.utils.ComponentController = ComponentController;
    /**
     * @function
     * @name aw.components.utils.ComponentController.isComponentController
     * @param {Object} instance
     * @return {boolean}
     * @static
     */
    ComponentController.isComponentController = function ComponentController_isComponentController(instance) {
      return instance instanceof ComponentController;
    };
    /**
     * @function
     * @name aw.components.utils.ComponentController.isComponentControllerClass
     * @param {Function} constructor
     * @return {boolean}
     * @static
     */
    ComponentController.isComponentControllerClass = function ComponentController_isComponentControllerClass(constructor) {
      return constructor instanceof Function && (constructor === ComponentController || ComponentController.prototype.isPrototypeOf(constructor.prototype));
    };
  }
]);
