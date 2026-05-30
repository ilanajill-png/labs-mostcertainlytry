# Blackjack Play Workflow

Purpose: help a human play or practice blackjack by tracking the visible hand state, applying a conservative basic-strategy decision tree, and explaining the next move. This workflow is for practice, learning, and casual play. It must not place bets, move money, bypass casino rules, or act autonomously in a real-money game.

Build notes: `../projects/blackjack-play-workflow.html`

## Operating Boundary

- The human owns all bets, game actions, and final decisions.
- The agent may track cards, calculate hand totals, recommend a basic-strategy action, and explain why.
- The agent must not place bets, send money, join gambling sites, or operate a real-money account.
- If real money is involved, the agent should keep recommendations educational and remind the human that outcomes are probabilistic.
- The default recommendation style is conservative: basic strategy first, no chase-betting, no emotional escalation.

## Trigger

The workflow starts when the human says something like:

- "Help me play this blackjack hand."
- "Dealer shows 6, I have 10 and 6. What do I do?"
- "Track this blackjack shoe with me."
- "Run blackjack practice hands."

## Required Inputs

- Player cards.
- Dealer upcard.
- Available actions: hit, stand, double, split, surrender, insurance.
- Rule context if known: dealer hits or stands on soft 17, number of decks, double-after-split allowed, surrender allowed.
- Whether this is practice/casual play or a real-money setting.

## Optional Inputs

- Current bankroll or practice chip count.
- Bet size already chosen by the human.
- Running count, if the human is practicing card counting.
- Table minimum/maximum for planning practice scenarios.
- Whether the human wants short answers or full reasoning.

## Default Assumptions

Use these unless the human provides table-specific rules:

- Multi-deck shoe.
- Dealer stands on soft 17.
- Double after split allowed.
- No surrender unless explicitly available.
- No insurance recommendation except as a counted-card training concept.
- Recommendation uses basic strategy, not gut feel.

## Hand Classification

Classify the player hand in this order:

1. Pair: two cards of the same rank, including 10-value cards only when they are the same rank if the rules distinguish them.
2. Soft hand: includes an ace counted as 11 without busting.
3. Hard hand: no ace counted as 11.

Then calculate:

- Hard total.
- Soft total, if applicable.
- Whether doubling is allowed.
- Whether splitting is allowed.
- Whether surrender is allowed.

## Core Decision Rules

### Pairs

Use this simplified multi-deck basic strategy:

| Player Pair | Dealer 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | A |
|---|---|---|---|---|---|---|---|---|---|---|
| A,A | split | split | split | split | split | split | split | split | split | split |
| 10,10 | stand | stand | stand | stand | stand | stand | stand | stand | stand | stand |
| 9,9 | split | split | split | split | split | stand | split | split | stand | stand |
| 8,8 | split | split | split | split | split | split | split | split | split | split |
| 7,7 | split | split | split | split | split | split | hit | hit | hit | hit |
| 6,6 | split | split | split | split | split | hit | hit | hit | hit | hit |
| 5,5 | double | double | double | double | double | double | double | double | hit | hit |
| 4,4 | hit | hit | hit | split | split | hit | hit | hit | hit | hit |
| 3,3 | split | split | split | split | split | split | hit | hit | hit | hit |
| 2,2 | split | split | split | split | split | split | hit | hit | hit | hit |

### Soft Hands

| Player Hand | Dealer 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | A |
|---|---|---|---|---|---|---|---|---|---|---|
| A,9 | stand | stand | stand | stand | stand | stand | stand | stand | stand | stand |
| A,8 | stand | stand | stand | double | double | stand | stand | stand | stand | stand |
| A,7 | stand | double | double | double | double | stand | stand | hit | hit | hit |
| A,6 | hit | double | double | double | double | hit | hit | hit | hit | hit |
| A,5 | hit | hit | double | double | double | hit | hit | hit | hit | hit |
| A,4 | hit | hit | double | double | double | hit | hit | hit | hit | hit |
| A,3 | hit | hit | hit | double | double | hit | hit | hit | hit | hit |
| A,2 | hit | hit | hit | double | double | hit | hit | hit | hit | hit |

If doubling is not allowed, convert "double" to "hit" except for soft 19 where the fallback is stand.

### Hard Hands

| Player Total | Dealer 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | A |
|---|---|---|---|---|---|---|---|---|---|---|
| 17+ | stand | stand | stand | stand | stand | stand | stand | stand | stand | stand |
| 16 | stand | stand | stand | stand | stand | hit | hit | surrender/hit | surrender/hit | surrender/hit |
| 15 | stand | stand | stand | stand | stand | hit | hit | hit | surrender/hit | hit |
| 14 | stand | stand | stand | stand | stand | hit | hit | hit | hit | hit |
| 13 | stand | stand | stand | stand | stand | hit | hit | hit | hit | hit |
| 12 | hit | hit | stand | stand | stand | hit | hit | hit | hit | hit |
| 11 | double | double | double | double | double | double | double | double | double | hit |
| 10 | double | double | double | double | double | double | double | double | hit | hit |
| 9 | hit | double | double | double | double | hit | hit | hit | hit | hit |
| 8- | hit | hit | hit | hit | hit | hit | hit | hit | hit | hit |

If surrender is not available, use the fallback after the slash. If doubling is not allowed, convert "double" to "hit."

## Insurance

- Default recommendation: decline insurance.
- Exception: if this is card-counting practice and the true count is high enough under the selected count system, explain the counted-card reason but still leave the action to the human.

## Betting Guardrails

- Do not recommend chasing losses.
- Do not recommend increasing bet size because the human feels "due."
- For practice mode, a flat bet is the default.
- If real money is involved, suggest setting a fixed loss limit and stop point before play continues.

## Execution Flow

1. Confirm this is practice/casual play or real-money play.
2. Capture dealer upcard and player cards.
3. Capture available actions and any table rules.
4. Calculate player total and classify the hand as pair, soft, or hard.
5. Look up the basic-strategy action.
6. Apply fallback rules when double, split, or surrender is unavailable.
7. Return the recommended action, one-line reason, and what information is needed after the action.
8. If the human hits or splits, update the hand state and repeat.
9. At hand end, summarize result and reset for the next hand.

## Output Format

Return this structure:

```markdown
Hand: [player cards] = [total/classification]
Dealer shows: [upcard]

Recommended action: [hit / stand / double / split / surrender / decline insurance]

Why: [one concise reason based on basic strategy]

If unavailable: [fallback action, if relevant]

Next input needed: [new card / dealer hole-card result / split-hand card / next hand]
```

## Example

Input:

- Player has 10,6.
- Dealer shows 10.
- Surrender is not available.

Output:

```markdown
Hand: 10,6 = hard 16
Dealer shows: 10

Recommended action: hit

Why: Basic strategy surrenders hard 16 against dealer 10 when surrender is available; without surrender, the fallback is hit.

If unavailable: none

Next input needed: tell me the card you draw.
```

## Practice Mode

When the human asks for practice:

1. Generate one random dealer upcard and two random player cards.
2. Ask the human for their decision.
3. Compare the decision against the workflow recommendation.
4. Explain the answer briefly.
5. Track correct/incorrect decisions over the session.

Practice output:

```markdown
Practice hand 04
Dealer shows: 6
You have: 9,7 = hard 16

Your move?
```

After answer:

```markdown
Correct. Stand.

Why: Hard 16 stands against dealer 6 because the dealer is in a weak position and hitting risks busting a stiff hand.

Session score: 3/4
```
