# angular-components-api
Simple yet effective API for components based communication over angular framework. This component API is implemented not to replace any angular functionality but to, simplify development of angular component-based systems.

# List of Definitions
* **Component** - This is complex entity, which consists of Facade as publicly available API of the component, Interface as private interface which is hidden and used internally and Controller as heart of the component(if future components might be extended to any angular entity which has own `$scope`).
* **Controller** - Component Controller is angular controller which is registered as component.
* **Facade** - Component Facade, specific class of objects, its instances will be introduced to other components. This object must contain public API of the component and all inter-component communication must be implemented via facades.  Basically facades are introduced to make components not know about their controllers.
* **Registry** - Component Registry, singleton object that holds links between scope, facade and interface. It controls connection between components and responsible for handshake sequence.
* **Interface** - Component Interface, object created and used internally. Developer working with this component structure, normally should never need access to interface. It has methods to manage component's parent and children components.
* **Event Listener** - Class of objects which are able to call handlers based on internal event happeded in component.
* **Scope** - Angular `$scope` which is bound to Controller.


# Components communication mechanism
Components can communicate via instances of `aw.events.EventListener` class. This is short range mechanism allowing communication only between closest siblings. This type of communication allows you make isolated scopes of responsibility, when parent component is responsible for its child and developer not allowed to make cross linkage to components out of its scope.

Currently its based on angular promises internally using `$q` service. But it is subject to discuss and change. Currently I've prepared replacement version without any dependencies, they are interchangeable.

#Component registration

To tell system, that you have components in an application thir classes must be registered and instances initialized using propagated methods. 
Currently you can register any controller as component using `aw.components.Component.registerController()` method. This method accepts controller and controller facade classes as arguments and returns same controller class as result of its execution. Return value is a subject to change in future, so it is recommended to use this return value as argument in angular.Module.controller() method.
After controller instance is created, if its a component instance, it must be initialized with this.$initialize() method. this method accepts arguments:

 1. $scope - scope instance for current component. This is the only required argument, using scope will be found its child and parent component.
 2.  alternative facade instance object. Component facade instance will be created in initialization sequence, own for each controller instance. You may pass alternative facade object if you want specific functionality for instance which is being initialized. This object will be forced to be instance of aw.components.Component by replacing its prototype.
 3. preinitialization hander, which will be called after setting up component API but before registration and handshake sequence. 
When initialization is complete, component controller will get $initialized property with TRUE value and component state will be INITIALIZED.

# Handshake sequence
When child component is being registered handshake sequence of events happens to introduce it with its parent component. This is perfect time to register event listeners and setup other communication for both. Whole initialization process can be broken into key turns:

 1. Adding to scope special properties $$component and $$interface which will contain shortcut links to component and its internal interface. They are for internal use only, so forget about them. :-)
 2. Registration of component, scope, facade and interface object are being adeed to corresponding lists, so registry may find out which $scope connected to component to link them.
 3. Tell parent that it has new child vis call of $childadded eventListener.
 4. Tell child that it has parent component via $addedToParent eventListener.
 - 
 -
 -

# Promises instead of events
A little bit reworked promises which allow us to assign handlers and execute them if something coming. This is very specific short-range communication feature that is created not to replace but enrich communication possibilities.
I've called them EventListeners because of their purpose, but there are too many differences between them to compare.
To use them you need only object of aw.EventLsitener
```javascript
    // let's create EventListener object
    var listener = aw.events.EventListener.create();
    //subsctribe for event its going to fire
    //handle is just an alias of then()
    listener.handle(function(data){
        console.log('first listener', data);
    });
    listener.handle(function(){
        console.log('second listener');
        return 'data';
    }).then(function(data){
        console.log('third listener', data);
    });
    //then fire event with some data
    listener.$fire('ok');
    /*Output:
     first listener ok
     second listener
     third listener data
     */
```
Basically it just executes list of functions/handlers passing some data object to them.
This communication trick was used not to replace events but mix them, each have own purpose.
I found them to be better solution to communicate between components, because they are
accessible locally, only between components close to each other. So they are good to connect,
for example, child and parent components or siblings.

Since they are created as objects, to have access to them, they should be available as properties
or returned via method calls, so if you misspell such "event" it will not die silently, but you will
see runtime error about accessing method of undefined.
```javascript
    //Controller 1
    $scope.$on("passData", function(data){
      console.log(data);
    });
    //Controller 2 has typo in event name
    $scope.$emit("passDeta", "some data");
```
They just cannot interfere with other such notifications, so you are free of string, typos and naming conventions.
```javascript
    $scope.$on("passData1", function(dataType1){
      console.log(dataType1);
    });
    $scope.$on("passData2", function(dataType2){
      console.log(dataType2);
    });
    $scope.$on("passData3", function(dataType3){
      console.log(dataType3);
    });
```
To sum up:
 - Promises are real properties living on components facade, they will trigger runtime error if you misspell them.
 - They don't need to have some complex logic, they have local area of availability.
 - You can define what events exactly will be fired from component with property per promise. Most IDEs will have context help regarding this.
 - You can still use events as you always do, this is only recommended to use promises as communication base between components.

# Component
Currently only angular controllers are capable to be represented as components.
Each component must have controller and facade object which will be used as public API of controller.
Facade object will be passed to parent and children components on handshake sequence. To use controller as component, it should be registered
```javascript
    module.controller(Page.NAME, [
      "$scope",
      "$http",
      aw.components.Component.registerController(PageController, Page)
    ]);
```
Here PageController is angular controller and Page is class which will be instantiated every time when controller is initialized.
After "registration" controller will be mixed with aw.components.utils.ComponentController class and will gain some methods it needs to be a component:
 - `$initialize` - initialize component instance, must be called as sooner as better.
 - `$createListener` - creates new event-promise
 - `$refresh` - timeout $digest call. even if this function will be called N times in a row, $digest will be called once.    
And predefined events-promises:
 - `$addedToParent` - when this component is added to parent, you will receive link to parent component facade.
 - `$childAdded` - when child component is added.
 - `$childRemoved` - when child component is added.

# Communication between components
When component instance created and its added to application, parent component will be notified with "addedToParent" event.
Then component will be notified that its added to some parent component so they can start communicating.

# API planned for release
Component Controller
methods:
 - `$initialize()`
 - `$getState()`
 - `$setState()`
 - `$destroy()`
 - `$createListener()`
properties:
 - `$initialized`
 - `facade`
event listeners:
 - `$stateChanged`
 - `$addedToParent`
 - `$removedFromParent`
 - `$childAdded`
 - `$childRemoved`

Component Facade
methods:
 - `$initialize()`
 - `$createListener()`
properties:
 - `$initialized`
event listeners:
 - `$stateChanged`

EventListener
methods:

 - `handle()`
 - `handleOfType()`
 - `removeHandler()`
 - `hasHandlers()`
 - `$fire()`
 - `$clear()`
properties:
event listeners:

#$scope
methods:
properties:
 - `$$component`
 - `$$interface`
event listeners:

Component Interface
methods:
 - `setParent()`
 - `addChild()`
 - `removeChild()`
 - `createListener()`
properties:
event listeners:
 - `addedToParent`
 - `removedFromParent`
 - `childAdded`
 - `childRemoved`

Component Registry
methods:
 - add
 - parent
 - parentByScope
 - get
 - getInterface
properties:
event listeners:
 - componentAdded
 - componentRemoved


# IDE Templates
Webstorm Templates:
 - bundle template - Includes Component, ComponentController and Directive definitions
 - complete template - Includes Everything templated, lots of settings
 - component template - Component facade class with configuration
 - controller template - Angular Component-ready Controller template  
[WebStorm Templates Help page](https://www.jetbrains.com/webstorm/help/creating-and-editing-file-templates.html#d1273479e250)

http://daringfireball.net/projects/markdown/syntax#link

This document was created with help of free [StackEdit WYSIWYG Markdown editor](https://stackedit.io/).