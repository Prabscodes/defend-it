# Defend It: 110-second guided narration

These are the spoken cues used by the public recording studio at https://defend-it.onrender.com/studio/. Read them as though you are showing a classmate the app. Pause at sentence breaks; there is no need to fill every second.

The studio is an edited replay of a preserved AI session using a fictional Campus Cup project, with that label visible throughout. It is not live inference. The narration describes the actual saved responses, including an imperfect follow-up. The classroom live demo is separate.

| Time | Scene | Narration |
|---|---|---|
| 0–12s | setup | I built Defend It to help you practise answering questions about your presentation. Let me show you how it works with a sample project. |
| 12–22s | claim | This one's about reusable cups on campus. It predicts an eighty percent drop in waste. I'll pick that claim and see what gets asked. |
| 22–35s | question | So, it's asking how we'd actually back up that number, given our budget and short pilot. That's a fair question to get during a presentation. |
| 35–44s | answer | My first answer is pretty weak: eighteen classmates said they'd try it. But that doesn't mean they'll actually return their cups. |
| 44–57s | feedback | Here's the feedback. It picks up on the survey, but points out that we only asked classmates. It suggests getting more evidence before making that claim. |
| 57–71s | revision | Let me try again. This time, I say eighty percent is a goal we haven't tested. I also explain how we'd track returns and account for staff time. |
| 71–83s | comparison | It says the answer is stronger now. But it also asks for measurements I've already mentioned. So you still need to check what it tells you. |
| 83–98s | patterns | I'm using three prompt techniques here. Persona sets the coach's role. Few-shot examples show what useful feedback looks like. Iterative refinement lets you try again and compare answers. |
| 98–110s | close | Finally, I can download the questions, my answers, and the feedback. That gives me something to practise with before the actual presentation. |

## Recording in sections

The studio defaults to section 1. Choose a section, click **Record my voice for this section**, allow the microphone, and wait for the countdown. The demo starts at that section and the voice clip stops automatically at its end. Listen below; redo only that section if needed. The newest complete take is selected automatically, and **Use this take** can restore an earlier attempt. Stopping early saves a partial clip without replacing the selected complete take.

After all nine sections are ready, click **Build final video**. This combines selected voice clips with the animated demo in real time (1:50), without using the microphone. Keep the tab visible; switching away pauses the build. Preview and download the combined WebM when it finishes. Clips and selected takes persist in this browser when storage is available. They do not sync between devices. Original continuous recordings remain available below, and the section dropdown still offers a whole-demo recording option.

## Live classroom demonstration

Open the public site before presenting to handle a possible host cold start. Use the sample as input, generate claims and a question live, answer, discuss the actual response, and retry. Show the actual prompt templates from `prompts.js` in the presentation and explain why each pattern exists. Keep a labelled recording as a contingency, explicitly disclose if live inference is unavailable. End with limitations: generated advice can be mistaken, quote matching does not prove useful interpretation, and the model cannot verify research that was not provided.

Future applications: oral exam practice, proposal reviews and mock project interviews; voice interaction and document import are future work unless implemented and verified.
