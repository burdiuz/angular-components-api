# angular-components-api
Simple yet effective API for components based communication over angular framework

Promises instead of events
This communication trick was used not to replace events but mix them with easier to use method with
modified promises(endless promises, which cannot be "resolved") that can be called more than once.
This approach has limitations like having link to event dispatcher is mandatory. But having endless promises as
communication base gives some advantages:
* Promises are real properties living on components facade, they will trigger runtime error if you misspell them.
* Promises will not bubble, there are no need to worry about naming conventions.
* You can define what events exactly will be fired from component with property per promise. Most IDEs will have context help regarding this.

Communication between components
When component instance created and its added to application, parent component will be notified with "addedToParent" event.
Then component will be notified that its added to some parent component so they can start communicating.


# IDE Templates
Webstorm Templates:
* bundle template - Includes Component, ComponentController and Directive definitions
* complete template - Includes Everything templated, lots of settings
* component template - Component facade class with configuration
* controller template - Angular Component-ready Controller template
(WebStorm Templates Help page)[https://www.jetbrains.com/webstorm/help/creating-and-editing-file-templates.html#d1273479e250]