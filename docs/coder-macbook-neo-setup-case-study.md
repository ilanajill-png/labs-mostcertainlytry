# Case Study Setting Up Coder on an Apple Silicon MacBook Neo

I wanted to see how quickly I could go from "I have a MacBook Neo" to "I have a working Coder environment with a real workspace." Not a polished production deployment. Not a theoretical read through of docs. A real, complete setup install Coder, create an admin, add a template, start a workspace, SSH into it, and build something from there.

The result Coder was up and bootstrapped in about 9 minutes, but the path had a few Mac specific snags worth documenting.

## The Goal

The test was simple

* Install Coder locally on a MacBook Neo.
* Bootstrap the first admin user.
* Create a starter template.
* Launch a workspace.
* Verify that the workspace was actually usable, not just visible in a dashboard.

This was intentionally a demo/quick start deployment. The goal was to evaluate setup friction and developer experience, not design a production architecture for a team.

## What Worked Well

The Coder setup flow was better than expected. The instructions covered the right operational phases

* Discover the local environment.
* Install the Coder CLI/server.
* Create the first user.
* Add a starter template.
* Create the first workspace.
* Verify that the workspace is healthy.

That last part matters. A lot of dev environment tools look installed long before they are actually useful. In this case, the meaningful finish line was not "the server started." It was seeing Coder report a started, healthy workspace and then landing inside that workspace over SSH.

The workspace reported as `Started` and `HEALTHY true`, and SSH landed inside the workspace as the `coder` user. That is the point where I would call the demo install real.

## The First Snag Embedded Postgres on Apple Silicon

The first real issue appeared almost immediately. Coder installed cleanly, but the built in Postgres binary failed on this Apple Silicon Mac with

```text
bad CPU type in executable
```

That is not the kind of failure a new user wants to debug during a quick start. The fix was straightforward once diagnosed install and run Homebrew Postgres, create a Coder database/user, and start Coder with `CODER_PG_CONNECTION_URL`.

The lesson on Apple Silicon Macs, the setup path should explicitly mention external Postgres as the fallback if embedded Postgres fails. It turns a confusing architecture error into a known branch in the install guide.

## The Second Snag No Local Docker Runtime

The next issue was compute. Coder could run, but the useful starter workspace needed a Docker compatible runtime. This Mac did not already have Docker, Colima, or Podman available from the shell.

For a free local setup, Colima was the practical answer. After installing Docker and Colima with Homebrew, I started a small local Colima VM and let Coder use it as the workspace backend.

Once Colima was running, the workspace could be created with the Docker starter template.

The lesson a Coder server without a working compute backend is only half a demo. If the goal is to show value quickly, the guide should treat "install a local container runtime" as part of the happy path on a fresh Mac.

## The Third Snag Docker Socket Confusion

The Docker starter template appeared to expose a socket variable, but the workspace build still tried the default Docker socket until the Colima socket was wired directly.

That is fixable, but it is exactly the kind of small infrastructure detail that can derail a demo.

The lesson when using Colima on macOS, verify which Docker socket the template actually uses during workspace creation. Do not assume the variable is flowing all the way into the provider.

## The Fourth Snag Keeping the Server Alive

Running `coder server` interactively worked. Trying to background it with `nohup` did not the process exited silently and left no useful log trail.

A detached `screen` session was more reliable. It gave the local demo server a simple place to keep running and made it easier to inspect logs or shut the server down later.

The lesson setup docs should include a simple process supervision fallback for local demos. For production, use a real service manager. For a time boxed local evaluation, `screen` is boring and effective.

## Final Running State

By the end of the setup, the local Coder environment had

* Coder server running locally.
* A browser URL exposed through Coder's tunnel.
* An admin user created.
* Credentials stored locally with restricted file permissions.
* A Docker demo template.
* A running demo workspace.
* Verified SSH access into the workspace.

The environment was good enough to build and test a small app from inside Coder, which is the whole point of the exercise.

## Time and Score

Total setup time about 8 minutes 55 seconds.

Instruction quality 8/10.

That is a strong score. The core instructions were clear, operational, and verification oriented. The missing points were not about the basic flow. They were about platform specific sharp edges

* Apple Silicon embedded Postgres failure.
* Fresh Mac with no Docker runtime.
* Colima socket configuration.
* `nohup` not keeping the server alive.

## What I Would Add to the Setup Guide

If I were editing the quick start experience, I would add four things

1. A macOS Apple Silicon note for the embedded Postgres failure, with a direct Homebrew Postgres fallback.
2. A free local Docker path using Colima, including the expected socket path.
3. A verification step that checks the Docker socket used by the starter template.
4. A fallback for local process supervision when `nohup coder server` does not stay alive.

Those changes would turn the setup from "good if you can debug the host" into "smooth enough for someone evaluating Coder under time pressure."

## Bottom Line

Coder passed the practical test. On a fairly fresh Apple Silicon MacBook Neo, I was able to install it, bootstrap an admin, create a template, start a workspace, and verify real shell access in under 10 minutes.

The experience was not frictionless, but the friction was understandable and fixable. The biggest lesson is that local developer environment tools need to be honest about their dependencies. Coder itself came together quickly; the hard parts were Postgres, Docker, and process management.

That is actually a useful finding. Coder's value proposition is strongest once the workspace is running. The faster the setup guide gets Mac users past the host machine details, the faster they reach the moment where Coder starts to feel useful.
