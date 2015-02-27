
(function () {
  "use strict";
  var module = angular.module('aw.components', []);
  var aw = {};
  module.constant('aw', aw);
aw.data = aw.data || {};
aw.data.ComponentStates = {
  "CREATED": "created",
  "INITIALIZED": "initialized",
  "DESTROYED": "destroyed"
};
aw.events = aw.events || {};
var $q = angular.injector(['ng']).get('$q');
function EventListener($scope, updateHandler) {
  var deferred;
  this.$fire = function EventListener_$fire(data) {
    deferred.notify.apply(deferred, arguments);
    if (updateHandler) {
      updateHandler();
    } else if ($scope && !$scope.$phase) {
      $scope.$digest();
    }
  };
  this.$clear = function EventListener_$clear() {
    deferred = $q.defer();
    var promise = deferred.promise;
    this.handle = promise.handle = promise.then = EventListener.chain(promise, promise.then);
    this.handleOfType = function (dataConstructor, callback) {
      if (dataConstructor) {
        this.handle(EventListener.typeDependentCallback(dataConstructor, callback));
      } else {
        throw new Error('aw.events.EventListener#handleOfType requires first parameter to be type string or constructor function, "' + dataConstructor + '" given.');
      }
    };
    this.promise = promise;
  };
  this.$clear();
};
aw.events.EventListener = EventListener;
EventListener.init = function EventListener_init($scope) {
  EventListener.$scope = $scope;
};
EventListener.create = function EventListener_create($scope, updateHandler) {
  return new EventListener($scope || EventListener.$scope, updateHandler);
};
EventListener.chain = function EventListener_chain(promise, callback) {
  return function _chain(handler) {
    var child = callback.apply(promise, [null, null, handler]);
    child.handle = child.then = EventListener.chain(child, child.then);
    return child;
  }
};
EventListener.switchableCallback = function EventListener_switchableCallback(callback) {
  var enabled = true;
  function SwitchableCallback(data) {
    if (enabled && callback) {
      data = callback.apply(this, arguments);
    }
    return data;
  }
  SwitchableCallback.isEnabled = function () {
    return enabled;
  };
  SwitchableCallback.isAvailable = function () {
    return callback && enabled;
  };
  SwitchableCallback.enable = function () {
    enabled = true;
  };
  SwitchableCallback.disable = function () {
    enabled = false;
  };
  SwitchableCallback.destroy = function () {
    enabled = false;
    callback = null;
  };
  return SwitchableCallback;
};
EventListener.typeDependentCallback = function EventListener_typeDependentCallback(dataConstructor, callback) {
  function TypeDependentCallback(data) {
    if (((typeof(dataConstructor) === "string" && typeof(data) === dataConstructor) || (typeof(dataConstructor) === "function" && data instanceof dataConstructor)) && callback) {
      data = callback.apply(this, arguments);
    }
    return data;
  }
  TypeDependentCallback.isAvailable = function () {
    return callback;
  };
  TypeDependentCallback.destroy = function () {
    callback = null;
    dataConstructor = null;
  };
  return TypeDependentCallback;
};
module.provider("eventListeners", function(){
  angular.extend(this, EventListener);
  this.$get = function(){
    angular.extend(this, EventListener);
  };
});
module.run([
  "$rootScope",
  function ($rootScope) {
    EventListener.init($rootScope);
  }
]);
aw.utils = aw.utils || {};
var $timeout = angular.injector(['ng']).get('$timeout');
function ValidationHandler(handler, timeout) {
  this.handler = handler;
  this.target = null;
  this.timeout = timeout || ValidationHandler.DEFAULT_TIMEOUT;
  var timeoutId = NaN;
  var callHandler = function (target, args) {
    timeoutId = NaN;
    this.handler.apply(this.target, arguments);
  };
  this.call = function ValidationHandler_call(rest) {
    this.prevent();
    timeoutId = setTimeout(callHandler, timeout, this.target, arguments);
  };
  this.apply = function ValidationHandler_apply(args, target) {
    this.prevent();
    timeoutId = setTimeout(callHandler, timeout, this.target, args || []);
  };
  this.callImmediately = function ValidationHandler_callImmediately(rest) {
    this.prevent();
    callHandler(this.target, arguments);
  };
  this.applyImmediately = function ValidationHandler_applyImmediately(args, target) {
    this.prevent();
    callHandler(this.target, args || []);
  };
  this.isAvailable = function ValidationHandler_isAvailable() {
    return typeof(handler) === "function";
  };
  this.isRunning = function ValidationHandler_isRunning() {
    return !isNaN(timeoutId);
  };
  this.prevent = function ValidationHandler_prevent() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = NaN;
    }
  };
  this.clear = function ValidationHandler_clear() {
    this.prevent();
    this.handler = null;
    this.target = null;
  };
  this.call = (this.call).bind(this);
  this.apply = (this.apply).bind(this);
  this.callImmediately = (this.callImmediately).bind(this);
  this.applyImmediately = (this.applyImmediately).bind(this);
  callHandler = (callHandler).bind(this);
}
ValidationHandler.DEFAULT_TIMEOUT = 25;
ValidationHandler.create = function (handler, timeout, target) {
  var result = new ValidationHandler(handler, timeout);
  if (target) result.target = target;
  return result;
};
aw.utils.ValidationHandler = ValidationHandler;
aw.components = aw.components || {};
aw.components.utils = aw.components.utils || {};
function ComponentInterface($scope) {
  var children = [];
  var parent = null;
  var state = aw.data.ComponentStates.CREATED;
  var childAdded = this.createListener();
  this.childAdded = childAdded;
  var childRemoved = this.createListener();
  this.childRemoved = childRemoved;
  var addedToParent = this.createListener();
  this.addedToParent = addedToParent;
  var removedFromParent = this.createListener();
  this.removedFromParent = removedFromParent;
  this.getChildren = function ComponentInterface_getChildren() {
    return children.slice();
  };
  this.addChild = function ComponentInterface_addChild(component) {
    if (component) {
      children.push(component);
      childAdded.$fire(component);
    }
  };
  this.removeChild = function ComponentInterface_removeChild(component) {
    var index = children.indexOf(component);
    if (component && index >= 0) {
      children.splice(index, 1);
      childRemoved.$fire(component);
    }
  };
  this.getParent = function ComponentInterface_getParent() {
    return parent;
  };
  this.setParent = function ComponentInterface_setParent(component) {
    if (parent) {
      removedFromParent.$fire(parent);
    }
    parent = component;
    if (parent) {
      addedToParent.$fire(parent);
    }
  };
  var stateChanged = this.createListener();
  this.stateChanged = stateChanged;
  this.getState = function ComponentInterface_getState() {
    return state;
  };
  this.setState = function ComponentInterface_setState(value) {
    if (state != value) {
      state = value;
      stateChanged.$fire(state);
    }
  };
}
aw.components.utils.ComponentInterface = ComponentInterface;
var p = ComponentInterface.prototype;
p.createListener = function ComponentInterface_createListener() {
  return aw.events.EventListener.create();
};
ComponentInterface.create = function ($scope) {
  return new ComponentInterface($scope);
}
aw.components = aw.components || {};
aw.components.utils = aw.components.utils || {};
function ComponentScopeRegistry() {
  var registry = this;
  var scopes = [];
  var components = [];
  var interfaces = [];
  function getInterface($scope) {
    if ($scope.$interface instanceof aw.components.utils.ComponentInterface) return $scope.$interface;
    var index = scopes.indexOf($scope);
    var result;
    if (index >= 0) {
      result = interfaces[index];
    }
    return result;
  }
  function findParentIndex($scope) {
    var index = -1;
    var $child;
    var $current = $scope.$parent || $scope.$root;
    while ($current && $current != $child) {
      index = scopes.indexOf($current);
      if (index >= 0) break;
      else {
        $child = $current;
        $current = $child.$parent || $child.$root;
      }
    }
    return index;
  }
  this.add = function ComponentScopeRegistry_add($scope, component, componentInterface) {
    if (!$scope || !component) return;
    scopes.push($scope);
    components.push(component);
    interfaces.push(componentInterface);
    $scope.$on('$destroy', function () {
      registry.remove(component);
    });
    var parentIndex = findParentIndex($scope);
    if (parentIndex >= 0) {
      interfaces[parentIndex].addChild(component);
      componentInterface.setParent(parent);
    }
  };
  this.parent = function ComponentScopeRegistry_parent(componentOrScope) {
    var index = -1;
    if (componentOrScope instanceof aw.components.Component) {
      index = components.indexOf(componentOrScope);
    } else {
      index = scopes.indexOf(componentOrScope);
    }
    return index >= 0 ? interfaces[index].getParent() : null;
  };
  this.remove = function ComponentScopeRegistry_remove(component) {
    var index = components.indexOf(component);
    var $scope = scopes[index];
    var componentInterface = interfaces[index];
    scopes.splice(index, 1);
    components.splice(index, 1);
    interfaces.splice(index, 1);
    var parent = this.parentByScope($scope);
    if (parent) {
      parent.$removeChild(component);
      componentInterface.setParent(null);
    }
  }
  this.getScope = function ComponentScopeRegistry_getScope(component) {
    var index = components.indexOf(component);
    var result;
    if (index >= 0) {
      result = scopes[index];
    }
    return result;
  };
  this.get = function ComponentScopeRegistry_get($scope) {
    if ($scope.$component instanceof aw.components.Component) return $scope.$component;
    var index = scopes.indexOf($scope);
    var result;
    if (index >= 0) {
      result = components[index];
    }
    return result;
  };
}
aw.components.utils.ComponentScopeRegistry = new ComponentScopeRegistry();
aw.components = aw.components || {};
function Component($scope, target) {
  if ($scope) {
    this.$initialize($scope, target);
  }
  this.$initialize = function Component_$initialize($scope, target) {
    if (this.$initialized) {
      throw new Error('Component instance initialized already.');
    }
    this.$createListener = function Component_$createListener() {
      return aw.events.EventListener.create($scope);
    };
    Object.defineProperty(this, '$initialized', {value: true});
  };
}
aw.components.Component = Component;
Component.isComponent = function Component_isComponent(instance) {
  return instance instanceof Component;
};
Component.isComponentClass = function Component_isComponentClass(constructor) {
  return constructor instanceof Function && (constructor === Component || Component.prototype.isPrototypeOf(constructor.prototype));
};
Component.extend = function Component_extend(constructor) {
  constructor.prototype = new Component();
  constructor.prototype.constructor = constructor;
};
Component.registerController = function Component_registerController(controllerDefinition, componentDefinition) {
  if (controllerDefinition instanceof aw.components.utils.ComponentController) {
    throw Error('Component cannot be registered twice.');
  }
  if (componentDefinition && !Component.isComponentClass(componentDefinition)) {
    Component.extend(componentDefinition);
  }
  function ComponentControllerInstance() {
    var instance = this;
    this.$initialize = function ComponentControllerInstance_$initialize($scope, facade, preinitHandler) {
      instance.__proto__.$initialize.call(this, $scope, Component.forceFacade($scope, facade, componentDefinition, this, instance), preinitHandler);
    };
  }
  ComponentControllerInstance.prototype = new aw.components.utils.ComponentController();
  ComponentControllerInstance.prototype.constructor = ComponentControllerInstance;
  var parent = new ComponentControllerInstance();
  for (var param in controllerDefinition.prototype) {
    parent[param] = controllerDefinition.prototype[param];
  }
  controllerDefinition.prototype = parent;
  controllerDefinition.prototype.constructor = controllerDefinition;
  return controllerDefinition;
};
Component.registerDirective = function Component_registerDirective(directiveOptions, componentDefinition, controllerDefinition) {
};
Component.forceFacade = function Component_forceFacade($scope, instance, constructor, target, context) {
  if (instance && instance.isPrototypeOf(target)) instance = target;
  var parent;
  if (instance || (!instance && !constructor)) {
    if (!instance) instance = target;
    if (instance == target) {
      parent = new Component();
      var initHandler = context.$initialize;
      context.$initialize = function ($scope, target, preinitHandler) {
        parent.$initialize.call(target, $scope, target);
        initHandler.call(context, $scope, target, preinitHandler);
      };
      context.__proto__.__proto__ = parent;
    } else if (!(instance instanceof Component)) {
      instance.__proto__ = new Component($scope, target);
    }
  } else if (constructor) {
    instance = new constructor($scope, target);
  }
  return instance;
};
aw.components = aw.components || {};
aw.components.utils = aw.components.utils || {};
function ComponentController() {
  var instance = this;
  this.$initialize = function ComponentController_$initialize($scope, facade, preinitHandler) {
    if (this.$initialized) {
      throw new Error('Component instance initialized already.');
    }
    var refreshValidation = aw.utils.ValidationHandler.create(function () {
      if (!$scope.$phase) {
        $scope.$digest();
      }
    });
    var digestListenerRemove = $scope.$watch(function () {
      refreshValidation.prevent();
    });
    this.$refresh = function () {
      refreshValidation.call();
    };
    this.$refreshImmediately = function () {
      refreshValidation.callImmediately();
    };
    var componentInterface = new aw.components.utils.ComponentInterface();
    this.$createListener = componentInterface.createListener;
    this.$childAdded = componentInterface.childAdded;
    this.$childRemoved = componentInterface.childRemoved;
    this.$addedToParent = componentInterface.addedToParent;
    this.$removedFromParent = componentInterface.removedFromParent;
    this.$stateChanged = componentInterface.stateChanged;
    Object.defineProperty(this, 'facade', {value: facade});
    Object.defineProperty(this, '$children', {get: componentInterface.getChildren()});
    Object.defineProperty(this, '$parent', {get: componentInterface.getParent()});
    this.$getState = componentInterface.getState;
    this.$setState = componentInterface.setState;
    if (typeof(preinitHandler) == "function") {
      preinitHandler.call(this);
    }
    if ($scope) {
      $scope.$component = facade;
      $scope.$interface = componentInterface;
    }
    Object.defineProperty(this, '$initialized', {value: true});
    aw.components.utils.ComponentScopeRegistry.add($scope, facade, componentInterface);
    componentInterface.setState(aw.data.ComponentStates.INITIALIZED);
  };
}
aw.components.utils.ComponentController = ComponentController;
ComponentController.isComponentController = function ComponentController_isComponentController(instance) {
  return instance instanceof ComponentController;
};
ComponentController.isComponentControllerClass = function ComponentController_isComponentControllerClass(constructor) {
  return constructor instanceof Function && (constructor === ComponentController || ComponentController.prototype.isPrototypeOf(constructor.prototype));
};
  function Components(){
    this.registerController = aw.components.Component.registerController;
    this.registerDirective = aw.components.Component.registerDirective;
  }
  var componentsInstance = new Components();
  module.provider('components', function ComponentsProvider() {
    Components.call(this);
    this.$get = [
      function ComponentsFactory() {
        return componentsInstance;
      }
    ];
  });
  Object.defineProperty(angular, "components", {value: componentsInstance, enumerable: true, writable: false});
})();