/**
 * Created by Oleg Galaburda on 11.01.2015.
 */
window.aw = window.aw || {};
window.aw.utils = window.aw.utils || {};
(function(){
  var utils = window.aw.utils;
  /**
   * @class aw.utils.ValidationHandler
   * @param handler
   * @param timeout
   * @constructor
   */
  function ValidationHandler(handler, timeout){
    /**
     * @property handler
     * @memberOf aw.utils.ValidationHandler
     * @type {Function}
     * @instance
     */
    this.handler = handler;
    /**
     * @property target
     * @memberOf aw.utils.ValidationHandler
     * @type {Object}
     * @instance
     */
    this.target = null;
    /**
     * @property timeout
     * @memberOf aw.utils.ValidationHandler
     * @type {number}
     * @instance
     */
    this.timeout = timeout || ValidationHandler.DEFAULT_TIMEOUT;
    /**
     * @type {Number}
     * @private
     */
    var timeoutId = NaN;
    var callHandler = function(target, args){
      timeoutId = NaN;
      this.handler.apply(this.target, arguments);

    };
    /**
     * @function call
     * @memberOf aw.utils.ValidationHandler
     * @param {*} [rest]
     * @instance
     */
    this.call = function ValidationHandler_call(rest){
      this.prevent();
      timeoutId = setTimeout(callHandler, timeout, this.target, arguments);
    };
    /**
     * @function apply
     * @memberOf aw.utils.ValidationHandler
     * @param {Array} [args]
     * @param {Object} [target]
     * @instance
     */
    this.apply = function ValidationHandler_apply(args, target){
      this.prevent();
      timeoutId = setTimeout(callHandler, timeout, this.target, args || []);
    };
    /**
     * @function callImmediately
     * @memberOf aw.utils.ValidationHandler
     * @param {*} [rest]
     * @instance
     */
    this.callImmediately = function ValidationHandler_callImmediately(rest){
      this.prevent();
      callHandler(this.target, arguments);
    };
    /**
     * @function applyImmediately
     * @memberOf aw.utils.ValidationHandler
     * @param {Array} [args]
     * @param {Object} [target]
     * @instance
     */
    this.applyImmediately = function ValidationHandler_applyImmediately(args, target){
      this.prevent();
      callHandler(this.target, args || []);
    };
    /**
     * @function isAvailable
     * @memberOf aw.utils.ValidationHandler
     * @returns {boolean}
     * @instance
     */
    this.isAvailable = function ValidationHandler_isAvailable(){
      return typeof(handler)==="function";
    };
    /**
     * @function isRunning
     * @memberOf aw.utils.ValidationHandler
     * @returns {boolean}
     * @instance
     */
    this.isRunning = function ValidationHandler_isRunning(){
      return !isNaN(timeoutId);
    };
    /**
     * @function prevent
     * @memberOf aw.utils.ValidationHandler
     * @instance
     */
    this.prevent = function ValidationHandler_prevent(){
      if(timeoutId){
        clearTimeout(timeoutId);
        timeoutId = NaN;
      }
    };
    /**
     * @function clear
     * @memberOf aw.utils.ValidationHandler
     * @instance
     */
    this.clear = function ValidationHandler_clear(){
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
   * @property DEFAULT_TIMEOUT
   * @memberOf aw.utils.ValidationHandler
   * @type {number}
   * @static
   */
  ValidationHandler.DEFAULT_TIMEOUT = 25;
  /**
   * @function create
   * @memberOf aw.utils.ValidationHandler
   * @param {Function} handler
   * @param {number} [timeout]
   * @param {Object} [target]
   * @returns {aw.utils.ValidationHandler}
   * @static
   */
  ValidationHandler.create = function(handler, timeout, target){
    var result = new ValidationHandler(handler, timeout);
    if(target) result.target = target;
    return result;
  };
  utils.ValidationHandler = ValidationHandler;
})();