---
title: Given a narrator
---

**Student:** I'm writing a test scenario. It begins: "Given I am not signed in." But how would I even know I'm not signed in before I've looked at the app?
**Teacher:** Who is the "I" in that sentence?
**Student:** The user. The person using the app.
**Teacher:** And when does the user first see the app?
**Student:** When they open it. That's the next step: "When I open the app."
**Teacher:** So to know whether you're signed in, you'd need to see the app. But you haven't opened it yet.
**Student:** Right. And if I open it to check, I've done the `When` before the `Given`. The order breaks down.
**Teacher:** Let's step away from apps for a moment. Consider a story. Before the hero enters, what happens?
**Student:** The narrator sets the scene. "The kingdom was at peace. The throne sat empty."
**Teacher:** Does the hero know the throne is empty?
**Student:** Not necessarily. Not until they walk into the room.
**Teacher:** Yet the audience knows. The narrator told them. The world was arranged before the hero arrived — perhaps by forces the hero never sees and may never learn about.
**Student:** So the `Given` is the narrator's voice. The world is in some state, and the user might not even be aware of it yet.
**Teacher:** Does that change how you read "Given I am not signed in"?
**Student:** It does, but it feels strange. "I" suggests the user is speaking — as if they have knowledge of the world and responsibility for it being that way. But we just said the narrator is the one who knows.
**Teacher:** What if the Given didn't say "I"?
**Student:** "Given *the user* is not signed in." That feels right. The narrator is describing the state of the world, not asking the user to account for it.
**Teacher:** Read the whole scenario that way.
**Student:** "Given the user is not signed in. When I open the app. Then I should see a sign-in prompt."
**Teacher:** Does something feel uneven?
**Student:** The voice shifts in the middle. The narrator says "the user" and then suddenly "I" appears. Who's speaking now? If the narrator is telling this story, why does the first person intrude?
**Teacher:** What if it didn't?
**Student:** "Given the user is not signed in. When the user opens the app. Then the user should see a sign-in prompt."
**Teacher:** What changed?
**Student:** It reads as one voice now. The narrator throughout — describing the world, describing the actions, describing the outcome. Like a story told entirely in third person.
**Teacher:** And what is the narrator free to do that the hero is not?
**Student:** The narrator can describe things the user can't see. "Given the user is not signed in" — the narrator knows this even though the user hasn't looked. And in the `Then`, the narrator can describe consequences beyond what the user checks. "Then the user's session should be destroyed" — the user didn't verify that. The narrator is closing the story.
**Teacher:** So a scenario is a story told by a narrator about a user.
**Student:** The narrator sets the scene. The narrator describes what the user does. The narrator describes what follows — sometimes what the user sees, sometimes what they don't.
**Teacher:** And the first person?
**Student:** It was a fiction. It made the `Given` feel like the user's responsibility when it wasn't. It made the `Then` feel like only the user's perception mattered when it needn't be. The third person frees the scenario to describe the whole story — the parts before the user arrives, the parts the user lives through, and the parts that unfold beyond their view.
**Teacher:** `Given`. `When`. `Then`.

**Student:** One narrator. One story. Three acts
