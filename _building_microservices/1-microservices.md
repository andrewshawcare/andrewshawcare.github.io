---
title: Microservices
date: 1970-01-01 00:00:01
---
## What are microservices?

Microservices are services defined by the smallest identifiable behavioural boundaries in an organization. Microservices _are the product of_ small teams with cheap and reliable infrastructure that focus on delivering unique business value.

## What are the benefits of microservices?

The benefits of microservices are largely derived from high cohesion and low coupling. High cohesion is attained by ensuring microservices deliver unique business value. Low coupling is attained by ensuring the only way microservices communicate with each other is over a standardized network protocol (most commonly HTTP). This allows for:

* technology to vary between microservices which allow an organization to leverage existing expertise and attend to cross-functional requirements dependent on the needs of the individual service
* easier refactoring due to the limited domain and complexity each service is allowed
* mitigation of dependency failure, ensuring optional or less critical dependencies don't bring down mission-critical services
* cost savings of isolated horizontal scaling instead of vertically scaling a monolith due to subsystem bottlenecks
* independent deployment of business value via decoupled services

## What are the disadvantages of microservices?

While there are many benefits to microservices, no architectural decision fits all use cases. One must consider the technical and cultural constraints before taking on a large microservices effort. Some costs to a microservices architecture are:

* the large architectural overhead required to create, manage, and monitor service graphs of potentially hundreds of services
* the cost to refactor services if proper engineering discipline is not applied to ensure high cohesion and low coupling
* the overhead of dependency management as the service graph grows in size

## What is the difference between a microservice architecture and a service-oriented architecture?

A microservice architecture is _a kind of_ service oriented architecture. The theory of service-oriented architecture lives in a microservice architecture. The difference is the practical means of achieving that theory.

## What are the alternatives to microservices?

As previously stated, a microservice architecture might not always be the best solution. Some alternatives to consider:

* __Monolith:__ Sometimes, due to the management overhead or due to the lack of organizational maturity, it is better to use a monolithic service architecture. While more difficult than starting with a microservice architecture a monolith can later be refactored into microservices.
* __Shared libraries:__ Libraries allow code written once and shared with all teams that have written their software in the same language. They allow teams to share code not related to the business domain, but lead to a homogeneous technology ecosystem for library consumers.
* __Modules:__ If your language provides it, module systems allow you to separate functional concerns into isolated and independently deployable modules that live in the same monolithic application. However, in practice it appears the lack of a protocol boundary for inter-module communication creates higher levels of coupling.

## When should I choose a microservice architecture?

Microservices provide a way to encapsulate independent business value across an organization. As with all architectural decisions, however, there are tradeoffs to consider. A microservice architecture is the right choice if:

* You have small teams that need to independently deploy business services
* You have an organizational maturity sufficient for coordinated testing, deployment and releases
* You are willing to tradeoff the initial up-front efficiency of a monolith for the long-term gains of a distributed system