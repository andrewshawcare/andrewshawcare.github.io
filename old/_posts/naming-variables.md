# Naming variables

What to avoid, what to consider

### Narrative

This will only display in the notes window.

This is another thing.

---

## What to avoid

[CanvasRenderingContext2D: transform() method](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform)

```js
// Definition
transform(a, b, c, d, e, f)

// Usage
context.transform(1, 0.2, 0.8, 1, 0, 0);
```

---

## What's wrong?

* Working memory over keystrokes
* What are these parameters?
* What order are they in?

---

## How could it be better?

---

## Clear names

```js
// Definition
transform(
    horizontalScaling,
    verticalSkewing,
    horizontalSkewing,
    verticalScaling,
    horizontalTranslation,
    verticalTranslation
)

// Usage
context.transform(1, 0.2, 0.8, 1, 0, 0);
```

---

## Object arguments

```javascript
// Definition
transform({
    horizontalScaling,
    verticalSkewing,
    horizontalSkewing,
    verticalScaling,
    horizontalTranslation,
    verticalTranslation
})

// Usage
context.transform({
    horizontalSkewing = 0.8,
    verticalSkewing = 0.2,
    horizontalScaling = 1,
    verticalScaling = 1,
    horizontalTranslation = 0,
    verticalTranslation = 0
});
```

---

## Default values

```javascript
// Definition
transform({
    horizontalScaling = 1,
    verticalSkewing = 1,
    horizontalSkewing = 1,
    verticalScaling = 1,
    horizontalTranslation = 0,
    verticalTranslation = 0
})

// Usage
context.transform({
    horizontalSkewing = 0.8,
    verticalSkewing = 0.2
});
```

---

## Define the noun

```javascript
// Definition
transform({
    horizontalScalingMultiplier = 1,
    verticalSkewingMultiplier = 1,
    horizontalSkewingMultiplier = 1,
    verticalScalingMultiplier = 1,
    horizontalTranslationDistance = 0,
    verticalTranslationDistance = 0
})

// Usage
context.transform({
    horizontalSkewingMultiplier = 0.8,
    verticalSkewingMultiplier = 0.2
});
```

---

## Single responsibility

```javascript
// Definition
scale({
    horizontalMultiplier = 1,
    verticalMultiplier = 1
})

skew({
    horizontalMultiplier = 1,
    verticalMultiplier = 1
})

translate({
    horizontalDistance = 0,
    verticalDistance = 0
})

// Usage
context.skew({
    horizontalMultiplier = 0.8,
    verticalMultiplier = 0.2
})
```
---

# Thanks!