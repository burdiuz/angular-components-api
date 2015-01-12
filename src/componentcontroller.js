/**
 * Created by Oleg Galaburda on 11.01.2015.
 */
/**
 * @namespace aw
 */
window.aw = window.aw || {};
/**
 * @namespace aw.components
 */
window.aw.components = window.aw.components || {};
/**
 * @namespace aw.components.utils
 */
window.aw.components.utils = window.aw.components.utils || {};
(function() {
  /**
   * @namespace aw.components.utils
   */
  var utils = window.aw.components.utils;
  /**
   * Base class for all components controllers, must be loaded first with angular ignoring AMD
   * @class aw.components.utils.ComponentController
   * @constructor
   */
  function ComponentController() {
    /**
     * @function $initialize
     * @memberOf aw.components.utils.ComponentController
     * @param {Object} $scope
     * @param {aw.components.Component} facade
     * @param {Function} preinitHandler
     * @instance
     */
    this.$initialize = function ComponentController_$initialize($scope, facade, preinitHandler) {
      if (this.$$initialized) {
        throw new Error('Component instance initialized already.');
      }
      if ($scope) {
        $scope.$$controller = this;
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
      /*
       * Register watcher to prevent double $digest() calls if component will use $refresh() method
       */
      $scope.$watch(function () {
        //console.log(' --- exec $digest');
        refreshValidation.prevent();
      });
      /**
       * @property facade
       * @memberOf aw.components.utils.ComponentController
       * @type {Object}
       * @readOnly
       * @instance
       */
      Object.defineProperty(this, 'facade', {value: facade || this});
      /**
       * @function $refresh
       * @memberOf aw.components.utils.ComponentController
       * Simply forces $scope.$apply()
       * Shortcut to if(!$scope.$$phase){ $scope.$apply() };
       * @instance
       */
      this.$refresh = function () {
        //console.log('$refresh');
        refreshValidation.call();
      };
      /**
       * @function $refreshImmediately
       * @memberOf aw.components.utils.ComponentController
       * Simply forces $scope.$apply()
       * Shortcut to if(!$scope.$$phase){ $scope.$apply() };
       * @instance
       */
      this.$refreshImmediately = function () {
        refreshValidation.callImmediately();
      };
      /**
       * @property $children
       * @memberOf aw.components.utils.ComponentController
       * @type {aw.components.utils.Component[]}
       * @instance
       */
      Object.defineProperty(this, '$children', {
        get: function ComponentController_$children() {
          return children.slice();
        }
      });
      /**
       * Child components
       * @private
       * @type {aw.components.utils.ComponentController[]}
       */
      var children = [];
      /**
       * Add child component to this component children list.
       * This function is private to other components and must not
       * be called. It will be invoked automatically when child
       * component registers itself as component instance.
       * @function $$removeChild
       * @memberOf aw.components.utils.ComponentController
       * @param {aw.components.utils.Component} component
       * @instance
       * @private
       */
      this.$$addChild = function ComponentController_$$addChild(component) {
        if (component) {
          children.push(component);
          this.$childAdded.$fire(component.facade || component);
        }
      };
      /**
       * Remove child component from this component children list.
       * This function is private to other components and must not
       * be called. It will be invoked automatically when child
       * component being removed from component instance registry.
       * @function $$removeChild
       * @memberOf aw.components.utils.ComponentController
       * @param {aw.components.utils.Component} component
       * @instance
       * @private
       */
      this.$$removeChild = function ComponentController_$$removeChild(component) {
        var index = children.indexOf();
        if (component && index >= 0) {
          children.splice(index, 1);
          this.$childRemoved.$fire(component.facade || component);
        }
      };
      /**
       * Parent component
       * @property $parent
       * @memberOf aw.components.utils.ComponentController
       * @type {aw.components.utils.ComponentController}
       * @instance
       */
      Object.defineProperty(this, '$parent', {
        get: function ComponentController_$parent() {
          return parent;
        }
      });
      var parent;
      /**
       * Set component to be a parent to this one.
       * @property $$setParent
       * @memberOf aw.components.utils.ComponentController
       * @param {aw.components.utils.ComponentController} component
       * @instance
       * @private
       */
      this.$$setParent = function ComponentController_$$setParent(component) {
        if (parent) {
          this.$removedFromParent.$fire(parent.facade || parent);
        }
        parent = component;
        if (parent) {
          this.$addedToParent.$fire(parent.facade || parent);
        }
      };
      /**
       * Create promise event listener that will be called every time when event fired.
       * @property $createListener
       * @memberOf aw.components.utils.ComponentController
       * @returns {aw.events.EventListener}
       * @instance
       */
      this.$createListener = function ComponentController_$createListener() {
        return aw.events.EventListener.create($scope, refreshValidation.call);
      };
      /**
       * Executed when child component added. At this stage child does not know about parent component and its just finished initialization.
       * @property $childAdded
       * @memberOf aw.components.utils.ComponentController
       * @type {aw.events.EventListener}
       * @instance
       */
      this.$childAdded = this.$createListener();
      /**
       * Executed when child component removed
       * @property $childRemoved
       * @memberOf aw.components.utils.ComponentController
       * @type {aw.events.EventListener}
       * @instance
       */
      this.$childRemoved = this.$createListener();
      /**
       * Executed after component being added to the parent component.
       * At this point, parent was notified about new child and probably
       * already placed event handlers.
       * @property $addedToParent
       * @memberOf aw.components.utils.ComponentController
       * @type {aw.events.EventListener}
       * @instance
       */
      this.$addedToParent = this.$createListener();
      /**
       * Executed after component being removed from the parent component.
       * @property $removedFromParent
       * @memberOf aw.components.utils.ComponentController
       * @type {aw.events.EventListener}
       * @instance
       */
      this.$removedFromParent = this.$createListener();
      /**
       * @property $$initialized
       * @memberOf aw.components.utils.ComponentController
       * @type {boolean}
       * @instance
       * @private
       */
      this.$$initialized = true;
      /*
       Call preinitHandler if setup. Called after initialization but before being added to parent component.
       */
      if (typeof(preinitHandler) == "function") {
        preinitHandler.call(this);
      }
      /*
       Register component and find its parent. Starts event sequence $childAdded/$addedToParent if parent found.
       */
      aw.components.utils.ComponentScopeRegistry.add($scope, this);
    };
  }

  aw.components.utils.ComponentController = ComponentController;
  /**
   * @function isComponentController
   * @memberOf ComponentController
   * @param {Object} instance
   * @return {boolean}
   * @static
   */
  ComponentController.isComponentController = function ComponentController_isComponentController(instance) {
    return instance instanceof ComponentController;
  };
  /**
   * @function isComponentControllerClass
   * @memberOf ComponentController
   * @param {Function} constructor
   * @return {boolean}
   * @static
   */
  ComponentController.isComponentControllerClass = function ComponentController_isComponentControllerClass(constructor) {
    return constructor instanceof Function && (constructor === ComponentController || ComponentController.prototype.isPrototypeOf(constructor.prototype));
  };
})();
