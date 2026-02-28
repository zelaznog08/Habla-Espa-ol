## 2024-05-22 - [Optimizing Chat Responsiveness and Component Rendering]
**Learning:** In React applications that handle user-generated content (like chat messages with Markdown), typing performance can be significantly impacted if the entire message history is re-rendered on every keystroke. This is especially true when expensive parsing libraries (like `marked`) are used within the render loop.
**Action:** Always isolate high-frequency state (like text input) into separate components and memoize list items that perform expensive computations during rendering.
