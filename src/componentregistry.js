/**
 * Created by Oleg Galaburda on 11.01.2015.
 * @exports aw.components.utils.ComponentScopeRegistry
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
/*
 * Component instance registry, holds all created component instances
 * and their scopes. Also, after adding new component will resolve its
 * connection to parent component.
 */
(function(){
  var aw = window.aw;
  function ComponentScopeRegistry(){
    /**
     * Component scope objects
     * @type {Object[]}
     */
    var scopes = [];
    /**
     * Component instances
     * @type {aw.components.Component[]}
     */
    var components = [];
    /**
     * Component interfaces
     * @type {aw.components.utils.ComponentInterface[]}
     */
    var interfaces = [];
    /**
     * Add component instance to registry. This will be
     * automatically done while component initialization.
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#add
     * @param {Object} $scope
     * @param {aw.components.Component} component
     * @param {aw.components.utils.ComponentInterface} componentInterface
     * @instance
     */
    this.add = function ComponentScopeRegistry_add($scope, component, componentInterface){
      if(!$scope || !component) return;
      var registry = this;
      scopes.push($scope);
      components.push(component);
      interfaces.push(componentInterface);
      $scope.$on('$destroy', function(){
        registry.removeByScope($scope);
      });
      var parent = this.parentByScope($scope);
      if(parent) {
        parent.$$addChild(component);
        componentInterface.$$setParent(parent);
      }
    };
    /**
     * Find parent component by child component scope object.
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#parentByScope
     * @param {Object} $scope
     * @returns {*}
     */
    this.parentByScope = function($scope){
      var parent;
      var $child;
      var $current = $scope.$parent || $scope.$root;
      while($current && $current!=$child){
        parent = this.get($current);
        if(parent) break;
        else{
          $child = $current;
          $current = $child.$parent || $child.$root;
        }
      }
      return parent;
    };
    /**
     * Find parent component.
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#parent
     * @param {aw.components.Component} component
     * @returns {*}
     */
    this.parent = function(component){
      var $scope = this.getScope(component);
      return $scope ? this.parentByScope($scope) : null;
    };
    /**
     * Remove component instance from registry by its scope.
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#removeByScope
     * @param {Object} $scope
     * @instance
     */
    this.removeByScope = function ComponentScopeRegistry_removeByScope($scope){
      var index = scopes.indexOf($scope);
      if(index>=0){
        remove(index);
      }
    };
    /**
     * Remove component instance from registry.
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#remove
     * @param {aw.components.Component} component
     * @instance
     */
    this.remove = function ComponentScopeRegistry_remove(component){
      var index = components.indexOf(component);
      if(index>=0){
        remove(index);
      }
    };
    /**
     * Removes component by its index in internal list of components
     * @function
     * @param {number} index
     * @private
     */
    var remove = (function ComponentScopeRegistry_removeByIndex(index){
      var $scope = scopes[index];
      var component = components[index];
      scopes.splice(index, 1);
      components.splice(index, 1);
      var parent = this.parentByScope($scope);
      if(parent) {
        if ('$$removeChild' in parent) parent.$$removeChild(component);
        if ('$$setParent' in component) component.$$setParent(null);
      }
    }).bind(this);
     /**
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#getScope
     * @param {aw.components.Component} component
     * @instance
     */
    this.getScope = function ComponentScopeRegistry_getScope(component){
      var index = components.indexOf(component);
      var result;
      if(index>=0){
        result = scopes[index];
      }
      return result;
    };
    /**
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#get
     */
    this.get = function ComponentScopeRegistry_get($scope){
      if('$$component' in $scope && $scope.$$component instanceof aw.components.Component) return $scope.$$component;
      var index = scopes.indexOf($scope);
      var result;
      if(index>=0){
        result = components[index];
      }
      return result;
    };
    /**
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#getInterface
     */
    this.getInterface = function ComponentScopeRegistry_getInterface($scope){
      if('$$interface' in $scope && $scope.$$interface instanceof aw.components.utils.ComponentInterface) return $scope.$$interface;
      var index = scopes.indexOf($scope);
      var result;
      if(index>=0){
        result = components[index];
      }
      return result;
    };
  }
  aw.components.utils.ComponentScopeRegistry = new ComponentScopeRegistry();
})();