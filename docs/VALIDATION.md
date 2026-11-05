# Validation record

Verified locally November 5, 2026. Public deployment and final presentation remain pending.

- Application implementation: commit 88ab005, independently run `npm test`: 19 passing tests, no failures. Spec and quality review findings fixed, including contrast, retry schema, draft exports and split UTF-8 decoding.
- Browser: real inference completed claim extraction, selected-claim questioning, feedback and same-question retry with before/after comparison. Refresh retained history; next-question generation worked; prompt-template panel worked. At phone width, document scrollWidth equalled clientWidth (375px), with readable stacked content.
- Export: pure-function tests confirm completed attempts and unsent drafts are retained. Browser download automation timed out, so filesystem delivery has not been independently confirmed; do not claim that download verification passed.
- Local models: 18 engineered cases and 18 baseline cases across three development passes saved in `evaluation/`. Schema acceptance varies and does not prove semantic quality; see EVALUATION_RESULTS.md. Local configuration is not a verified production model choice.
- Public app: https://defend-it.onrender.com deployed on Render Free, service srv-dbmh1t3bc2fs738c7j70, initial deployed commit fdc0029c033fa6ec3e61a633f62aacfbf22992d1. Anonymous page loaded and `/api/status` returned HTTP 200 with configured=false/model=null. Hosted model credentials are still required; public inference has NOT passed.
- GitHub: https://github.com/Prabscodes/defend-it published on main. Anonymous raw package.json readback succeeded. Initial empty-repository Git pushes failed; API initialization followed by a merge and Git push succeeded.
- Narration: script prepared; owner's new voice-over not recorded.
- Video publication/form submission/live presentation: not completed for this project.

Do not interpret prepared materials as a completed submission or guaranteed grade.
