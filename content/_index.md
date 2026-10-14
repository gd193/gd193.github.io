---
title: ''
summary: ''
date: 2025-01-01
type: landing

design:
  spacing: '4rem'

sections:
  - block: portrait-hero
    id: section-hero
    content:
      title: Eric Volkmann
      video:
        enabled: true
        src: /media/research/julia-white.mp4
        src_dark: /media/research/julia-crimson.mp4
        poster: /media/research/julia-white-poster.webp
        poster_dark: /media/research/julia-crimson-poster.webp
      text: |-
        **AI/ML Researcher** working at the intersection of 3D machine learning, AI for Science, and physics.
      primary_action:
        text: Research interests
        url: '#research'
        icon: arrow-down
      secondary_action:
        text: Presentations
        url: '#presentations'
    design:
      spacing:
        padding: ['5rem', '0', '4rem', '0']
      css_class: 'dark:bg-black'

  - block: markdown
    id: about
    content:
      title: About
      text: |-
        I am a PhD candidate at the Institute for Machine Learning at Johannes Kepler University Linz, supervised by [Prof. Johannes Brandstetter](https://scholar.google.com/citations?user=KiRvOHcAAAAJ) and [Prof. Sepp Hochreiter](https://scholar.google.com/citations?user=tvUH3WMAAAAJ). My research sits at the intersection of **3D machine learning, AI for Science, and physics**.

        I work on inverse design using implicit representations (neural or otherwise), coupling geometry with physical simulation and optimization. My projects include geometry-informed neural networks and generative topology optimization, with a focus on producing diverse and structurally compliant designs without training data.

        I studied physics at Heidelberg University. My master's research focused on reconstructing dynamical systems from data using state-space models, including their long-term dynamics and state-space geometry.

  - block: research-areas
    id: research
    content:
      title: Research interests
      subtitle: My research connects modern deep learning with geometry, physical structure, and dynamical systems.
      items:
        - name: Geometry-informed neural networks
          description: Designing neural architectures and representations that incorporate geometry and structure into learning.
          image: research/diagonal_overlay.gif
          icon: hero/cube
          gradient: from-blue-500 to-indigo-600
          status: active
          topics:
            - Geometric deep learning
            - Neural fields
            - Structured representations
        - name: Dynamical systems & scientific ML
          description: Using machine learning to reconstruct, analyze, and model complex dynamical systems from limited observations.
          image: research/dynamical-systems-learning.png
          icon: hero/arrow-path
          gradient: from-emerald-500 to-teal-600
          status: active
          topics:
            - Time-series modeling
            - Neuroimaging
            - System identification
        - name: Generative topology optimization
          description: Developing generative approaches for underdetermined scientific problems and topology optimization.
          image: research/generative-topology-optimization.png
          icon: hero/beaker
          gradient: from-violet-500 to-fuchsia-600
          status: active
          topics:
            - Topology optimization
            - Neural fields
            - Structured representations
        - name: Differentiable plasma physics
          description: Building GPU-accelerated, differentiable scientific solvers for gyrokinetic simulation, sensitivity analysis, and inverse problems.
          image: research/gyaradax-gyrokinetics.png
          icon: hero/bolt
          gradient: from-cyan-500 to-blue-600
          status: active
          topics:
            - Gyrokinetics
            - JAX
            - CUDA
            - Differentiable physics
            - Inverse problems
    design:
      layout: cards

  - block: markdown
    id: cv
    content:
      title: Short CV
      text: |-
        <div class="cv-grid not-prose">
          <div>
            <h3>Education</h3>
            <div class="cv-entry">
              <p><strong>PhD in Machine Learning</strong><br><a href="https://www.jku.at/en/institute-for-machine-learning/">Johannes Kepler University Linz</a> · Austria <span class="cv-date">2024–present</span></p>
              <p class="cv-detail">Supervised by <a href="https://scholar.google.com/citations?user=KiRvOHcAAAAJ" target="_blank" rel="noopener">Prof. Johannes Brandstetter</a> and <a href="https://scholar.google.com/citations?user=tvUH3WMAAAAJ" target="_blank" rel="noopener">Prof. Sepp Hochreiter</a>.</p>
            </div>
            <div class="cv-entry">
              <p><strong>MSc in Physics</strong><br><a href="https://www.uni-heidelberg.de/en/study/all-subjects/physics/physics-master">Heidelberg University</a> · Germany <span class="cv-date">2020–2023</span></p>
            </div>
            <div class="cv-entry">
              <p><strong>BSc in Physics</strong><br><a href="https://www.uni-heidelberg.de/en/study/all-subjects/physics/physics-bachelor-100">Heidelberg University</a> · Germany <span class="cv-date">2017–2020</span></p>
            </div>
          </div>
          <div>
            <h3>Professional Experience</h3>
            <div class="cv-entry">
              <p><strong>Research Intern · Geometry Team</strong><br><a href="https://braid.tech/">Braid Technologies</a> · Tokyo, Japan <span class="cv-date">Jul–Nov 2026</span></p>
              <p class="cv-detail">Research on automated computer-aided design (CAD), integrating geometric modelling, physics-based simulation, and optimization.</p>
            </div>
            <div class="cv-entry">
              <p><strong>Working Student · Data Science</strong><br><a href="https://www.scribos.com/">Kurz Scribos</a> · Heidelberg, Germany <span class="cv-date">May 2021–Jul 2023</span></p>
              <p class="cv-detail">Image processing, classification, and clustering for fraud detection and brand protection.</p>
            </div>
            <div class="cv-entry">
              <p><strong>Consulting Intern</strong><br><a href="https://www.d-fine.com/en/">d-fine</a> · Frankfurt, Germany <span class="cv-date">Aug–Oct 2021</span></p>
              <p class="cv-detail">Automated data-processing and regulatory-reporting pipelines for a major German bank.</p>
            </div>
          </div>
        </div>

  - block: markdown
    id: selected-work
    content:
      title: Selected work
      text: |-
        ### Publications

        - **gyaradax: Local Gyrokinetics JAX Code** — Gianluca Galletti, Eric Volkmann, Johannes Brandstetter. [Paper](https://openreview.net/forum?id=Sgs7yLTkJ0) · [Code](https://github.com/gerkone/gyaradax)
          <span class="publication-venue">AI4Science Workshop · ICML 2026</span>
        - **Diverse Topology Optimization using Modulated Neural Fields** — Andreas Radler, Eric Volkmann, Johannes Brandstetter, Arturs Berzins. [Paper](https://openreview.net/forum?id=2Qccww9opt) · [Code](https://github.com/ml-jku/Topology-Optimization-Modulated-Neural-Fields)
          <span class="publication-venue">AI for Science Workshop · NeurIPS 2025</span>
        - **Geometry-Informed Neural Networks** — Arturs Berzins, Andreas Radler, Eric Volkmann, Sebastian Sanokowski, Sepp Hochreiter, Johannes Brandstetter. [Paper](https://proceedings.mlr.press/v267/berzins25a.html) · [Code](https://github.com/ml-jku/GINNs-Geometry-informed-Neural-Networks)
          <span class="publication-venue">ICML 2025</span>
        - **Exploring Diverse Solutions for Underdetermined Problems** — Eric Volkmann, Andreas Radler, Johannes Brandstetter, Arturs Berzins. [Paper](https://openreview.net/forum?id=HEqtcVOicH)
          <span class="publication-venue">Methods and Opportunities at Small Scale (MOSS) Workshop · ICML 2025</span>
        - **A scalable generative model for dynamical system reconstruction from neuroimaging data** — Eric Volkmann, Alena Brändle, Daniel Durstewitz, Georgia Koppe. [Paper](https://proceedings.neurips.cc/paper_files/paper/2024/hash/9304fe9848ca4db73c79ac0bac414aef-Abstract-Conference.html) · [Code](https://github.com/humml-lab/GTF-ConvSSM)
          <span class="publication-venue">NeurIPS 2024</span>


  - block: research-areas
    id: presentations
    content:
      title: Selected presentations
      items:
        - name: 'Bridging the Gap: Towards Physics-Based Simulation on Neural Fields'
          description: Research overview presented at TU Vienna, connecting neural geometry with physics-based simulation.
          image: presentations/twisted-torus-twist10.gif
          url: /present/slides/tu-vienna-presentation/
          cta:
            text: View slides
            url: /present/slides/tu-vienna-presentation/
        - name: Walking Neural Spheres
          description: PhD seminar at JKU Linz on mesh-free PDE solving and geometric queries for neural implicit shapes.
          image: presentations/neural-spheres.gif
          url: /present/slides/phd_seminar_ss2026/
          cta:
            text: View slides
            url: /present/slides/phd_seminar_ss2026/
        - name: VibeCoding4Simulation
          description: Building gyaradax with coding agents, from gyrokinetic simulation to optimized GPU kernels.
          image: presentations/vibecoding-gyaradax.png
          url: /present/slides/ai4simulation_vibecoding/
          cta:
            text: View slides
            url: /present/slides/ai4simulation_vibecoding/
    design:
      layout: cards
---
