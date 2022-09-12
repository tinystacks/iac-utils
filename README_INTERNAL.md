# utils
Stateless utility methods whose scope is outside of the TinyStacks domain.

## What's the difference between this and @tinystacks/common?
@tinystacks/common started as a more generic utility library but grew into something more tailored towards tinystacks and the v1 stacks that it creates.

The intention of this module is to serve other implementations we have that are not tied to the v1 tinystacks scope.  We should make every effort to keep the domain of any specific application out of this library and only include methods that are truly reusable across not just our own repositories but could be shared with others as well.

We should also strive to never let this module have internal dependencies.  Bringing in third party libraries like lodash is fine, but as soon as we introduce a dependency on something like @tinystacks/tinystack-sdk, we've brought this module into the scope of the application.