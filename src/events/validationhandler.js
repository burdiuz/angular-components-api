/**
 * Created by Oleg Galaburda on 11.01.2015.
 */
/**
 * @namespace aw.utils
 */
aw.utils = aw.utils || {};
/**
 * @type {$timeout}
 */
var $timeout = angular.injector(['ng']).get('$timeout');
/**
 * @class aw.utils.ValidationHandler
 * @param handler
 * @param timeout
 * @constructor
 */
function ValidationHandler(handler, timeout) {
  /**
   * @property
   * @name  aw.utils.ValidationHandler#handler
   * @type {Function}
   * @instance
   */
  this.handler = handler;
  /**
   * @property
   * @name  aw.utils.ValidationHandler#target
   * @type {Object}
   * @instance
   */
  this.target = null;
  /**
   * @property
   * @name  aw.utils.ValidationHandler#timeout
   * @type {number}
   * @instance
   */
  this.timeout = timeout || ValidationHandler.DEFAULT_TIMEOUT;
  /**
   * @type {Number}
   * @private
   */
  var timeoutId = NaN;
  var callHandler = function (target, args) {
    timeoutId = NaN;
    this.handler.apply(this.target, arguments);

  };
  /**
   * @function
   * @name  aw.utils.ValidationHandler#call
   * @param {*} [rest]
   * @instance
   */
  this.call = function ValidationHandler_call(rest) {
    this.prevent();
    timeoutId = setTimeout(callHandler, timeout, this.target, arguments);
  };
  /**
   * @function
   * @name  aw.utils.ValidationHandler#apply
   * @param {Array} [args]
   * @param {Object} [target]
   * @instance
   */
  this.apply = function ValidationHandler_apply(args, target) {
    this.prevent();
    timeoutId = setTimeout(callHandler, timeout, this.target, args || []);
  };
  /**
   * @function
   * @name  aw.utils.ValidationHandler#callImmediately
   * @param {*} [rest]
   * @instance
   */
  this.callImmediately = function ValidationHandler_callImmediately(rest) {
    this.prevent();
    callHandler(this.target, arguments);
  };
  /**
   * @function
   * @name  aw.utils.ValidationHandler#applyImmediately
   * @param {Array} [args]
   * @param {Object} [target]
   * @instance
   */
  this.applyImmediately = function ValidationHandler_applyImmediately(args, target) {
    this.prevent();
    callHandler(this.target, args || []);
  };
  /**
   * @function
   * @name  aw.utils.ValidationHandler#isAvailable
   * @returns {boolean}
   * @instance
   */
  this.isAvailable = function ValidationHandler_isAvailable() {
    return typeof(handler) === "function";
  };
  /**
   * @function
   * @name  aw.utils.ValidationHandler#isRunning
   * @returns {boolean}
   * @instance
   */
  this.isRunning = function ValidationHandler_isRunning() {
    return !isNaN(timeoutId);
  };
  /**
   * @function
   * @name  aw.utils.ValidationHandler#prevent
   * @instance
   */
  this.prevent = function ValidationHandler_prevent() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = NaN;
    }
  };
  /**
   * @function
   * @name  aw.utils.ValidationHandler#clear
   * @instance
   */
  this.clear = function ValidationHandler_clear() {
    this.prevent();
    this.handler = null;
    this.target = null;
  };
  // initialization
  //FIXME should API be bound to each instance?
  this.call = (this.call).bind(this);
  this.apply = (this.apply).bind(this);
  this.callImmediately = (this.callImmediately).bind(this);
  this.applyImmediately = (this.applyImmediately).bind(this);
  callHandler = (callHandler).bind(this);
}

/**
 * @property
 * @name  aw.utils.ValidationHandler.DEFAULT_TIMEOUT
 * @type {number}
 * @static
 */
ValidationHandler.DEFAULT_TIMEOUT = 25;
/**
 * @function
 * @name  aw.utils.ValidationHandler.create
 * @param {Function} handler
 * @param {number} [timeout]
 * @param {Object} [target]
 * @returns {aw.utils.ValidationHandler}
 * @static
 */
ValidationHandler.create = function (handler, timeout, target) {
  var result = new ValidationHandler(handler, timeout);
  if (target) result.target = target;
  return result;
};
aw.utils.ValidationHandler = ValidationHandler;