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
//TODO add Function.bind fallback with angular.bind for phantomjs
/*
 * Component instance registry, holds all created component instances
 * and their scopes. Also, after adding new component will resolve its
 * connection to parent component.
 */
(function(){
  var aw = window.aw;
  function ComponentScopeRegistry(){
    /**
     * @type {ComponentScopeRegistry}
     */
    var registry = this;
    /**
     * Component scope objects
     * @type {Object[]}
     * @private
     */
    var scopes = [];
    /**
     * Component instances
     * @type {aw.components.Component[]}
     * @private
     */
    var components = [];
    /**
     * Component interfaces
     * @type {aw.components.utils.ComponentInterface[]}
     * @private
     */
    var interfaces = [];
    /**
     * @param {Object} $scope
     * @returns {aw.components.utils.ComponentInterface}
     * @private
     */
    function getInterface($scope){
      if($scope.$$interface instanceof aw.components.utils.ComponentInterface) return $scope.$$interface;
      var index = scopes.indexOf($scope);
      var result;
      if(index>=0){
        result = interfaces[index];
      }
      return result;
    }
    /**
     * Find parent component index in registry lists
     * @function
     * @param {Object} $scope
     * @returns {number}
     * @private
     */
    function findParentIndex($scope){
      var index = -1;
      var $child;
      var $current = $scope.$parent || $scope.$root;
      while($current && $current!=$child){
        index = scopes.indexOf($current);
        if (index >= 0) break;
        else {
          $child = $current;
          $current = $child.$parent || $child.$root;
        }
      }
      return index;
    }
    //------------------------------------------------------------ Public
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
      scopes.push($scope);
      components.push(component);
      interfaces.push(componentInterface);
      $scope.$on('$destroy', function(){
        registry.remove(component);
      });
      var parentIndex = findParentIndex($scope);
      if(parentIndex>=0){
        interfaces[parentIndex].addChild(component);
        componentInterface.setParent(parent);
      }
    };
    /**
     * Find parent component.
     * @function
     * @name aw.components.utils.ComponentScopeRegistry#parent
     * @param {aw.components.Component|Object} componentOrScope
     * @returns {*}
     */
    this.parent = function ComponentScopeRegistry_parent(componentOrScope){
      var index = -1;
      if(componentOrScope instanceof aw.components.Component){
        index = components.indexOf(componentOrScope);
      }else{
        index = scopes.indexOf(componentOrScope);
      }
      return index>=0 ? interfaces[index].getParent() : null;
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
      var $scope = scopes[index];
      /**
       * @type {aw.components.utils.ComponentInterface}
       */
      var componentInterface = interfaces[index];
      scopes.splice(index, 1);
      components.splice(index, 1);
      interfaces.splice(index, 1);
      var parent = this.parentByScope($scope);
      if(parent) {
        parent.$$removeChild(component);
        componentInterface.setParent(null);
      }
    }
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
     * @param {Object} $scope
     * @returns {aw.components.Component}
     */
    this.get = function ComponentScopeRegistry_get($scope){
      if($scope.$$component instanceof aw.components.Component) return $scope.$$component;
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