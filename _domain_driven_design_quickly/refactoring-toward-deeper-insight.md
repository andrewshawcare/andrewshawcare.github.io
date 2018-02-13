---
title: Refactoring Toward Deeper Insight
date: 1970-01-01 00:00:03
---
## How might one refine the domain model?

One refines the domain model through continuous integration of concepts discovered through communication and design.

As the domain is discussed between domain experts and developers a common understanding is formed and captured in the domain model. Initially, the common understanding will be incomplete. After basic concepts have been established further work must be done to expose implicit concepts that might not appear obvious initially.

The signs of implicit concepts may be a current domain model with difficult to understand object relationships or behaviours. These complex structures are indications that simpler concepts might be able to be teased apart and identified as implicit concepts that contribute to a larger idea. In this case, a complex singular relationship or behavior might be modelled by a greater number of simpler objects or behaviours.

There might be concepts expressed with contradictory language between domain experts. This might be an indication of separate bounded contexts, but could also be a clue that an idea has additional novelty that has not been properly qualified. In the latter case, it is useful to exercise the concept definition further and see if contradictory language can be reconciled. This reconciliation process may yield additional concepts that can be used to clarify different perceptions for common ideas.

It might also be that concepts defined in the domain model conflict with well-defined industry standards. This may not be a bad thing if there is enough novelty in our domain to warrant distinction, but it is useful to validate that these distinctions are not really a consequence of combining an industry standard concept with implicit concepts that are mutually exclusive to the industry standard being modelled.

## How do important aspects of the domain become realized in the model?

Important aspects of the domain become realized in three primary forms: constraints, processes, and specifications.

A constraint is a model of invariant that may be applied to an object. In other words, a constraint applies restrictions on object behaviour. An example of a constraint is extraction of the invariant that a credit card may only have an expiration date set in the future. The invariant specified, namely that an object date attribute must be set in the future, may be applicable to other objects (e.g. launch date of a marketing campaign). However, an invariant does not have to be widely applicable to be considered as a constraint. It may be helpful to introduce a set of constraints to express an object's complex behavioural logic in a more intuitive way.

A process is the isolated representation of behaviour. It may be that, in addition to objects, behaviours are represented as first-class citizens in the domain model. When this occurs, it is useful to model these behaviours as processes.

Commonly, these behaviours are then exposed in the design as services where objects may access or be accessed by the modelled behaviour.

A specification is a predicate that is evaluated based on characteristics of an object. It differs from a constraint in that it may not be used to restrict behaviour, but could be used to encapsulate computed attributes as well.
