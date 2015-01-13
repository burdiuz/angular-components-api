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
window.aw.events = window.aw.events || {};
/*
 * aw.events.EventListener class represents promises that used as event listeners in components communication
 *
 Deffered with promise, used as Event dispatcher.
 Example:
 var app = angular.module('Something', []);
 app.run(['$q', '$rootScope', function($q, $rootScope){
 console.log(Date.now());
 EventListener.init($q, $rootScope);
 var listener = EventListener.create();
 listener.handle(function(data){
 console.log('IA');
 return data+' +IA';
 }).then(function(data){
 return data+' +IB';
 }).then(function(data){
 return data+' +IC';
 }).then(function(data){
 console.log(data+' +ID');
 });
 listener.handle(function(data){
 console.log('IIA');
 return data+' +IIA';
 }).then(function(data){
 return data+' +IIB';
 }).then(function(data){
 return data+' +IIC';
 }).then(function(data){
 console.log(data+' +IID');
 });
 listener.fire('data');
 console.log(' - end');
 }]);
 Output:
 1418761056950
 IA
 IIA
 data +IA +IB +IC +ID
 data +IIA +IIB +IIC +IID
 - end
 */
(function(){
  var events = window.aw.events;
  var $injector = angular.injector(['ng']);
  var $q = $injector.get('$q');
  /**
   * @class aw.events.EventListener
   * @param {Object} $scope
   * @param {Function} [updateHandler] - Handler will be called after each event fired
   * @constructor
   */
  function EventListener($scope, updateHandler){
    var deferred;
    /**
     * @function $fire
     * @memberOf  aw.events.EventLisneter
     * @param {*} data
     * @instance
     */
    this.$fire = function EventListener_$fire(data){
      deferred.notify.apply(deferred, arguments);
      if(updateHandler){
        updateHandler();
      }else if($scope && !$scope.$$phase){
        $scope.$digest();
      }
    };
    /**
     * @function $clear
     * @memberOf  aw.events.EventLisneter
     * @instance
     */
    this.$clear = function EventListener_$clear(){
      deferred = $q.defer();
      var promise = deferred.promise;
      /**
       * @function handle
       * @memberOf  aw.events.EventLisneter
       * @param {function} handler
       * @returns {Object|{then:function}}
       * @instance
       */
      this.handle = promise.handle = promise.then = EventListener.chain(promise, promise.then);
      /**
       * Will call handler only if received data has exactly same type as passed in second parameter.
       * Basically it has 2 rules, one of them must pass:
       * 1. data.constructor === dataConstructor -- when dataConstructor parameter is of Function type
       * 2. typeof(data) === dataConstructor -- when dataConstructor parameter is of String type
       * @function handleOfType
       * @memberOf  aw.events.EventLisneter
       * @param {Function|string} dataConstructor
       * @param {Function} callback
       */
      this.handleOfType = function(dataConstructor, callback){
        if(dataConstructor) {
          this.handle(EventListener.typeDependentCallback(dataConstructor, callback));
        }else{
          throw new Error('aw.EventListener#handleOfType requires first parameter to be type string or constructor function, "'+dataConstructor+'" given.');
        }
      };
      /**
       * @property promise
       * @memberOf  aw.events.EventLisneter
       * @type {Object|{then:function, handle:function}}
       */
      this.promise = promise;
    };
    this.$clear();
  };
  events.EventListener = EventListener;
  /**
   * @function init
   * @memberOf aw.events.EventLisneter
   * @param $scope
   * @static
   */
  EventListener.init = function EventListener_init($scope){
    EventListener.$scope = $scope;
  };
  /**
   * @function create
   * @memberOf aw.events.EventLisneter
   * @param {Object} $scope
   * @param {Function} [updateHandler] - Handler will be called after each event fired
   * @returns {aw.EventListener}
   * @static
   */
  EventListener.create = function EventListener_create($scope, updateHandler){
    return new EventListener($scope || EventListener.$scope, updateHandler);
  };
  /**
   * @function create
   * @memberOf aw.events.EventLisneter
   * @param {object} promise
   * @param {function} callback
   * @returns {function}
   * @private
   * @static
   */
  EventListener.chain = function EventListener_chain(promise, callback){
    return function _chain(handler){
      var child = callback.apply(promise, [null, null, handler]);
      child.handle = child.then = EventListener.chain(child, child.then);
      return child;
    }
  };
  /**
   * Wrap callback function making new callback that receives
   * new functionality -- enable(), disable() and isEnabled() methods.
   * @function switchableCallback
   * @memberOf aw.events.EventLisneter
   * @param {Function} callback
   * @returns {SwitchableCallback}
   * @static
   */
  EventListener.switchableCallback = function EventListener_switchableCallback(callback){
    var enabled = true;
    /**
     * @namespace SwitchableCallback
     * @extends Function
     * @private
     */
    function SwitchableCallback(data){
      if(enabled && callback) {
        data = callback.apply(this, arguments);
      }
      return data;
    }
    /**
     * Is callback function enabled
     * @function isEnabled
     * @memberOf SwitchableCallback
     * @returns {boolean}
     * @static
     */
    SwitchableCallback.isEnabled = function(){
      return enabled;
    };
    /**
     * Is callback function available and enabled
     * @function isAvailable
     * @memberOf SwitchableCallback
     * @returns {boolean}
     * @static
     */
    SwitchableCallback.isAvailable = function(){
      return callback && enabled;
    };
    /**
     * Enables callback allowing calls to it
     * @function enable
     * @memberOf SwitchableCallback
     * @static
     */
    SwitchableCallback.enable = function(){
      enabled = true;
    };
    /**
     * Disables callback disallowing calls to it
     * @function disable
     * @memberOf SwitchableCallback
     * @static
     */
    SwitchableCallback.disable = function(){
      enabled = false;
    };
    /**
     * Removes link to original callback making SwitchableCallback empty and useless
     * @function destroy
     * @memberOf SwitchableCallback
     * @static
     */
    SwitchableCallback.destroy = function(){
      enabled = false;
      callback = null;
    };
    return SwitchableCallback;
  };
  /**
   * Wrap callback function making new callback that receives
   * new functionality -- enable(), disable() and isEnabled() methods.
   * @function typeDependentCallback
   * @memberOf aw.events.EventLisneter
   * @param {Function} callback
   * @param {string|Function} dataConstructor
   * @returns {TypeDependentCallback}
   * @static
   */
  EventListener.typeDependentCallback = function EventListener_typeDependentCallback(dataConstructor, callback){
    /**
     * @namespace TypeDependentCallback
     * @extends Function
     * @private
     */
    function TypeDependentCallback(data){
      if(((typeof(dataConstructor)==="string" && typeof(data)===dataConstructor) || (typeof(dataConstructor)==="function" && data instanceof dataConstructor)) && callback) {
        data = callback.apply(this, arguments);
      }
      return data;
    }
    /**
     * Checks if callback can be used
     * @function isAvailable
     * @memberOf TypeDependentCallback
     * @static
     */
    TypeDependentCallback.isAvailable = function(){
      return callback;
    };
    /**
     * Removes link to original callback making TypeDependentCallback empty and useless
     * @function destroy
     * @memberOf TypeDependentCallback
     * @static
     */
    TypeDependentCallback.destroy = function(){
      callback = null;
      dataConstructor = null;
    };
    return TypeDependentCallback;
  };
})();