---
title: The Ubiquitous Language
date: 1970-01-01 00:00:02
---
## What is an ubiquitous language?

An ubiquitous language is an artifact of domain-driven design that produces common terms for a project's domain model. The terms in an ubiquitous language are the result of communication between domain experts and developers who agree on what to name important ideas that need to be expressed in the project's domain model.

## Why does a software project need an ubiquitous language?

An ubiquitous language helps domain experts and developers agree on meaning for terms used when communicating the domain model. By ensuring these parties agree on the mapping of ideas to specific terms there is greater likelihood that communication about the project will be interpreted accurately and corrections are made confidently when terms are misused.

In addition to agreement on terms used in the domain model, an ubiquitous language may include domain terms that are not expressed in the domain model. This allows domain experts feel confident that their entire domain was considered and that the project has explicitly considered only a subset of their domain. Defining project scope in this way will make communication between the two parties more efficient by leaving out concepts from the domain that are not relevant to the project.

## How might one create an ubiquitous language?

An ubiquitous language is created through communication between domain experts and developers about the domain. When communicating, ideas will emerge that are relevant to include in the domain model. Terms that convey those ideas and are meaningful to both parties are negotiated and included in the ubiquitous language.

As the ubiquitous language is a result of an ongoing process, it is subject to change. Terms in the ubiquitous language may need to be added, refined, or removed. Refinement is required when communication between domain experts and developers becomes difficult. This can occur when a domain expert does not understand the meaning of terms in the ubiquitous language or when a developer feels terms do not accurately model constructs developed in the resulting software.

It is important that a developer model the terms in the ubiquitous language in software so that the software can test the viability of terms agreed upon in communication. When following this method of design, if the software does not serve it's purpose it is likely the ubiquitous language does not serve it's purpose either. In this case, the ubiquitous language needs refinement driven by communication between domain experts and developers about refinement to the domain model.
