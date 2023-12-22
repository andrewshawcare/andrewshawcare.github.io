# DORA top four metrics

![Change rate](/assets/4.png)
<!-- .element: class="r-stretch" -->

### Narrative

Hello again!

In my previous talk about continuous delivery, I mentioned the DORA top four metrics without going into detail. Today, let's delve into these metrics.

DORA, which stands for DevOps Research and Assessment, suggests four empirically validated metrics to assess the software delivery performance of your team or organization.

---

# Change rate

> For the primary application or service you work on, how often does your organization deploy code to production or release it to end users?

![Change rate](/assets/change-rate.webp)
<!-- .element: class="r-stretch" -->

### Narrative

The first of these metrics is the change rate.

This refers to the frequency with which software is released.

A release may encompass one or more changes.

The higher the change rate, the more frequently new features, improvements, or fixes are reaching your users.

---

# Change time

> For the primary application or service you work on, what is your lead time for changes (i.e., how long does it take to go from code committed to code successfully running in production)?

![Change time](/assets/change-time.webp)
<!-- .element: class="r-stretch" -->

### Narrative

The second metric is the change time.

This measures the time it takes for a piece of code to move from an initial commit to a full deployment in the production environment.

It essentially tracks the speed of your delivery pipeline.

---

# Change failure rate

> For the primary application or service you work on, what percentage of changes to production or released to users result in degraded service (e.g. lead to service impairment or service outage) and subsequently require remediation (e.g., require a hotfix, rollback, fix forward, patch)?

![Change failure rate](/assets/change-failure-rate.webp)
<!-- .element: class="r-stretch" -->

### Narrative

Next, we have the change failure rate.

This metric quantifies the number of instances when a release necessitates a remediation effort due to a service degradation.

It's useful to note that service degradation is subjective and can be caused by availability, functionality, or other system concerns that you or your users deem worthy of remediation.

---

# System failure rate

> For the primary application or service you work on, how often do your users experience degraded service (e.g. service impairment or service outage) and subsequently require remediation (e.g., require a hotfix, patch)?

![System failure rate](/assets/system-failure-rate.webp)
<!-- .element: class="r-stretch" -->

### Narrative

I've added an additional metric that isn't directly covered in the DORA metrics: system failure rate.

This helps define recovery time, which we will discuss next.

System failure rate complements change failure rate by accounting for service degradation due to external systems.

Having both of these failure metrics allows us to account for planned and unplanned service degredation.

---

# Recovery time

> For the primary application or service you work on, how long does it generally take to restore service when a service incident or defect that impacts users occurs (e.g. unplanned outage or service impairment)?

![Recovery time](/assets/recovery-time.webp)
<!-- .element: class="r-stretch" -->

### Narrative

The final metric is recovery time, which measures the average time required to restore service to an acceptable level when service degradation occurs.

This includes degredation experienced by either change failure or system failure events.

---

![Thank you!](/assets/thank-you.png)
<!-- .element: class="r-stretch" -->
*[Lineal Color icons created by Freepik](https://www.flaticon.com/authors/kawaii/lineal-color)*

### Narrative

I hope this discussion helps you understand the DORA top four metrics.

If you work in a software organization, I encourage you to participate in the [2023 Accelerate State of DevOps Survey](https://google.qualtrics.com/jfe/form/SV_3jHsoEmQR877LW6). Also, if you found the icons helpful in understanding the concepts, do check out [the link provided](https://www.flaticon.com/authors/kawaii/lineal-color).

Thank you!