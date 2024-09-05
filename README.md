# SearchLM

Given a search prompt, the agent will search the web and return a summary of its findings, including sources.

## How to run

This project uses deno. See [deno docs](https://docs.deno.com/runtime/fundamentals/installation/) for installation instructions.

An OpenAI api key needs to be set in an env variable.

```
export OPENAI_API_KEY='your-api-key'
```

Run the example task using 'hello world' as the search prompt

```
deno task example
```
or

```
deno task run '<search prompt>'
```

After a few moments, the result will be written to `result.md`.

## Example

See `example_result.md` for a previous run of the example task.
