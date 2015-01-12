/**
 * Created by Oleg Galaburda on 11.01.2014.
 */

// FIXME For Angular Controllers develop unpackaging system that will allow us to create controllers from function expanding controller dependencies from function to controller object
/*
 1. hold map of extensions which class extended by other
 2. add possibility to register invoker functions that will map child constructor attributes into parent contructor
 3. while mapping child with parent, it should replace child's prototype with new parent instance
 4. on each child
 */
function ClassRegistry(){
  /**
   *
   * @param {function} child
   * @param {function} factory
   * @param {function} parent
   * @param {function} constructionFilter
   */
  this.mapClass = function(child, factory, parent, constructionFilter){
    var index;
    if(typeof(child)==="function" && typeof(parent)==="function"){
      var id = this.getId(child);
      if(id){
        throw new Error("Class has registered parent and cannot be extended more. Use mixins instead.");
      }
      var parentId = this.getId(parent);
      if(parentId) parent = getEntry(parentId);
      id = setId(child);
      setEntry(id, new ClassRegistryEntry(child, factory, parent, constructionFilter));
    }
  };
  /**
   *
   * @param {function} child
   * @param {function} mixin
   * @param {function} factory
   */
  this.mapMixin = function(child, mixin, factory){
    // check if class has mixin in ancestors and if has -- throw error
    // mixin cannot replace class fields
    if(typeof(child)==="function" && typeof(mixin)==="function") {
      var id = this.getId(child);
      if (id) {
        var entry = getEntry(id);
        entry.mixin(new ClassRegistryEntry(mixin, factory));
      } else {
        throw new Error('Class must be registered before adding mixin');
      }
    }
  };
  /**
   * Instantiate class.
   * @param {function} definition
   * @param {array} args
   */
  this.create = function(definition, args){
    var id = this.getId(definition);
    var instance;
    if(id){
      var entry = getEntry(id);
      instance = entry.create(args || []);
    }else{
      if(args && args.length) {
        var factory = this.makeArgsFactory(args.length);
        instance = factory(definition, args);
      }else{
        instance = new definition();
      }
    }
  };
  /**
   * Apply parent classes and mixins functionality to already created instance.
   * This method is useful when developer does not have control over instance
   * creation, so hi may call this method in construction time.
   * @param instance
   * @param args
   * @returns {boolean}
   */
  this.unpack = function(instance, args){
    var definition = instance.prototype.constructor;
    var id = this.getId(definition);
    if(id){
      var entry = getEntry(id);
      entry.install(instance, args);
      return true;
    }
    return false;
  };
  /**
   *
   * @param {function} definition
   * @returns {boolean}
   */
  this.hasId = function(definition){
    return '$__$id__' in definition;
  };
  /**
   *
   * @param {function} definition
   * @returns {?number}
   */
  this.getId = function(definition){
    return definition['$__$id__'];
  };
  /**
   *
   * @param {function} definition
   * @param {?number} length
   * @returns {function}
   */
  this.makeClassFactory = function(definition, length){
    length = isNaN(length) ? definition.length :  length;
    var args = '';
    if(length>0){
      while(length-->=0){
        args = args+',a'+length;
      }
      args = args.substr(1);
    }
    var constrHandlr;
    eval('constrHandlr = function('+args+'){ return new definition('+args+');};');
    return constrHandlr;
  };
  /**
   * Multipurpose factory creator, for unknown class and custom arguments count.
   * @param length
   * @returns {function}
   */
  this.makeArgsFactory = function(length){
    if(argMixins[length]) return argMixins[length];
    var index = length;
    var args = '';
    var constrHandlr;
    if(index>0){
      while(index-->=0){
        args = args+',a['+length+']';
      }
      args = args.substr(1);
    }
    eval('constrHandlr = function(d, a){ return new d('+args+');};');
    argMixins[length] = constrHandlr;
    return constrHandlr;
  };
  // privates
  var argMixins = [];
  var index = 0;
  var entries = {};
  function setId(definition){
    var id = String(++index);
    definition['$__$id__'] = id;
    return id;
  }
  function setEntry(id, entry){
    if(id in entries){
      throw new Error('ClassRegistry entry with id "'+id+'" already exists.');
    }
    entries[id] = entry;
  }
  function getEntry(id){
    return entries[id];
  }
}
var registry = aw.core.Registry = new ClassRegistry();

function ClassRegistryEntry(child, factory, parent, constructionFilter){
  this.definition = child;
  this.factory = factory;
  this.constructionFilter = constructionFilter;
  this.classes = [child];
  this.mixins = [];
  this.parent = parent;
  (function(){
    var parentClass;
    if(parent instanceof ClassRegistryEntry){
      this.classes.push.apply(this.classes, parent.classes);
      parentClass = parent.definition;
    }else if(parent){
      this.classes.push(parent);
      parentClass = parent;
    }
    if(parent) {
      child.prototype = new parentClass();
      child.prototype.constructor = child;
    }
  })();

  this.mixin = function(value){
    if(value instanceof ClassRegistryEntry){
      this.classes.push.apply(this.classes, value.classes);
    }else{
      this.classes.push(value);
    }
    this.mixins.push(value);
  };
  this.create = function(args){
    var instance;
    if(this.factory){
      instance = this.factory.apply(null, args);
    }else{
      var factory = registry.makeArgsFactory(args.length);
      instance = factory(this.definition, args);
    }
    if(this.parent || this.mixins.length){
      this.install(instance, args);
    }
    return instance;
  };
  //FIXME Add per instance registry of applied classes to not re-apply them or just make private key that will tell "installation complete".
  this.install = function(instance, args){
    if(this.isInstalled(instance)) return;
    if(this.parent){

    }
    if(this.mixins.length){

    }
    instance['$__crInstalled__'] = null;
  }
  this.isInstalled = function(instance){
    return '$__crInstalled__' in instance;
  }
}