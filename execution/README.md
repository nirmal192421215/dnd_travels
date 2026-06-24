# Layer 3: Execution Scripts

Execution scripts are deterministic Python scripts that carry out the actual work requested by directives. 

## Script Design Guidelines

1. **Deterministic Logic**: Ensure code is reliable, testable, fast, and free of probabilistic behavior.
2. **Environment Variables**: Load API keys, configs, and environments via `.env` files or system environment variables. Use `python-dotenv` or similar to parse.
3. **CLI Arguments**: Use `argparse` to clearly expose script inputs. This makes it easy for the Orchestrator to run scripts.
4. **Structured Output**: Write results to standard structured formats (e.g. JSON, CSV) in the designated output folder (e.g. `output/`).
5. **Robust Error Handling**:
   - Exit with code `0` on success.
   - Exit with a non-zero code (e.g., `1`, `2`) on failure.
   - Write clear error descriptions to `stderr` so the Orchestrator can easily understand and fix issues.
6. **Self-Contained**: Avoid relying on complex global states. Ensure they can be run directly from terminal.

## Typical Structure

```python
import argparse
import sys
import os
from dotenv import load_dotenv

# Load local environment vars
load_dotenv()

def main():
    parser = argparse.ArgumentParser(description="Deterministic Execution Script Template")
    parser.add_argument("--param-1", required=True, help="Input param 1")
    args = parser.parse_args()
    
    try:
        # Business logic goes here
        api_key = os.getenv("API_KEY")
        if not api_key:
            raise ValueError("API_KEY environment variable is not set")
            
        print("Executing successfully...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```
