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
  var utils = window.aw.components.utils;
  function ComponentScopeRegistry(){
    /**
     * Component scope objects
     * @type {Object[]}
     */
    var scopes = [];
    /**
     * component instances
     * @type {aw.Component[]}
     */
    var components = [];
    /**
     * Add component instance to registry. This will be
     * automatically done while component initialization.
     * @function add
     * @memberOf aw.components.utils.ComponentScopeRegistry
     * @param {Object} $scope
     * @param {aw.Component} component
     * @instance
     */
    this.add = function ComponentScopeRegistry_add($scope, component){
      if(!$scope || !component) return;
      var registry = this;
      scopes.push($scope);
      components.push(component);
      $scope.$on('$destroy', function(){
        registry.removeByScope($scope);
      });
      var parent = this.parentByScope($scope);
      if(parent) {
        if ('$$addChild' in parent) parent.$$addChild(component);
        if ('$$setParent' in component) component.$$setParent(parent);
      }
    };
    /**
     * Find parent component by child component scope object.
     * @function parentByScope
     * @memberOf aw.components.utils.ComponentScopeRegistry
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
     * @function parent
     * @memberOf aw.components.utils.ComponentScopeRegistry
     * @param {aw.Component} component
     * @returns {*}
     */
    this.parent = function(component){
      var $scope = this.getScope(component);
      return $scope ? this.parentByScope($scope) : null;
    };
    /**
     * Remove component instance from registry by its scope.
     * @function removeByScope
     * @memberOf aw.components.utils.ComponentScopeRegistry
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
     * @function remove
     * @memberOf aw.components.utils.ComponentScopeRegistry
     * Remove component instance from registry.
     * @param {aw.Component} component
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
     * @function remove
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
     * @function getScope
     * @memberOf aw.components.utils.ComponentScopeRegistry
     * @param {aw.Component} component
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
     * @function getControllerRegistry
     */
    this.get = function ComponentScopeRegistry_get($scope){
      if('$$component' in $scope && $scope.$$component instanceof aw.Component) return $scope.$$component;
      var index = scopes.indexOf($scope);
      var result;
      if(index>=0){
        result = components[index];
      }
      return result;
    };
  }
  utils.ComponentScopeRegistry = new ComponentScopeRegistry();
})();