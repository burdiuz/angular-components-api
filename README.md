# angular-components-api
Simple yet effective API for components based communication over angular framework

# Promises instead of events
A little bit reworked promises which allow us to assign handlers and execute them if something coming.
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
    //Controller 2
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
* Promises are real properties living on components facade, they will trigger runtime error if you misspell them.
* They don't need to have some complex logic, they have local area of availability.
* You can define what events exactly will be fired from component with property per promise. Most IDEs will have context help regarding this.
* You can still use events as you always do, this is only recommended to use promises as communication base between components.

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
* $initialize - initialize component instance, must be called as sooner as better.
* $createListener - creates new event-promise
* $refresh - timeout $digest call. even if this function will be called N times in a row, $digest will be called once.
And predefined events-promises:
* $addedToParent - when this component is added to parent, you will receive link to parent component facade.
* $childAdded - when child component is added.
* $childRemoved - when child component is added.

# Communication between components
When component instance created and its added to application, parent component will be notified with "addedToParent" event.
Then component will be notified that its added to some parent component so they can start communicating.


# IDE Templates
Webstorm Templates:
* bundle template - Includes Component, ComponentController and Directive definitions
* complete template - Includes Everything templated, lots of settings
* component template - Component facade class with configuration
* controller template - Angular Component-ready Controller template  
[WebStorm Templates Help page](https://www.jetbrains.com/webstorm/help/creating-and-editing-file-templates.html#d1273479e250)

http://daringfireball.net/projects/markdown/syntax#link