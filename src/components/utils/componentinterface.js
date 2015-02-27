/**
 * Created by Oleg Galaburda on 16.01.2015.
 */
/**
 * @namespace aw.components
 */
aw.components = aw.components || {};
/**
 * @namespace aw.components.utils
 */
aw.components.utils = aw.components.utils || {};
/**
 *
 * @class
 * @name aw.components.utils.ComponentInterface
 * @param $scope
 * @constructor
 */
function ComponentInterface($scope) {
  /**
   * Child components
   * @type {aw.components.Component[]}
   * @private
   */
  var children = [];
  /**
   * Parent component
   * @type {aw.components.Component}
   * @private
   */
  var parent = null;
  /**
   * Current state of the component
   * @type {string}
   * @private
   */
  var state = aw.data.ComponentStates.CREATED;
  /**
   * @type {aw.events.EventListener}
   * @private
   */
  var childAdded = this.createListener();
  /**
   * Executed when child component added. At this stage child does not know about parent component and its just finished initialization.
   * @property
   * @name aw.components.utils.ComponentInterface#childAdded
   * @type {aw.events.EventListener}
   * @instance
   */
  this.childAdded = childAdded;
  /**
   * @type {aw.events.EventListener}
   * @private
   */
  var childRemoved = this.createListener();
  /**
   * Executed when child component removed
   * @property
   * @name aw.components.utils.ComponentInterface#childRemoved
   * @type {aw.events.EventListener}
   * @instance
   */
  this.childRemoved = childRemoved;
  /**
   * @type {aw.events.EventListener}
   * @private
   */
  var addedToParent = this.createListener();
  /**
   * Executed after component being added to the parent component.
   * At this point, parent was notified about new child and probably
   * already placed event handlers.
   * @property
   * @name aw.components.utils.ComponentInterface#addedToParent
   * @type {aw.events.EventListener}
   * @instance
   */
  this.addedToParent = addedToParent;
  /**
   * @type {aw.events.EventListener}
   * @private
   */
  var removedFromParent = this.createListener();
  /**
   * Executed after component being removed from the parent component.
   * @property
   * @name aw.components.utils.ComponentInterface#removedFromParent
   * @type {aw.events.EventListener}
   * @instance
   */
  this.removedFromParent = removedFromParent;
  /**
   * Return list of child components
   * @returns {aw.components.Component[]}
   * @instance
   */
  this.getChildren = function ComponentInterface_getChildren() {
    return children.slice();
  };
  /**
   * Add child component to this component children list.
   * This function is private to other components and must not
   * be called. It will be invoked automatically when child
   * component registers itself as component instance.
   * @function
   * @name aw.components.utils.ComponentInterface#addChild
   * @param {aw.components.Component} component
   * @instance
   */
  this.addChild = function ComponentInterface_addChild(component) {
    if (component) {
      children.push(component);
      childAdded.$fire(component);
    }
  };
  /**
   * Remove child component from this component children list.
   * This function is private to other components and must not
   * be called. It will be invoked automatically when child
   * component being removed from component instance registry.
   * @function
   * @name aw.components.utils.ComponentInterface#removeChild
   * @param {aw.components.Component} component
   * @instance
   */
  this.removeChild = function ComponentInterface_removeChild(component) {
    var index = children.indexOf(component);
    if (component && index >= 0) {
      children.splice(index, 1);
      childRemoved.$fire(component);
    }
  };
  /**
   * Get parent component
   * @function
   * @name aw.components.utils.ComponentInterface#getParent
   * @instance
   */
  this.getParent = function ComponentInterface_getParent() {
    return parent;
  };
  /**
   * Set component to be a parent to this one
   * @function
   * @name aw.components.utils.ComponentInterface#setParent
   * @param {aw.components.Component} component
   * @instance
   */
  this.setParent = function ComponentInterface_setParent(component) {
    if (parent) {
      removedFromParent.$fire(parent);
    }
    parent = component;
    if (parent) {
      addedToParent.$fire(parent);
    }
  };
  /**
   * @type {aw.events.EventListener}
   * @private
   */
  var stateChanged = this.createListener();
  /**
   * Executed after component state has been changed.
   * @property
   * @name aw.components.utils.ComponentInterface#stateChanged
   * @type {aw.events.EventListener}
   * @instance
   */
  this.stateChanged = stateChanged;
  /**
   * Retrieve current component state
   * @function
   * @name aw.components.utils.ComponentInterface#getState
   * @returns {string}
   * @instance
   */
  this.getState = function ComponentInterface_getState() {
    return state;
  };
  /**
   * Set new component state
   * @function
   * @name aw.components.utils.ComponentInterface#setState
   * @param {string} value
   * @instance
   */
  this.setState = function ComponentInterface_setState(value) {
    if (state != value) {
      state = value;
      stateChanged.$fire(state);
    }
  };
}

aw.components.utils.ComponentInterface = ComponentInterface;
/**
 * @type {Object|Function|ComponentInterface}
 * @private
 */
var p = ComponentInterface.prototype;
/**
 * Create promise event listener that will be called every time when event fired.
 * @function
 * @name aw.components.utils.ComponentInterface#createListener
 * @returns {aw.events.EventListener}
 * @instance
 */
p.createListener = function ComponentInterface_createListener() {
  return aw.events.EventListener.create();
};
/**
 * @function
 * @name aw.components.utils.ComponentInterface.create
 * @returns {aw.events.EventListener}
 * @static
 */
ComponentInterface.create = function ($scope) {
  return new ComponentInterface($scope);
}