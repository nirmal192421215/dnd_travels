# Layer 1: Directives

Directives are Standard Operating Procedures (SOPs) written in natural language markdown. They act as the instruction manual for the Orchestrator (the AI Agent) to solve specific tasks.

## Directive Structure

Every directive should follow this standard structure:

1. **Title / Goal**: What is the purpose of this directive?
2. **Inputs**: The exact parameters required to run this directive.
3. **Execution Scripts**: The Python execution scripts (from the `execution/` folder) that must be run to complete steps.
4. **Step-by-step Execution Procedure**: The order of operations.
5. **Expected Outputs**: The format, fields, and file locations for the results.
6. **Edge Cases & Failure Handling**: Clear rules on what the Orchestrator should do if a script fails (e.g. retries, fallback options).

## Example Template

```markdown
# [Directive Name]

## Inputs
- `PARAM_1`: Description of parameter 1
- `PARAM_2`: Description of parameter 2

## Steps
1. Call `execution/script_name.py` with `PARAM_1`.
2. Inspect the output. If successful, continue to next step.
3. Call `execution/second_script.py` with `PARAM_2` and the results of step 1.

## Outputs
- Path to results file (`output/results.json`)
- JSON formatted summary of execution.

## Error Handling
- If Step 1 fails: retry up to 2 times, then fallback to `execution/alternative.py`.
- If Step 2 fails: abort and report the error to the user.
```
