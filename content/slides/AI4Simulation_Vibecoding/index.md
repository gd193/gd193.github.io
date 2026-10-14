---
title: VibeCoding4Simulation
date: 2026-06-09
description: Coding agents for gyrokinetic simulation, GPU kernel optimization, and scientific software.
authors:
  - Eric Volkmann
featured: true
type: slides
math: true
slides:
  theme: simple
  highlight_style: dracula
  diagram: true
  reveal_options:
    controls: true
    progress: true
    slideNumber: true
    showNotes: false
    hash: true
    center: true
    width: 1280
    height: 720
---

{{< slide background-color="#0078aa" class="presentation-cover" >}}

<style>
  .reveal { font-size: 30px !important; }
  .bubble-img img, .constrained-img img {
    max-height: 520px;
    max-width: 100%;
    width: auto;
    border-radius: 8px;
    margin: 0 auto;
    display: block;
  }
  .small-img img {
    max-height: 380px;
    max-width: 100%;
    width: auto;
    border-radius: 8px;
    margin: 0 auto;
    display: block;
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 34px;
    align-items: center;
  }
  .two-col img {
    max-height: 500px;
    max-width: 100%;
    width: auto;
    border-radius: 8px;
    margin: 0 auto;
    display: block;
  }
  .official-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 22px;
    align-items: center;
  }
  .official-grid img {
    max-height: 210px;
    max-width: 100%;
    width: auto;
    border-radius: 8px;
    margin: 0 auto;
    display: block;
  }
  .official-wide img {
    max-height: 500px;
    max-width: 100%;
    width: auto;
    border-radius: 8px;
    margin: 0 auto;
    display: block;
  }
  .caption { font-size: 0.55em; opacity: 0.75; margin-top: 8px; }
  .callout {
    background: #eef7fb;
    border-left: 8px solid #0078aa;
    padding: 18px 24px;
    border-radius: 8px;
    font-weight: 600;
  }
  .quote {
    font-size: 1.12em;
    line-height: 1.35;
    padding: 26px 34px;
    border-left: 10px solid #0078aa;
    background: #f4f8fb;
    border-radius: 8px;
    text-align: left;
  }
  .small { font-size: 0.72em; }
  .tiny { font-size: 0.58em; }
  .code-small pre { font-size: 0.55em !important; line-height: 1.2 !important; }
  .compact-table table { font-size: 0.7em; }
  .compact-table th, .compact-table td { padding: 0.25em 0.45em; }
</style>

{{< presentation-title >}}

---

### If you can verify it, you can solve it

<div class="two-col">
<div>

![AI benchmark progress](images/ai_benchmark_progress.jpeg)

</div>
<div>

![Asymmetry of verification](images/asymmetry_of_verification.jpeg)

</div>
</div>

---

### The Clankers are here

![clankers](images/ZmmCd5.gif)

---

### It's all about the Harness

![harness](images/harness_image.png)

---

### Gyrokinetic simulations: turbulence follows field lines

<div class="constrained-img">

![Gyrokinetic turbulence along magnetic field lines](gyrokin.jpeg)

</div>

---

### What does the code simulate?

<div class="constrained-img">

![Flux tube, 5D gyrokinetic state grid, and RHS evaluation](images/what_code_simulates.svg)

</div>

<div class="small">
The unknown is a fluctuation field $\delta f(k_x,k_y,s,v_\parallel,\mu)$; the solver repeatedly computes fields $\phi$ and a right-hand side $\partial f/\partial t$.
</div>

---

### Gyrokinetic RHS: the terms the code evaluates

$$
\scriptsize
\begin{aligned}
    \frac{\partial f}{\partial t} ={}
    & \underbrace{\colorbox{#eee9ff}{$\displaystyle \vphantom{\frac{Z e F_M}{T}\left(v_\parallel\nabla_\parallel\bar{\phi}+i(\mathbf{k}_\perp\cdot\mathbf{v}_D)\bar{\phi}\right)} -v_\parallel\nabla_\parallel f$}}_{\text{Parallel Advection (I)}}
    \underbrace{\colorbox{#eee9ff}{$\displaystyle \vphantom{\frac{Z e F_M}{T}\left(v_\parallel\nabla_\parallel\bar{\phi}+i(\mathbf{k}_\perp\cdot\mathbf{v}_D)\bar{\phi}\right)} -i(\mathbf{k}_\perp\cdot\mathbf{v}_D)f$}}_{\text{Magnetic Drift (II)}}
    \underbrace{\colorbox{#eee9ff}{$\displaystyle \vphantom{\frac{Z e F_M}{T}\left(v_\parallel\nabla_\parallel\bar{\phi}+i(\mathbf{k}_\perp\cdot\mathbf{v}_D)\bar{\phi}\right)} +\mu\nabla_\parallel B\frac{\partial f}{\partial v_\parallel}$}}_{\text{Mirror Term (IV)}}
    \\
    & \underbrace{\colorbox{#e0f4f1}{$\displaystyle \vphantom{\frac{Z e F_M}{T}\left(v_\parallel\nabla_\parallel\bar{\phi}+i(\mathbf{k}_\perp\cdot\mathbf{v}_D)\bar{\phi}\right)} -\mathbf{v}_E\cdot\nabla F_M$}}_{\text{Equilibrium Drive (V)}}
    \underbrace{\colorbox{#e0f4f1}{$\displaystyle \vphantom{\frac{Z e F_M}{T}\left(v_\parallel\nabla_\parallel\bar{\phi}+i(\mathbf{k}_\perp\cdot\mathbf{v}_D)\bar{\phi}\right)} -\frac{Z e F_M}{T}\left(v_\parallel\nabla_\parallel\bar{\phi}+i(\mathbf{k}_\perp\cdot\mathbf{v}_D)\bar{\phi}\right)$}}_{\text{Field Drives (VII and VIII)}}
    \\
    & \underbrace{\colorbox{#ffe6e6}{$\displaystyle \vphantom{\frac{Z e F_M}{T}\left(v_\parallel\nabla_\parallel\bar{\phi}+i(\mathbf{k}_\perp\cdot\mathbf{v}_D)\bar{\phi}\right)} -\mathbf{v}_E\cdot\nabla_\perp f$}}_{\text{Nonlinear (III)}}
    \underbrace{\colorbox{#e8f1ff}{$\displaystyle \vphantom{\frac{Z e F_M}{T}\left(v_\parallel\nabla_\parallel\bar{\phi}+i(\mathbf{k}_\perp\cdot\mathbf{v}_D)\bar{\phi}\right)} -\mathcal{D}(f)$}}_{\text{Dissipation}}
\end{aligned}
$$

---

### The Fortran baseline: GKW

<div class="constrained-img">

![GKW legacy Fortran, MPI, build, and ML integration complexity](images/gkw_legacy_complexity.svg)

</div>

---

### Why this is not a normal ML port

<div class="constrained-img">

![5D gyrokinetic problem structure](images/gyrokinetic_problem_map.svg)

</div>

---

### From GKW to gyaradax

<div class="constrained-img">

![Porting GKW Fortran to gyaradax JAX](images/gkw_to_gyaradax_port.svg)

</div>

---

### Vibecoded CUDA kernels

<div class="two-col">
<div>

![fft](images/cufft_lto_fusion.jpeg)

</div>
<div>

![Stencil fusion](images/stencil_fusion_v2-1.jpeg)

</div>
</div>

<div class="compact-table">

| Case                |   Best gyaradax config | Speedup vs GKW |
| ------------------- | ---------------------: | -------------: |
| Adiabatic electrons | CUDA + mixed precision |     **10.53×** |
| Kinetic electrons   | CUDA + mixed precision |      **8.21×** |

</div>

---

### Agent workflow: keep the harness in charge

<div class="constrained-img">

![Agent workflow with human review and tests](images/agent_workflow_loop.svg)

</div>

---

### Model lineup

<div class="compact-table">

| Model           | Role                       | Verdict                |
| --------------- | -------------------------- | ---------------------- |
| Gemini Pro      | first attempt              | killed before stage 3  |
| GPT CODEX       | F90 $\rightarrow$ JAX port | got linear terms right |
| Claude Opus     | kinetic electrons          | handled multi-species  |
| Gemini + Claude | refactor/docs              | polish, not physics    |

</div>

<div class="small">
Agents translate well with a clear reference; they do not have physics intuition.
</div>

---

### Three-week speedrun

<div class="callout">

Agent speed is real — but only if the reference and tests are stronger than the agent.

</div>

---

<div class="constrained-img">

![gyaradax overview](images/gyaradax_small.png)

</div>

<div class="small">
<a href="https://github.com/gerkone/gyaradax">github.com/gerkone/gyaradax</a> · ported from <a href="https://bitbucket.org/gkw/gkw">bitbucket.org/gkw/gkw</a>
</div>

---

### Current setup: pi as the harness

<div class="two-col">
<div>

<b>One controlling agent</b>

- reads and edits the repo
- runs builds and tests
- regenerates figures
- keeps code and tests consistent

</div>
<div class="callout">

The LLM is not the workflow.

The harness is the workflow.

</div>
</div>

---

### Tools around the agent

<div class="compact-table">

| Tool                   | Why it matters                                     |
| ---------------------- | -------------------------------------------------- |
| linters / diagnostics  | catch syntax and type mistakes early               |
| tests / reference runs | prevent “looks plausible” physics bugs             |
| subagents              | parallel review, research, implementation attempts |
| code search / LSP      | jump through unfamiliar codebases                  |

</div>

Same idea as gyaradax: useful agents need a controlled environment, not just a chat box.

---

### Software engineering matters more, not less

<div class="quote">
As agents write more code, software design becomes the harness that keeps them useful.
</div>

<div class="two-col">
<div>

- type systems
- API and system design
- testing and reference checks

</div>
<div>

- CI/CD pipelines
- reproducible environments
- clear interfaces between tools

</div>
</div>
