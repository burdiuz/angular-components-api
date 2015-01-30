/**
 * Created by Oleg Galaburda on 22.01.2015.
 */
window.aw = window.aw || {};
/**
 * @namespace aw.data
 */
window.aw.data = window.aw.data || {};
(function(){
  /**
   * @namespace aw.data.ComponentStates
   * @type {{CREATED: string, INITIALIZED: string, DESTROYED: string}}
   */
  aw.data.ComponentStates = {
    /**
     * @name aw.data.ComponentStates#CREATED
     */
    "CREATED": "created",
    /**
     * @name aw.data.ComponentStates#INITIALIZED
     */
    "INITIALIZED": "initialized",
    /**
     * @name aw.data.ComponentStates#DESTROYED
     */
    "DESTROYED": "destroyed"
  };
})();