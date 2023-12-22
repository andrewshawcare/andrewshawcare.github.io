![Schema-driven types](/assets/schema-driven-types.webp)
<!-- .element: style="max-width: 24rem; display: grid; margin: 0 auto;" -->

# Schema-driven types

### Narrative

Hello again,

Today, we'll be exploring the topic of schema-driven types and their significance in data validation.

As we explore this subject, we'll be using examples from a recent application I created to illustrate the challenges and solutions involved.

Let's get started!

---

## webhook-to-obs-text

![Screenshot of webhook-to-obs-text](/assets/webhook-to-obs-text.webp)

### Narrative

I encountered a challenge while streaming recently: It's hard to engage an audience if they can't connect with the on-screen activity, especially for coding streams where the context is harder to work out.

To help with this challenge, I created an application named `webhook-to-obs-text` which allows you to take a webhook or any event source and write information from the event to a file that can be used as a datasource for OBS text overlays.

Since I host my web site on GitHub, I figured I could use GitHub issues to keep track of what I'm currently working on there and display the assigned issue whenever what I'm working on changes.

As can be seen in the screenshot, when I assign an issue on GitHub the application listens for an, "issue assigned" event and updates the current task with the assigned issue title.

---

## Sequence diagram

![Sequence diagram](/assets/sequence-diagram.png)
<!-- .element: class="r-stretch" -->

### Narrative

Here's the sequence diagram for the application.

While there's many parts of an architecture to consider, our focus for this discussion will be on data validation. We want the data contained within messages to be valid and interpreted correctly by our application.

Before we can discuss how we will validate this data, let's define what we mean by data validation.

---

## Categories of data validation

![Structural and semantic](/assets/structural-and-semantic.webp)
<!-- .element: style="max-width: 48rem; display: grid; margin: 0 auto;" -->

### Narrative

There are two major categories of data validation: structural and semantic.

Structural validation focuses on the position and form of data while semantic validation evaluates the context and meaning of data when used for its intended purpose. 

We will leave semantic validation for another discussion and today we will focus on the two main subcategories of structural validation: position and form.

Position is concerned with where data is relative to a larger structure. A few types of positional validation are:

* Ordering: the relative position of an element within a collection, and
* Location: the position of an element within a hierarchy or space

Form is concerned with the correctness of the element itself, rather than with it's relative position. A few types of validation of form are:

* Existence: Whether the element or it's components exist and whether existence is mandatory, and
* Category: The association of an element to a given group through the adoption of common characteristics or behaviours

Now that we understand more about what aspects of our data we will be validating, let's compare some ways we could model this validation.

---

## Evaluating structural data validation models

| Model  | Serializable | Design-time validation | Domain-specific |
| - | - | - | - |
| Types | No <!-- .element: class="bad" --> | Yes <!-- .element: class="good" --> | Yes <!-- .element: class="good" --> |
| Decorators | No <!-- .element: class="bad" --> | Limited <!-- .element: class="limited" --> | No <!-- .element: class="bad" --> |
| Schemas | Yes <!-- .element: class="good" --> | No <!-- .element: class="bad" --> | Yes <!-- .element: class="good" --> |
| Tests | Limited <!-- .element: class="limited" --> | Limited <!-- .element: class="limited" --> | No <!-- .element: class="bad" --> |

### Narrative

For the table shown, let's define the criteria we are using for evaluation:

* Serializable means the validation definition is designed in a language that can be deserialized for use across different programming languages.
* Design-time validation means tooling or language support exists that can evaluate data validation rules during application development, and
* Domain-specific indicates that the model is exclusively focused on the structural validity of data.

Now, let's discuss each model in relation to these criteria.

* Types are written in an application language and often have mature tooling and language support. They validate the form of application code by defining data types that specify their existence and expected shape. 

* Decorators can be expressed as functions or [annotations](https://github.com/tc39/proposal-decorators). Since they are implemented as functions, the subject of validation can be programmatically accessed at design time to provide limited validation support. Decorators are not solely focused on data validation.

* Schemas are typically defined in a serializable data format like XML or JSON. They need to be serialized by a language and so they have limited tooling support during development. Like types, schemas are designed to validate the structure of data.

* Although tests are written and executed within a programming language, their expectations can be defined using schemas, providing greater interoperability. Tests, like decorators, are defined as functions and can also utilize introspective capabilities of the programming language they are authored within. Tests are not directly focused on data validation.

Of the models evaluated, types and schemas are unique in their focus as tools for data validation. We might wonder if we can achieve the interoperability benefits of schemas while also retaining the design-time benefits of types, without having to maintain both.

---

## Schema-driven types

![Schema-driven type tools](/assets/schema-driven-type-tools.webp)

### Narrative


Luckily, TypeScript has tools that can generate types from schemas. We will use `json-schema-to-ts` to generate types from JSON schemas and a utility function I developed named, 'constructSchemaValidatedValue` to express dynamic data as strongly-typed values.

As a historical note, schema-to-type tools like `json-schema-to-ts` bear resemblance to others historically used in languages like Java and C# to generate client implementations from XML. In those languages, XML-based protocols such as SOAP (which stands for Simple Object Access Protocol) along with schema languages such as WSDL (which stands for Web Services Description Language) provided a similar mechanism to compile clients and their corresponding types.

Historical reference complete, let's take a look at how we can use these tools in TypeScript to offer a better development experience.

---

## json-schema-to-ts

```typescript [1-22|1|3-20|19|4|20|22]
import { FromSchema, JSONSchema } from "json-schema-to-ts";

const issuesEventSchema = {
    type: "object",
    required: ["action", "issue"],
    properties: {
        action: {
            type: "string",
            enum: ["assigned"]
        },
        issue: {
            type: "object",
            required: ["title"],
            properties: {
                title: { type: "string" }
            }
        }
    }
} as const satisfies JSONSchema;
type IssuesEvent = FromSchema<typeof issuesEventSchema>;

export { IssuesEvent, issuesEventSchema }
```

### Narrative

1. Let's take a look at the issues event schema and generated type as an example of use for `json-schema-to-ts`.
2. First we import `FromSchema` which will use to generate a type from our JSON schema. We also import the `JSONSchema` type that we can use with the TypeScript `satisfies` operator to validate that our schema conforms to the JSON schema specification, saving us from typos and giving us code completion as we write.
3. Next we define our schema in an object literal.
4. Aside from using the `satisfies` operator described earlier, we are also using the `const` assertion on our schema. `json-schema-to-ts` needs `const` assertions to ensure no type widening occurs. For example, statements like type: "object" need to be interpreted literally and not that the type property could contain any value from the string type, which is what type widening would normally do without the use of `const` assertions.
5. After we define our schema, all we need to do is use the `FromSchema` type generator with the `issuesEventSchema` type parameter and we get our `IssuesEvent` type for free!
6. Finally, we export the type and it's associated schema so that we can use them in our application.

Let's take a look at some examples of how we can use these type and schema pairings in our application to benefit from design-time and runtime validations.

---

## Strongly-typed requests and automated HTTP validation responses with Fastify

```typescript [1-20|1|2-4|5|8|19|11]
fastify.post<{ Body: IssuesEvent, Headers: WebhookHeaders }>("/", {
    schema: {
        body: issuesEventSchema, headers: webhookHeadersSchema
    }
}, async (request, reply) => {
    if (
        ! isExpectedSignature({
            actualSignature: request.headers["x-hub-signature-256"],
            algorithm: configuration.algorithm,
            key: configuration.key,
            data: JSON.stringify(request.body)
        })
    ) {
        reply.status(StatusCodes.UNAUTHORIZED);
        throw new Error(ReasonPhrases.UNAUTHORIZED);
    }
    
    const issuesEvent = request.body;
    writeFile(configuration.file, issuesEvent.issue.title);
})
```

### Narrative

1. Let's see how we can use types and schemas for web requests.
2. Fastify, a JavaScript and TypeScript web framework, can use generics to type the request body and headers properties in our handler. We'll see how this is applied in a moment.
3. We can also validate the request at runtime with body and headers schemas. Fastify uses these schemas to provide performance improvements as well as automated HTTP validation responses for non-conformant requests.
4. As mentioned previously, the handler request will now be typed appropriately and we can use autocompletion to navigate our data and to protect us from typos.
5. The signature header field is defined in the `WebhookHeaders` type, so even though it is a string property access the string literal was autocompleted for us at design time.
6. When writing to our file, we use the title property of a nested issue object defined in the `IssuesEvent` type here. We can feel confident in our traversal through this nested structure as we have fully validated the presence of each field before this code executes.
7. Notably, the `IssuesEvent` type and associated schema were defined to be open for extenstion, which means we have access the full request body for HMAC signature validation even though we only typed a subset of the available data. This is a good example of the robustness principle in practice, where adding signature verification would be difficult and error-prone to maintain if were not more tolerant. When our schema is permissive to changes that do not affect our use, we benefit from less maintenance and fewer errors.

---

## Strongly-typed configuration from environment variables

```typescript [1-13|1|2-11|3|6|8|12|3]
const configuration = constructSchemaValidatedValue<Configuration>(
    {
        personalAccessToken: process.env["PERSONAL_ACCESS_TOKEN"],
        owner: process.env["OWNER"],
        repo: process.env["REPO"],
        hookId: parseInt(process.env["HOOK_ID"] || "", 10),
        algorithm: process.env["ALGORITHM"],
        key: crypto.generateKeySync("hmac", { length: 512 }).export().toString("hex"),
        port: parseInt(process.env["PORT"] || "", 10),
        file: process.env["FILE"]
    },
    configurationSchema
);
```

### Narrative

1. Now let's take a look at how we can use the `constructSchemaValidatedValue` function to validate configuration from environment variables.
2. This function uses a TypeScript feature called narrowing to ensure the return value conforms to the provided type. Internally it uses AJV, a JSON schema validator that supplies a type guard after schema validation. If you'd like to learn more about how AJV works with TypeScript, there's references in the link below.
3. The following object literal is evaluated using the provided type, meaning we guarantee at design time that required values provided for each key exist, and that they are correctly typed. The values expressed can be undefined at this point, even if we expect them to exist at runtime. This makes the design experience more affordant so that we can declare values from unreliable sources while retaining existence guarantees with runtime validation. More on this in a moment.
4. The object literal input also helps us explicitly define key transformation. For example, we can map the all-caps snake-cased environment variables to their corresponding camel-cased configuration keys here.
5. We also get design-time type errors to inform us that environment variables, which are strings, must be converted into types appropriate for the properties of our configuration
6. Additionally, we may use fully dynamic values such as our runtime-generated HMAC key, as long as the property types and the expression return types match.
7. Finally, we provide the configuration schema to ensure AJV validates the provided data at runtime and throws an exception with meaningful error messages if the data is not valid.
8. For example, if the `PERSONAL_ACCESS_TOKEN` value was not provided in the specified environment variable, this function would throw a runtime error and provide a message indicating that the personal access token was a required property of our configuration.

#### References

1. [Ajv JSON schema validator: Using with TypeScript](https://ajv.js.org/guide/typescript.html)

---

![Thank you!](/assets/thank-you.png)
<!-- .element: class="r-stretch" -->
*[Lineal Color icons created by Freepik](https://www.flaticon.com/authors/kawaii/lineal-color)*

### Narrative

I hope this discussion was useful in determining how and when to validate data in your application as well as the potential benefits of using schema-driven types to retain the best characteristics of both language-agnostic schemas as well as design-time guarantees and tooling benefits that types can provide.

If you have any questions or thoughts please add your comments and if you find the icons useful to illustrate concepts please support their authors by checking out the link below.

Thanks for your time!