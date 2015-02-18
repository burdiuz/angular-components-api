/**
 * Created by Oleg Galaburda on 11.01.2015.
 */
//FIXME implement mechanism which will allow to call methods that are overwritten in prototypes.
module.config([
  'aw',
  function (aw) {
    "use strict";
    /**
     * @namespace aw.components
     */
    aw.components = aw.components || {};
    /**
     * Base class for all components, must be loaded first with angular ignoring AMD
     * @class
     * @name aw.components.Component
     * @constructor
     */
    function Component($scope, target) {
      // scope passed only if instance of this class was created as standalone facade or __proto__ value
      if ($scope) {
        this.$initialize($scope, target);
      }
      /**
       * @function
       * @name aw.components.Component#$initialize
       * @param {Object} $scope
       * @param {Object} target
       * @instance
       */
      this.$initialize = function Component_$initialize($scope, target) {
        if (this.$initialized) {
          throw new Error('Component instance initialized already.');
        }
        /**
         * Create promise event listener that will be called every time when event fired.
         * @function
         * @name  aw.components.Component#$createListener
         * @returns {aw.events.EventListener}
         */
        this.$createListener = function Component_$createListener() {
          return aw.events.EventListener.create($scope);
        };
        /**
         * @property
         * @name  aw.components.Component#$initialized
         * @type {boolean}
         * @instance
         */

        Object.defineProperty(this, '$initialized', {value: true});
      };
    }

    aw.components.Component = Component;
    /**
     * @function
     * @name  aw.components.Component.isComponent
     * @param {Object} instance
     * @return {boolean}
     * @static
     */
    Component.isComponent = function Component_isComponent(instance) {
      return instance instanceof Component;
    };
    /**
     * @function
     * @name  aw.components.Component.isComponentClass
     * @param {Function} constructor
     * @return {boolean}
     * @static
     */
    Component.isComponentClass = function Component_isComponentClass(constructor) {
      return constructor instanceof Function && (constructor === Component || Component.prototype.isPrototypeOf(constructor.prototype));
    };
    /**
     * @function
     * @name  aw.components.Component.extend
     * @param {Function} constructor
     * @return {Function}
     * @static
     */
    Component.extend = function Component_extend(constructor) {
      constructor.prototype = new Component();
      constructor.prototype.constructor = constructor;
    };
    /**
     * @function
     * @name  aw.components.Component.registerController
     * @param controllerDefinition
     * @param componentDefinition
     * @returns {*}
     * @static
     */
    Component.registerController = function Component_registerController(controllerDefinition, componentDefinition) {
      if (controllerDefinition instanceof aw.components.utils.ComponentController) {
        throw Error('Component cannot be registered twice.');
      }
      if (componentDefinition && !Component.isComponentClass(componentDefinition)) {
        Component.extend(componentDefinition);
      }
      /**
       * @extends aw.components.Component
       * @constructor
       */
      function ComponentControllerInstance() {
        var instance = this;
        /**
         *
         * @param {Object} $scope
         * @param {aw.components.Component?} facade
         * @param preinitHandler
         * @instance
         */
        this.$initialize = function ComponentControllerInstance_$initialize($scope, facade, preinitHandler) {
          instance.__proto__.$initialize.call(this, $scope, Component.forceFacade($scope, facade, componentDefinition, this, instance), preinitHandler);
        };
      }

      ComponentControllerInstance.prototype = new aw.components.utils.ComponentController();
      ComponentControllerInstance.prototype.constructor = ComponentControllerInstance;
      var parent = new ComponentControllerInstance();
      //mixin current class with component instance replacing component's fields.
      for (var param in controllerDefinition.prototype) {
        parent[param] = controllerDefinition.prototype[param];
      }
      controllerDefinition.prototype = parent;
      controllerDefinition.prototype.constructor = controllerDefinition;
      return controllerDefinition;
    };

    /*
     1. If there are no controllerDefinition defined, use directiveOptions.controller
     2. directiveOptions must be a string -- directive name or object with "name" field or factory function that should return object or string
     3. create A directives for each property of component, methods are not allowed. Properties to become directive must be enumerable
     4. support binding and one time binding
     5. directiveOptions may have "propertyPrefix" defining prefix for property directives of this component. Default prefix is empty string.
     6. directiveOptions.link will be replaced with component logic, original must be saved in closure and executed after component initialization.
     7. directives for properties must be created when components directive first time used.
     8. each property directive must have restriction to be used only with component directive.
     9. Component directive may be A or E. Only E/AE creates property directives.
     */
    Component.registerDirective = function Component_registerDirective(directiveOptions, componentDefinition, controllerDefinition) {

    };
    /**
     * @function
     * @name  aw.components.Component.forceFacade
     * @param $scope
     * @param instance
     * @param constructor
     * @param target
     * @param context
     * @returns {aw.components.Component}
     * @static
     * @private
     */
    Component.forceFacade = function Component_forceFacade($scope, instance, constructor, target, context) {
      if (instance && instance.isPrototypeOf(target)) instance = target; // if controller prototype passed as facade instance
      var parent;
      if (instance || (!instance && !constructor)) {
        if (!instance) instance = target;
        if (instance == target) {
          // if controller will represent itself as component
          parent = new Component();
          var initHandler = context.$initialize; // ComponentControllerInstance.$initialize
          context.$initialize = function ($scope, target, preinitHandler) {
            parent.$initialize.call(target, $scope, target);
            initHandler.call(context, $scope, target, preinitHandler);
          };
          context.__proto__.__proto__ = parent;
        } else if (!(instance instanceof Component)) {
          //if any object that is not Component passed as facade instance
          instance.__proto__ = new Component($scope, target);
        }
      } else if (constructor) {
        // we have component class which we can instantiate
        instance = new constructor($scope, target);
      }
      return instance;
    };
  }
]);