# Continuous delivery

<div class="r-stack">
    <div class="fragment current-visible">
        <img alt="DevOps performers over time" src="/assets/devops-performers.png" style="height: 12rem" />
        <figcaption>
            <a href="https://services.google.com/fh/files/misc/2022_state_of_devops_report.pdf">The 2022 State of DevOps</a>
        </figcaption>
    </div>
    <div class="fragment">
        <img alt="Continuous delivery levers" src="/assets/continuous-delivery.png" style="height: 12rem" />
        <figcaption>
            <a href="https://cloud.google.com/blog/products/devops-sre/the-2019-accelerate-state-of-devops-elite-performance-productivity-and-scaling">The 2019 State of DevOps</a>
        </figcaption>
    </div>
</div>

### Narrative

Hello again!

Today, let's dive into the realm of Continuous Delivery, an integral part of software delivery and operations.

If we take a look at this diagram from the 2022 State of DevOps report, it paints a rather alarming picture. Based on the DORA top 4 metrics, we see a downward trend in the performance of software teams or organizations over time.

Another diagram from the 2019 State of DevOps report illustrates the key constructs and levers for performance. Notice how Continuous Delivery sits at the heart of it.

While there's no clear link between decline in performance and a lack of focus on continuous delivery, it's worth revisiting the important role it plays in delivering software.

---

## Feedback loop

![Deployment feedback loops](/assets/deployment-feedback-loops.png)
<!-- .element: class="r-stretch" -->

### Narrative

Continuous Delivery is about maintaining a frequent feedback loop. Ideally, this loop should mirror atomic units of software change and strive for increasingly rapid iterations.

Some examples of these atomic units are depicted in the diagram, with larger areas indicating extended time between delivery cycles.

---

## Continuous delivery pipeline

![Build, test, push, deploy](/assets/build-test-push-deploy.png)
<!-- .element: class="r-stretch" -->

### Narrative

What does continuous delivery entail?

At its core, it's a repeatable and reliable pipeline from code change to deployment.

The key stages are: Build, test, push, and deploy.

It is advisable to start your pipeline locally, where the software changes take place. This allows the individual or team using the pipeline to understand and control the feedback loop of continuous delivery, thereby facilitating effective software delivery.

---

## Build

```bash
#!/usr/bin/env bash
npm run build
cdk synth
```

### Narrative

The 'Build' stage involves compiling your software and supporting infrastructure into distributable assets. What this looks like will depend on your language and toolchain, but the end goal is to produce deployable software and infrastructure artifacts.

---

## Test

```bash
#!/usr/bin/env bash
npm run test-application
npm run test-infrastructure
```

### Narrative

Next, in the 'test' stage, the built assets or full deployment are validated against your expectations. This stage could involve a manual gate or a series of automated testing suites, but it should be comprehensive enough to cover all relevant aspects of your system.

---

## Push

```bash
#!/usr/bin/env bash
docker push application:0.0.1
aws s3 cp cdk.out s3://cdk/application/0.0.1/ --recursive
```

### Narrative

The 'Push' stage is where you move your compiled infrastructure and software assets to artifact registries.

This is important for auditability and rollback readiness, especially during deployment mishaps.

Ensuring artifacts are immutable and available from reliable and efficient registries can significantly reduce stress during the deployment stage.

---

## Deploy

```bash
#!/usr/bin/env bash
cdk deploy
```

### Narrative

The final 'deploy' stage is where the code goes into production or other testing environments.

It's crucial to ensure a consistent deployment process across all environments.

A great resource for learning how to do this would be the 12-factor-app methodology, linked here.

---

## Summary

![Build, test, push, deploy](/assets/build-test-push-deploy.png)
<!-- .element: class="r-stretch" -->

### Narrative

In conclusion, teams and organizations could benefit now more than ever from improvements to software delivery and operations performance. Continuous delivery can play a vital role in making progress to that end.

Thanks!