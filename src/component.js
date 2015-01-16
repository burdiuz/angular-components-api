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
(function(){
  var components = window.aw.components;
  /**
   * Base class for all components, must be loaded first with angular ignoring AMD
   * @class aw.components.Component
   * @constructor
   */
  function Component($scope, target){
    if($scope){
      this.$initialize($scope, target);
    }

    /**
     * @function $initialize
     * @memberOf aw.components.Component
     * @param {Object} $scope
     * @param {Object} target
     * @instance
     */
    this.$initialize = function Component_$initialize($scope, target) {
      if(this.$$initialized){
        throw new Error('Component instance initialized already.');
      }
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
       * @function $createListener
       * @memberOf aw.components.Component
       * @returns {aw.events.EventListener}
       */
      this.$createListener = function Component_$createListener() {
        return aw.events.EventListener.create($scope);
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
       * @memberOf aw.components.Component
       * @type {boolean}
       * @instance
       */
      this.$$initialized = true;
    };
  }
  aw.components.Component = Component;
  /**
   * @function isComponent
   * @memberOf aw.components.Component
   * @param {Object} instance
   * @return {boolean}
   * @static
   */
  Component.isComponent = function Component_isComponent(instance){
    return instance instanceof Component;
  };
  /**
   * @function isComponentClass
   * @memberOf aw.components.Component
   * @param {Function} constructor
   * @return {boolean}
   * @static
   */
  Component.isComponentClass = function Component_isComponentClass(constructor){
    return constructor instanceof Function && (constructor===Component || Component.prototype.isPrototypeOf(constructor.prototype));
  };
  /**
   * @function extend
   * @memberOf aw.components.Component
   * @param {Function} constructor
   * @return {Function}
   * @static
   */
  Component.extend = function Component_extend(constructor){
    constructor.prototype = new Component();
    constructor.prototype.constructor = constructor;
  };
  /**
   * @function registerController
   * @memberOf aw.components.Component
   * @param controllerDefinition
   * @param componentDefinition
   * @returns {*}
   * @constructor
   */
  Component.registerController = function Component_registerController(controllerDefinition, componentDefinition){
    if(controllerDefinition instanceof aw.components.utils.ComponentController){
      throw Error('Component cannot be registered twice.');
    }
    if(componentDefinition && !Component.isComponentClass(componentDefinition)){
      Component.extend(componentDefinition);
    }
    /**
     * @extends aw.components.Component
     * @constructor
     */
    function ComponentControllerInstance(){
      var instance = this;
      /**
       *
       * @param {Object} $scope
       * @param {aw.components.Component?} facade
       * @param preinitHandler
       * @instance
       */
      this.$initialize = function ComponentControllerInstance_$initialize($scope, facade, preinitHandler){
        instance.__proto__.$initialize.call(this, $scope, Component.forceFacade($scope, facade, componentDefinition, this, instance), preinitHandler);
      };
    }
    ComponentControllerInstance.prototype = new aw.components.utils.ComponentController();
    ComponentControllerInstance.prototype.constructor = ComponentControllerInstance;
    var parent = new ComponentControllerInstance();
    //mixin current class with component instance replacing component's fields.
    for(var param in controllerDefinition.prototype){
      parent[param] = controllerDefinition.prototype[param];
    }
    controllerDefinition.prototype = parent;
    controllerDefinition.prototype.constructor = controllerDefinition;
    return controllerDefinition;
  };
  /**
   * @function forceFacade
   * @memberOf aw.components.Component
   * @param $scope
   * @param instance
   * @param constructor
   * @param target
   * @param context
   * @returns {aw.components.Component}
   * @static
   * @private
   */
  Component.forceFacade = function Component_forceFacade($scope, instance, constructor, target, context){
    if(instance && instance.isPrototypeOf(target)) instance = target; // if controller prototype passed as facade instance
    var parent;
    if(instance || (!instance && !constructor)){
      if(!instance) instance = target;
      if(instance==target){
        // if controller will represent itself as component
        parent = new Component();
        var initHandler = context.$initialize; // ComponentControllerInstance.$initialize
        context.$initialize = function($scope, target, preinitHandler){
          parent.$initialize.call(target, $scope, target);
          initHandler.call(context, $scope, target, preinitHandler);
        };
        context.__proto__.__proto__ = parent;
      }else if(!(instance instanceof Component)){
        //if any object that is not Component passed as facade instance
        instance.__proto__ = new Component($scope, target);
      }
    }else if(constructor){
      // we have component class which we can instantiate
      instance = new constructor($scope, target);
    }
    return instance;
  };
})();