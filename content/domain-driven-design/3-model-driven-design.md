---
title: Model-driven design
---

## What is model-driven design?

Model-driven design is the process of analysts and developers collectively mapping the domain model to code and providing a communication feedback loop for that process.

The goal of model-driven design is to validate that the domain model can be applied to software and the resulting software enhances the domain the model abstracts.

## What is a layered architecture?

![Layered architecture](/assets/layered-architecture.png)
_Abel Avram and Floyd Marinescu, Domain-Driven Design Quickly (S.l.: C4Media, 2006)._

A layered architecture is one where different concerns are mapped to different layers of software. In relation to domain-driven design, a layered architecture must include a domain layer that is isolated from other concerns that might cause expression of the domain model to degrade. These concerns might be related to the user interface, the application logic, or infrastructure concerns.

## What is an entity?

Entities are objects that are defined by a unique identity. Entities usually originate outside of the software project and as a result are only a representation of an external construct. Examples of entities are bank accounts, customers, and orders.

## What is a value object?

A value object is an object that does not have a unique identity. The value object is defined, instead, by it's attributes and does not need to be represented uniquely throughout the system. If values have the same attributes, they are considered equal.

Value objects may not be unique on their own, but may be used to convey unique facts. An example is a chess piece. The rook, without any additional context, is equal to all other rooks that share the same attributes (e.g. a black rook is equal to any other black rook). By placing the rook on the game board at a particular position and on a particular player's turn, we can ensure that no other rook is equal to that rook given the same context (i.e. no other black rook occupies the same position on the same turn).

## What is a service?

A service is a behaviour or function that acts upon one or more objects. Ideally a service is stateless, meaning that it's output is defined entirely by it's provided input. One must be careful when considering if a service is stateless. We will consider an example where a service may appear stateless but the underlying infrastructure, and thus the service itself, is mutable.

Consider an availability checking service. It might take an employee and an availability period and return an availability status for the given employee. The service appears stateless because the service itself does not seem to depend on any internal state to function. However, if on Monday morning we check the availability of an employee for a meeting Friday afternoon and observe they are available, we might be disappointed to find the availability status changes later in the day. We have not changed our inputs to the service, but the output has changed. This is because availability periods for an employee can constantly change as an employee can accept meetings, decline meetings, or reschedule meetings. The service is implicitly dependent on time of access and the resulting scheduling actions of the employee. We can make this service truly stateless by adding a reference date as an input when checking for availability. This additional input makes explicit that we only are only ever sure of availability status for the time of query.

## What is a module?

A module is a group of cohesive domain concepts. Modules help with communicating about a domain model by allowing a conversation to focus on a set of concepts that perform a defined function.

Modules should be created with caution as it is easy to create a module but hard to change or remove one after it has been made. This is because a module creates a strong relationship between concepts that appear to be related. Consequently, this separates concepts from other independent concepts or modules. This may not be ideal early on in designing the domain model as connections between concepts may not be fully realized and early segregation may impact discoverability of new relationships.

## What is an aggregate?

An aggregate is an entity that encapsulates a group of associated objects. An aggregate is used to ensure data integrity and successful application of invariants by channeling the responsibility of modification through the root entity. This means the root entity is solely responsible and fully capable of ensuring internal consistency.

As a data structure, an aggregate can be thought of as a tree with the controlling entity being the root node. In addition, no nodes of the tree with exception to the root node may be shared with any other aggregate. This ensures that removal of the root entity means all aggregate nodes can be safely removed as well.

## What is a factory?

A factory is an abstraction designed to simplify object creation. When entities or aggregates are complicated to create, a factory can simplify the process by setting reasonable defaults and/or allowing short-hand construction interfaces by way of templates.

Factories are tightly coupled to the objects they create and must be changed when the underlying object constructor changes in a destructive way (i.e. asking for more creation attributes or providing less from the resulting object).

## What is a repository?

A repository is an abstraction over object retrieval from persistence infrastructure. The repository is a pure domain concept and adds a layer of abstraction between underlying strategies for object reconstitution. A repository allows retrieval using query semantics that can be as simple as find operations on entity identifiers, or complex constraint-based query predicates.

A repository is not a factory. A factory creates objects and a repository stores and retrieves objects that have already been created (either directly or with factories).
