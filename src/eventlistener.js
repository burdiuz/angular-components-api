  /**
   * @constructor
   * @class pb.EventListener
   * @param {Object} $scope
   * @param {Function} [updateHandler] - Handler will be called after each event fired
   */
  function EventListener($scope, updateHandler){
    var id = this.id = Math.random();
    var handlers;
    //var originalHandlers; -- keep original handlers to be able to remove them

    /**
     * @function handle
     * @memberOf  pb.EventLisneter
     * @param {function} handler
     * @returns {Object|{then:function}}
     * @instance
     */
    this.handle = this.then = function(handler, leaf){
      var listener = null;
      if(typeof(handler)==="function"){
        if(leaf) handlers.push(handler);
        else{
          listener = EventListener.create(updateHandler);
          handlers.push(function(data){
            listener.$fire(handler(data));
          });
        }
      }
      return listener;
    };
    /**
     * Will call handler only if received data has exactly same type as passed in second parameter.
     * Basically it has 2 rules, one of them must pass:
     * 1. data.constructor === dataConstructor -- when dataConstructor parameter is of Function type
     * 2. typeof(data) === dataConstructor -- when dataConstructor parameter is of String type
     * @function handleOfType
     * @memberOf  pb.EventLisneter
     * @param {Function|string} dataConstructor
     * @param {Function} callback
     */
    this.handleOfType = function(dataConstructor, callback){
      console.log('handleOfType', id, String(dataConstructor).substr(0, 50));
      if(dataConstructor) {
        this.handle(EventListener.typeDependentCallback(dataConstructor, callback));
      }else{
        throw new Error('pb.EventListener#handleOfType requires first parameter to be type string or constructor function, "'+dataConstructor+'" given.');
      }
    };
    /**
     * @function $fire
     * @memberOf  pb.EventListener
     * @name pb.EventLisneter#$fire
     * @param {*} data
     * @instance
     */
    this.$fire = function EventListener_$fire(data){
      setTimeout(fire, 0, data);
    };
    this.$clear = function EventListener_$clear(){
      handlers = [];
    };
    function fire(data){
      console.log(' ------------------------------- fire!', id, handlers.length);
      var length = handlers.length;
      for(var index=0; index<length; index++){
        console.log(data);
        console.log(handlers[index]);
        handlers[index](data);
      }
      if(updateHandler){
        updateHandler();
      }
    }
    this.$clear();
  }
  pb.EventListener = EventListener;
  /**
   * @function init
   * @memberOf pb.EventLisneter
   * @param $scope
   * @static
   */
  EventListener.init = function EventListener_init($scope){
    EventListener.$scope = $scope;
  };
  /**
   * @function create
   * @memberOf pb.EventLisneter
   * @param {Object} $scope
   * @param {Function} [updateHandler] - Handler will be called after each event fired
   * @returns {pb.EventListener}
   * @static
   */
  EventListener.create = function EventListener_create($scope, updateHandler){
    return new EventListener($scope || EventListener.$scope, updateHandler);
  };
  /**
   * @function create
   * @memberOf pb.EventLisneter
   * @param {object} promise
   * @param {function} callback
   * @returns {function}
   * @static
   */
  EventListener.chain = function EventListener_chain(promise, callback){
    return function _chain(handler){
      console.log('chain', handler);
      var child = callback.apply(promise, [null, null, handler]);
      child.handle = child.then = EventListener.chain(child, child.then);
      return child;
    }
  };