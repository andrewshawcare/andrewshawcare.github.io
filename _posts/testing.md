# Testing

Red, Green, Refactor!

### Narrative

Hello everyone!

Let's talk about testing!

It might seem a bit intimidating at first, as there's many types, techniques, and approaches to testing.

But once you get the hang of it, it becomes an invaluable tool for reducing errors, aiding design, and tracking progress.

---

## Why is testing useful?

* Feedback loop to reduce errors
* Design aid for interfaces
* A progress indicator

### Narrative

Testing is not just about checking your code, but also about crafting an effective interface from the outside-in. 

A test that is yet to pass guides your attention to a specific, value-adding goal.

---

## Schools of testing

![Schools of testing illustrated example](/assets/schools.png)

### Narrative

Two popular schools of thought guide our approach to testing - Classicist and Mockist.

Both schools define the smallest subject under test as a unit.

Classicists prefer the unit of behaviour. Tests live at the system boundary as we can see in the example on the left. Mickey is a classicist who is testing that the piano can play a tune.

Mockists prefer the unit of system functionality. Tests live within the system itself and each component is tested in isolation. The cross section of a piano on the right would be a great way for a mockist to determine what components of the piano are tested and operational.

Composition of systems makes this distinction a bit blurry but it's a good rule of thumb. Both schools are useful ways to think about writing tests.

---

## Test categories

* Unit
* Functional
* Contract
* Integration
* Performance
* Security
* End-to-end
* Acceptance
* Smoke
* Exploratory
* Manual
* Regression
* Usability
* Compatibiltiy

### Narrative

Now, when we look at test categories, there's quite a list.

Remember, each test is an experiment. Each category is just a way to organize them.

When categorizing your tests, make sure to do so with your goal being greater efficiency or clearer understanding.

---

## Where to start?

Decide on a capability you want to have and write a test to confirm it does not exist.

### Narrative

Starting with testing might seem daunting, but the key is simplicity.

Choose a desired capability, write a test to ensure it's not present yet, and use simple tools.

Over time, and as you gain more experience with your testing preferences, you can make intentional decisions to add more complicated tooling or organization.

---

## The testing loop

Red -> Green -> Refactor

### Narrative

Let's look at the testing loop, a process that makes testing manageable - Red, Green, Refactor.

---
<!-- .slide: data-transition="slide-in fade-out" -->

## Red

```js
function testSortingArray() {
    const sortedArray = sortArray([2, 1, 3]);

    expect(sortedArray).toBe([1, 2, 3]);
}
```

### Narrative

Red: Start by defining your new capability's interface and write a failing test to confirm your expected outcome.

Here we want to be able to sort an array.

---
<!-- .slide: data-transition="fade" -->

## Green

```js [7-9]
function testSortingArray() {
    const sortedArray = sortArray([2, 1, 3]);

    expect(sortedArray).toBe([1, 2, 3]);
}

function sortArray(array) {
    return [array[1], array[0], array[3]];
}
```

### Narrative

Green: The next step is to get the test to pass. It's not about writing the best code, but getting the result. 

Even a bit of cheating is okay! We will weed out the 'impostor code' in later tests.

Here we write a very brittle solution, but it works! That's good enough for this stage.

---
<!-- .slide: data-transition="fade" -->

## Refactor

```js [6-7]
function testSortingArray() {
    const sortedArray = sortArray([2, 1, 3]);
    expect(sortedArray).toBe([1, 2, 3]);
}

function sortArray([two, one, three]) {
    return [one, two, three]
}
```

### Narrative

Refactor: This is the stage where you fine-tune your code to make it more readable, efficient, or improve it in any way you want.

Remember, don't add new functionality at this stage; that should be saved for the next test.

Here we gold-plated our brittle solution with destructuring, but the good news is we can't go too far with our refactoring since the current tests limit the scope of our changes.

---
<!-- .slide: data-transition="fade-in slide-out" -->

## Back to red!

```js [6-10]
function testSortingArray() {
    const sortedArray = sortArray([2, 1, 3]);
    expect(sortedArray).toBe([1, 2, 3]);
}

function testSortingEmptyArray() {
    const sortedArray = sortArray([]);

    expect(unsortedArray).toBe([]);
}

function sortArray(array) {
    return [one, two, three]
}
```

### Narrative

Once you're comfortable with this loop, you can write new tests and gradually expose any impostor code written previously.

Make sure to use testing triangulation and other strategies to root out brittle code.

Here we break our code immediately by testing for an array with no elements. Failing tests like this help surface edge cases that we need to fix.

---

## Summary


### Narrative

In conclusion, although testing might seem overwhelming initially, it's an excellent tool for maintaining focus and safely refactoring large systems.

I recommend the book, "Test-driven development" by Kent Beck for a deeper dive into this topic.

Thank you!