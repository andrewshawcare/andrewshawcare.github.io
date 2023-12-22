---
title: Preserving Model Integrity
date: 1970-01-01 00:00:05
---
## What is a bounded context?

On a software project composed of many domain models, each model has been created with reference to a unique context. A bounded context demarcates the models for each context such that they can be understood in isolation. In addition, once this demarcation is clearly defined relationships of collaboration can be defined (e.g. shared kernel, customer-supplier, conformist, etc.).

For example, an enterprise application might have two teams or business units working in collaboration to create a software project. Each team will have some shared goals and some mutually exclusive goals. For each team, the combination of shared goals and their own mutually exclusive goals defines their context.

When defining bounded context scope to a team, it is implied that the team represents ownership over a cohesive set of goals that form a  product or service.

## What is continuous integration?

Continuous integration is a set of processes that ensure the domain model knowledge is communicated and validated throughout the team as quickly as possible.

When designing software, this means frequent code check-ins (i.e. trunk-based development) and a build pipeline with automated testing against the domain model.

When designing the domain model, this means frequent reviews of code to ensure alignment with the domain model and to uncover implicit concepts that may be suspected to exist.

## What is a context map?

A context map is a document that illustrates the various bounded contexts that might exist across an organizational unit. It is created and shared within the organization so that each team might understand the relationhips between various bounded contexts.

## What is a shared kernel?

A shared kernel is an explicit agreement between two or more teams to share ownership over a subset of their domain models.

A shared kernel has trade-offs. As it is agreed upon that the shared kernel has collective ownership, there is more governance and time involved when introducing changes. However, the effort might be offset by the cost of having the shared domain be implemented differently by more than one team.

For instance, it might be advantageous to share an ordering system with several applications. In this case, the order model might be shared so that an order can be processed the same way by any application. Any team can change the order model, but they must seek approval by all teams before doing so.

## What is the customer-supplier relationship?

The customer-supplier relationship is one where one team has full ownership over a mutually beneficial domain concept and provides changes to the concept to teams as a service. This is similar to a shared kernel relationship, however it is the team that supplies the domain concept that controls and is responsible for changes to the shared domain model.

## What is a conformist relationship?

A conformist relationship is when one team, who absolutely depends on the domain model of another and cannot establish a customer-supplier relationship, consumes the domain model provided by the other team without modification.

As opposed to the customer-supplier relationship, a conformist does not make change requests to it's supplier; it can only accept the services provided and must accommodate for any changes upon the supplier's schedule.

## What is an anticorruption layer?

An anticorruption layer is a communication intermediary between a pure domain model and an external system. The anticorruption layer exposes endpoints conformant with the model represented on both sides of it's interface and performs all necessary translation. This ensures conceptual purity of the domain model is not corrupted by the interfaces and data constructs provided by external systems.

## What is the separate ways relationship?

If a project depends on concepts from another team's bounded context but cannot or chooses not to form a relationship where integration can be negotiated, the separate ways relationship is available.

In this relationship, a team knowingly chooses to implement the common concept separately such that two implementations of the concept are created. Each team includes their version in their own bounded context and evolves the concept independently.

## What is an open host service?

An open host service is an attempt to provide a generalized interface over a shared concept. The advantage to the team providing the service is they do not have to translate their service for each client.

While care is taken to ensure that translation is reduced, it is not eliminated. In an open host service, the burden of translation is shifted from the service provider to the client implementations.

## What is distillation?

Distillation is the process of separating and classifying domain concepts from a domain model for the purpose of domain simplification.

Each concept can be classified as a core concept or a generic concept. A core concept is one that is critical to the domain. Removal of a core concept would result in an irreconcilable loss to the coherence of the domain. A generic concept might be removed from a domain without loss of coherence or encapsulated with similar concepts within a module such that the module represents enough novelty to remain relevant to the domain.

The goal of distillation is to identify and retain core concepts in the domain model and remove or encapsulate generic concepts. The result of which is a simpler, more expressive domain model.
