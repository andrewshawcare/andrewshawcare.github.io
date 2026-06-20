---
title: Making the implicit explicit
---

When you have something that is declared in one place but used somewhere else, there should be an easy way to check for usage of that thing at the point of declaration.

An example of this affordance is the, "Find usages" action available in most IDEs.

Sometimes this relationship is not forced to be expressed explicitly by the mechanism that declares and uses the thing.

An example of where this is difficult is if you define a list of roles in Bash and need to track their use in other tools like Terraform or CLIs that invoke these roles implcitly like `gcloud`.

In this case there are a few steps one can take to make the implicit explicit.

## Move the definition to a format parseable by declaration and invocation sites

In our case, taking our roles and placing them into a JSON file allows Bash scripts, gcloud commands, and Terraform inputs.

## It's helpful if invocation sites are explicit about required declarations

`gcloud` and Terraform will throw an error if a command is invoked that requires a role a service account does not have. In addition, it will declare the required roles that are missing. One problem is future commands will "just work" and will not declare the roles they required, leading to future invocation sites explicitly stating their role dependencies.

## Add a context anchor to the invocation site

For the locations that error, we can define a standard comment format to document the requirement. This can be "found" later by searching for the role name in the codebase or optionally additional details surfaced by the comment format.

## Validate each declaration has at least one context anchor at an invocation site

You can run a script to assert that each role listed in the JSON file has at least one comment in the codebase at an invocation site. This ensures there are no orphaned roles. A role without a context anchor can be safely removed. If an error surfaces in the future, that is the place to put the context anchor.