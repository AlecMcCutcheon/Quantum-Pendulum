# Pendulum Physics Research (Quantum Pendulum)

Research summary for replacing the custom 2D projection integrator with a real 3D physics simulation. Sources are cited inline.

---

## 1. Problem definition

We need three coupled behaviors:

1. **Anchor on a 2D plane (x–z)** with a spring restoring force toward the origin (not a hard teleport).
2. **A flexible connection** from anchor to bob (rope/cable), not a single rigid line drawn in screen space.
3. **A 3D bob** that swings under gravity and **lags** when the anchor moves (inertia through the chain), not moving in lockstep with the anchor.

Divination reading should follow **classical pendulum motion modes** over a circle:

| Motion | Typical meaning |
|--------|-----------------|
| **Vertical** swing (forward/back in the swing plane) | **Yes** (top and bottom of circle) |
| **Horizontal** swing (side to side) | **No** (left and right) |
| **Circular / elliptical** motion near center | **Maybe** |

Reading is from **how** the bob moves over ~1–2 seconds, not from a static position on the disc.

---

## 2. Rigid 3D pendulum (moving pivot)

### 2.1 Spherical pendulum

A point mass on a massless rod of length \(L\) with a **fixed** pivot has 2 positional degrees of freedom (e.g. polar angle \(\theta\), azimuth \(\phi\)). Gravity drives the familiar spherical pendulum dynamics.

Reference: UCSD CCoM report on **3D pendulum** models (Euler equations, reduced attitude \(\Gamma \in S^2\)):  
https://ccom.ucsd.edu/reports/UCSD-CCoM-07-02.pdf

### 2.2 Moving pivot (critical for our anchor)

When the pivot follows a known trajectory \(x_p(t)\) in the plane and the rod is **rigid**, the Lagrangian method collapses the problem.

For planar motion with pivot on \(x\) and bob angle \(\theta\) from vertical:

\[
\ddot{\theta} = -\frac{1}{L}\bigl(g\sin\theta + \ddot{x}_p\cos\theta\bigr)
\]

Source: Physics Stack Exchange — *A pendulum with the moving pivot*  
https://physics.stackexchange.com/questions/700185/a-pendulum-with-the-moving-pivot

**Implication:** The bob’s angular acceleration depends on **pivot acceleration** \(\ddot{x}_p\), not merely pivot position. A shove on the anchor must propagate as inertial lag on the rod, not as instantaneous bob translation.

### 2.3 3D rigid body pendulum

A **compound pendulum** (distributed mass, universal joint preventing twist) uses Newton–Euler or Lagrange with body frame inertia tensor \(I\), center-of-mass offset \(\rho\), and constraint moments.

Reference: Jin Hyun Park — *3D Single Compound Pendulum*  
http://www.jinhyunp.com/projects/single_pendulum/

**Implication:** For a single rigid rod + bob, a **spherical joint** (ball-and-socket) at the anchor is the correct idealization in a physics engine.

---

## 3. Flexible rope / cable

Real cord is extensible under tension and bends. Common simulation approaches:

### 3.1 Mass–spring chain (Verlet / PBD)

- Discretize rope into \(N\) particles.
- Enforce rest length with **distance constraints** each substep.
- Integrate with Verlet or semi-implicit Euler + constraint projection.

Reference: *softy* (VerletChain, distance constraints)  
https://github.com/RobDavenport/softy

### 3.2 XPBD (Extended Position Based Dynamics)

- Compliance \(\alpha\) makes constraints soft (realistic stretch).
- Distance constraint: \(C = \|p_0-p_1\| - l_0\).
- Update: \(\Delta\lambda = -C / (M^{-1} + \tilde{\alpha})\), \(\tilde{\alpha} = \alpha/\Delta t^2\).

References:

- Müller et al., *XPBD* (2016): https://matthias-research.github.io/pages/publications/XPBD.pdf  
- Carmen Cincotti — distance constraint walkthrough: https://carmencincotti.com/2022-08-22/the-distance-constraint-of-xpbd/

**Implication:** A **chain of small bodies** with distance/rope limits is the standard game/graphics approach for “flexible rope.”

### 3.3 Continuum / FEM

Higher fidelity (Cosserat rod, FEM beams) — overkill for interactive divination in the browser.

---

## 4. Physics engine choice (browser, 3D)

| Library | Pros | Cons |
|---------|------|------|
| **Rapier** (`@react-three/rapier`) | WASM Rust, fast, maintained, joints API, R3F bindings | Rope joint only limits max distance (can compress) |
| **Cannon.js / cannon-es** | Older Three.js examples | Less maintained |
| **Ammo.js** | Bullet port | Heavy WASM load |
| **Custom integrator** | Full control | Easy to get wrong (our prior issue) |

**Decision:** **Rapier 3D** via `@react-three/rapier` + `@react-three/fiber` + `@react-three/drei`.

Rapier joint summary (official docs):  
https://rapier.rs/docs/user_guides/javascript/joints

| Joint | Use for pendulum |
|-------|------------------|
| **Spherical** | Ball socket at anchor (3 rotational DOF, no relative translation at anchor point) |
| **Rope** | Max distance between consecutive chain links (cable / chain links) |
| **Spring** | Optional compliance between links |
| **Revolute** | 2D-like hinge if we constrain one axis |

**Rope joint note:** Rapier’s rope joint prevents bodies from separating **beyond** `max_distance` but allows them to get closer (inelastic, no bounce until taut). Chaining several short ropes approximates flexible cable + catenary sag.

Reference: Rapier `RopeJoint` — https://docs.rs/rapier3d/latest/rapier3d/dynamics/struct.RopeJoint.html

**Lanyard pattern (production-proven in R3F):** Vercel’s interactive badge uses a **chain of rigid bodies + `useRopeJoint` + Catmull–Rom visual mesh**:  
https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber

`react-three-rapier` joint hooks:  
https://github.com/pmndrs/react-three-rapier

---

## 5. Proposed architecture (implementation)

```
┌─────────────────────────────────────────┐
│  Fixed frame (optional ceiling marker)   │
└─────────────────┬───────────────────────┘
                  │ spring force (x,z) → origin
┌─────────────────▼───────────────────────┐
│  Anchor RigidBody (dynamic, Y locked)  │  ← quantum impulses here only
└─────────────────┬───────────────────────┘
                  │ rope + spherical
        ┌─────────┴─────────┐
        │  Link × N (small)  │  flexible chain
        └─────────┬─────────┘
                  │ rope
┌─────────────────▼───────────────────────┐
│  Bob RigidBody (heavy sphere)            │
└─────────────────────────────────────────┘
                  │
        Divination disc (visual, y ≈ 0)
```

### Anchor (elastic plane)

- Dynamic `RigidBody`, translations enabled on **x** and **z**, locked or heavily damped on **y**.
- Each physics step: apply spring-damper force toward \((0, y_{\text{anchor}}, 0)\):

  \[
  F_x = -k x - c v_x,\quad F_z = -k z - c v_z
  \]

- Quantum randomness adds **impulse to anchor velocity** only.

### Rope

- \(N \approx 8\)–12 small capsule/sphere links, mass \(m_{\text{link}} \ll m_{\text{bob}}\).
- `useRopeJoint(parent, child, [anchorA, anchorB, segmentLength])` between consecutive bodies.
- Optional `useSphericalJoint` at anchor → first link for clean pivot rotation.
- Visual: `CatmullRomCurve3` or `mesh` tube updated each frame from link world positions.

### Reading (swing modes)

- Ring buffer of bob **relative** position (or velocity) vs anchor.
- Estimate:
  - **Vertical energy:** \(\mathrm{Var}(y_{\text{rel}})\) or \(\mathrm{Var}(v_y)\)
  - **Horizontal energy:** \(\mathrm{Var}(x_{\text{rel}}) + \mathrm{Var}(z_{\text{rel}})\)
  - **Circularity:** path winding / phase quadrature in horizontal plane + moderate \(|\omega_y|\)

Map to Yes / No / Maybe and highlight triad disc zones (top/bottom Yes, left/right No, center Maybe).

---

## 6. What we are deprecating

- Custom `pendulumPhysics.ts` integrator (Euler angles / manual \(\omega\)) — retained only for types/helpers until fully removed.
- Canvas 2D projection “fake 3D” — replaced by WebGL scene.
- Direct quantum kicks on bob angular velocity — quantum affects **anchor only**; rope physics transfers motion.

---

## 7. Tuning parameters (starting points)

| Parameter | Suggested | Role |
|-----------|-----------|------|
| `N` links | 10 | Flex vs performance |
| Segment length | 0.08–0.1 m | Total rope ~0.8–1.0 m |
| Bob mass | 2.0 kg | Inertia |
| Link mass | 0.04 kg | Light chain |
| Anchor spring `k` | 8–15 | Return to center |
| Anchor damping | 2–4 | Calm drift |
| Rapier `gravity` | `[0, -9.81, 0]` | Standard |
| Solver iterations | default + stable timestep | Reduce stretch explosions |

---

## 8. References (full list)

1. Moving pivot Lagrangian — https://physics.stackexchange.com/questions/700185/a-pendulum-with-the-moving-pivot  
2. 3D pendulum dynamics (UCSD) — https://ccom.ucsd.edu/reports/UCSD-CCoM-07-02.pdf  
3. Compound 3D pendulum — http://www.jinhyunp.com/projects/single_pendulum/  
4. N-mass pendulum / chaos — https://github.com/wendtpiotr/n-mass-points-pendulum-simulator  
5. PyDy N-body pendulum — https://pydy.readthedocs.io/en/stable/examples/3d-n-body-pendulum.html  
6. XPBD — https://matthias-research.github.io/pages/publications/XPBD.pdf  
7. XPBD distance constraint — https://carmencincotti.com/2022-08-22/the-distance-constraint-of-xpbd/  
8. PositionBasedDynamics XPBD API — https://positionbaseddynamics.readthedocs.io/en/latest/api/class_p_b_d_1_1_x_p_b_d.html  
9. Rapier joints guide — https://rapier.rs/docs/user_guides/javascript/joints  
10. Rapier RopeJoint — https://docs.rs/rapier3d/latest/rapier3d/dynamics/struct.RopeJoint.html  
11. react-three-rapier — https://github.com/pmndrs/react-three-rapier  
12. Vercel R3F + Rapier lanyard (rope chain) — https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber  

---

## 9. Implementation status

- [x] Research documented (this file)
- [ ] `@react-three/fiber` + `@react-three/drei` + `@react-three/rapier` integrated
- [ ] 3D scene with Rapier rope chain + elastic anchor
- [ ] Swing-mode divination disc in 3D
- [ ] Quantum impulses → anchor only
