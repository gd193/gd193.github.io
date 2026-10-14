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
        I am a PhD candidate at the Institute for Machine Learning at Johannes Kepler University Linz, supervised by [Prof. Johannes Brandstetter](https://scholar.google.com/citations?user=KiRvOHcAAAAJ) and [Prof. Sepp Hochreiter](https://scholar.google.com/citations?user=tvUH3WMAAAAJ). I am currently a research intern in the Computational Geometry Team at [Braid Technologies](https://braid.tech/) in Tokyo, working on autonomous CAD for physics-driven design optimization and discovery.

        I work on inverse design using implicit representations (neural or otherwise), coupling geometry with physical simulation and optimization. My projects include geometry-informed neural networks and generative topology optimization, with a focus on producing diverse and structurally compliant designs.

        Prior to my PhD, I completed my MSc and BSc in Physics at Heidelberg University in 2023, where my master's research focused on generative state-space models for reconstructing nonlinear dynamical systems.

        My work has been published at NeurIPS and ICML.

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
              <p><strong>Research Intern · Computational Geometry Team</strong><br><a href="https://braid.tech/">Braid Technologies</a> · Tokyo, Japan <span class="cv-date">Jul–Nov 2026</span></p>
              <p class="cv-detail">Research on autonomous CAD for physics-driven design optimization and discovery.</p>
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

        {{< publication-list >}}


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
