---
title: The Evolutionary Architect
date: 1970-01-01 00:00:02
---
## What is an evolutionary architect?

An evolutionary architect is a role that is primarily concerned with how software can be designed such that it can change easily. In additon, an evolutionary architect must concern themselves with the nature of change, and how it might be applied to a system in an effective way.

## What is zoning?

Zoning, in the context of building services, is the practice of splitting an organizational effort into different services. It is the role of the service team to consider the architecture of the service. It is the role of the evolutionary architect to consider the consequences of communication across services as well as to ensure the service zones are being upheld.

## How does an evolutionary architect influence a team?

Primarily, the evolutionary architect influences a team by being present and, ideally, coding the solution with the team or teams they influence. This ensures that the architect can understand the impact of architectural decisions and gain feedback from the teams to inform future decisions.

An evolutionary architect should guide teams by establishing a set of principles and practices to be considered when teams develop services. Principles are the ideas that, when applied with practices, should align the service teams efforts with the strategic goals of the company.

As an example, an evolutionary architect might need to assist in the strategic goal of fostering innovation in existing markets. This means, as a principle, software teams should be able to adapt their software efficiently. As a practice to support this principle, an architect might ensure that each service team has encapsulated their legacy dependencies to ensure that future work will not be held up by legacy tech debt.

## What are the minimum architectural requirements an evolutionary architect should focus on?

There is an established minimum set of concerns the an evolutionary architect should ensure has been adopted by each service team:

* __Monitoring:__ The mechanism and means of collecting metrics and health health checks for services should be consistent so that a system-level view of either category can be created easily and automatically.
* __Interfaces:__ Having services communicating over a variety of different protocols reduces the likelihood that any new service will be able to choose one protocol to communicate with it's dependencies. This increases the likelihood that new services will have to spend time developing integration adapters for each supported protocol. This also introduces the potential for existing services to change protocols, and means all downstream dependencies must adapt or find a new way to satisfy their needs.
* __Architectural safety:__ Once a protocol (or two) is agreed upon, it is useful to ensure that each team understand the potential architectural concerns with a distributed system and common patterns (e.g. circuit breakers) to mitigate failure.

## How can an evolutionary architect use code to govern?

An evolutionary architect has two main avenues by which code can be used to govern technical direction:

* __Exemplar applications:__ There is a lot to be said for curated code that exemplifies key architectural practices in a clear way. There is even more to say about code that's hit production and still serves as exemplar to these practices.
* __Service templates:__ When an principle or practice needs to be illustrated, it is useful to provide a code template around the individual principle or practice. It might also be useful to incorporate many practices into a kind of starter template, but be wary of templates that try to influence so much that they end up influencing nothing at all. Templates are useful when it is clear what problem they solve.