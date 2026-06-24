# Directive: Search Flights

Find available flights matching origin, destination, and dates, then output the cheapest and fastest options.

## Inputs
- `ORIGIN`: 3-letter IATA airport code (e.g. NYC, MAA)
- `DESTINATION`: 3-letter IATA airport code (e.g. LON, BLR)
- `DEPARTURE_DATE`: Date in YYYY-MM-DD format (e.g. 2026-06-15)
- `RETURN_DATE` (Optional): Date in YYYY-MM-DD format (e.g. 2026-06-22)

## Steps
1. Prepare the execution arguments.
2. Run the deterministic script: `python3 execution/search_flights.py --origin ORIGIN --destination DESTINATION --departure-date DEPARTURE_DATE [--return-date RETURN_DATE]`.
3. Check the exit status of the script.
4. If the script succeeds:
   - Read the generated file `output/flights.json`.
   - Parse and list the top 3 cheapest flights and top 3 fastest flights.
   - Present this summary to the user.
5. If the script fails:
   - Read the error message printed to stderr.
   - Self-correct if the failure is due to missing dependencies, arguments, or minor bugs.
   - If it's a connectivity/API error, report it to the user.

## Expected Outputs
- `output/flights.json`: Structured list of all found flights.
- Natural language markdown table summarizing flight choices.

## Edge Cases
- **No flights found**: Output a clean message stating no routes match.
- **Invalid IATA code**: The script should raise an error, and the Orchestrator should clarify inputs with the user.
