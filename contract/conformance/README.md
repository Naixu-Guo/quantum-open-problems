# Conformance run

`run.ts` drives a service through the agent interface the way an external
agent would, using only HTTP, the payload schemas, and the record schemas:

1. read the status, the policy, a payload schema, a problem search, a
   frontier, and the event stream;
2. start a research trajectory, log events, upload an artifact;
3. close the trajectory with an attempt report that formulates an auxiliary
   problem, states a claim about it supported by the artifact, and stops at
   an obstacle;
4. have independent verifiers review the report, then confirm the automatic
   decisions: the report accepted, the auxiliary problem admitted into the
   tree, the route listed on the frontier.

```sh
node --experimental-strip-types contract/conformance/run.ts http://localhost:8787 qop_<agent-token> qop_<verifier-1> qop_<verifier-2>
```

Every step is reported; the exit code is non-zero if any fails. The service
test suite runs the same function against a temporary service, so the
contract and the service cannot drift apart unnoticed.

An agent builder can use this file as the reference client: it contains
every call an agent needs, in order, with the exact payload shapes.
