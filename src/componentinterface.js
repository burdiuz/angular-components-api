/**
 * Created by Oleg Galaburda on 16.01.2015.
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
(function(){
  /**
   * @class
   * @name aw.components.utils.ComponentInterface
   * @param $scope
   * @constructor
   */
  function ComponentInterface($scope){
    /**
     * Child components
     * @type {aw.components.Component[]}
     * @instance
     */
    this.children = [];
    /**
     * Parent component
     * @type {aw.components.Component}
     * @instance
     */
    this.parent = null;
    /**
     * Executed when child component added. At this stage child does not know about parent component and its just finished initialization.
     * @property
     * @name aw.components.utils.ComponentInterface#childAdded
     * @type {aw.events.EventListener}
     * @instance
     */
    this.childAdded = this.createListener();
    /**
     * Executed when child component removed
     * @property
     * @name aw.components.utils.ComponentInterface#childRemoved
     * @type {aw.events.EventListener}
     * @instance
     */
    this.childRemoved = this.createListener();
    /**
     * Executed after component being added to the parent component.
     * At this point, parent was notified about new child and probably
     * already placed event handlers.
     * @property
     * @name aw.components.utils.ComponentInterface#addedToParent
     * @type {aw.events.EventListener}
     * @instance
     */
    this.addedToParent = this.createListener();
    /**
     * Executed after component being removed from the parent component.
     * @property
     * @name aw.components.utils.ComponentInterface#removedFromParent
     * @type {aw.events.EventListener}
     * @instance
     */
    this.removedFromParent = this.createListener();
  }
  aw.components.utils.ComponentInterface = ComponentInterface;
  /**
   * @type {Object|Function|ComponentInterface}
   * @private
   */
  var p = ComponentInterface.prototype;
  /**
   * Add child component to this component children list.
   * This function is private to other components and must not
   * be called. It will be invoked automatically when child
   * component registers itself as component instance.
   * @function
   * @name aw.components.utils.ComponentInterface#$addChild
   * @param {aw.components.Component} component
   * @instance
   */
  p.$addChild = function ComponentController_$addChild(component) {
    if (component) {
      this.children.push(component);
      this.childAdded.$fire(component);
    }
  };
  /**
   * Remove child component from this component children list.
   * This function is private to other components and must not
   * be called. It will be invoked automatically when child
   * component being removed from component instance registry.
   * @function
   * @name aw.components.utils.ComponentInterface#$removeChild
   * @param {aw.components.Component} component
   * @instance
   */
  p.$removeChild = function ComponentController_$removeChild(component) {
    var index = this.children.indexOf(component);
    if (component && index >= 0) {
      this.children.splice(index, 1);
      this.childRemoved.$fire(component);
    }
  };
  /**
   * Set component to be a parent to this one.
   * @function
   * @name aw.components.utils.ComponentInterface#setParent
   * @param {aw.components.Component} component
   * @instance
   */
  p.$setParent = function ComponentController_$setParent(component) {
    if (parent) {
      this.removedFromParent.$fire(this.parent);
    }
    this.parent = component;
    if (parent) {
      this.addedToParent.$fire(this.parent);
    }
  };
  /**
   * Create promise event listener that will be called every time when event fired.
   * @function
   * @name aw.components.utils.ComponentInterface#createListener
   * @returns {aw.events.EventListener}
   */
  p.createListener = function Component_createListener() {
    return aw.events.EventListener.create($scope);
  };
})();