# NetVision — Master Product Specification

> **Positioning**: Interactive Computer Networking Learning Platform  
> **Core Promise**: Learn networking by seeing it, changing it, building it, and explaining why it works.

---

## 1. What NetVision Is

NetVision makes computer networking understandable because the learner can **SEE** the mechanisms instead of only reading about them.

### The Pedagogical Cycle:
```
LEARN ➔ SEE ➔ CHANGE ➔ OBSERVE ➔ EXPLAIN ➔ PRACTICE ➔ PROVE ➔ MASTER
```

### What NetVision Is NOT:
* **NOT** another LMS or PDF textbook reader.
* **NOT** a collection of disconnected, purely decorative animations.
* **NOT** generic AI-generated card walls or template boilerplate.
* **NOT** fake labs with synthetic CLI filler where none is needed.
* **NOT** an attempt to copy Coursera, Udemy, Cisco, or TryHackMe.

---

## 2. Target Audience & Learner Personas

1. **Computer Science & Engineering Students**: Building strong mental models of protocol layers, frame formats, packet routing, and state machines for academic and career excellence.
2. **Practicing Software Engineers & SREs**: Seeking concrete, visual mastery of TCP/IP mechanics, CIDR subnetting, DNS resolution, and packet troubleshooting without memorizing disconnected cheat sheets.
3. **Network & Security Practitioners**: Pursuing deep, verifiable intuition of switching, routing (OSPF/BGP), loop prevention (STP), firewall state tables, and Wireshark forensics.

---

## 3. Core Product Capabilities (V1 Scope)

* **Public Catalog & Course Discovery**: Clear conceptual progression across the 5 Flagship Courses (`NV-C01` to `NV-C05`).
* **Guest & Authenticated Learning**: Frictionless guest exploration with atomic, server-authoritative progress claiming upon account creation.
* **Topic-Driven Content V2 Lessons**: Focused lessons answering *What*, *Why*, *How*, *What Changes*, and *How to Practice* with zero phantom containers.
* **Interactive Protocol Instruments**: Real-time visualizers (e.g. CIDR Prefix Slider, Binary Bit Engine, ARP State Machine, TCP Handshake) where input changes produce observable protocol consequences.
* **Mastery Assessment**: Cognitively varied quizzes (Understanding, Application, Troubleshooting) aligned strictly to lesson objectives.
* **Interactive Break-Fix Troubleshooting**: Real-world incident catalog isolating Layer 1–7 network anomalies with evidence discovery.
* **Server-Authoritative Certification**: 6 canonical credentials (`NV-NET-C01`..`NV-NET-C05` and `NV-NET-MASTERY`) with cryptographically verifiable IDs and public verification portal.

---

## 4. Product Principles & AI Guardrails

1. **Content Quality Over Feature Count**: A lesson is successful when the learner genuinely understands the concept and can explain why it works—not when it has arbitrary template filler.
2. **Interaction Must Teach**: Animations are valuable only when the learner can change inputs, observe state mutations, and understand cause and effect.
3. **One Canonical Source of Truth**: Backend PostgreSQL/Prisma database is authoritative for curriculum, assessment, ownership, and credentials.
4. **No Invented Requirements**: No fabricated instructors, synthetic statistics, or fake lab simulations.

---

## 5. Curriculum Progression Spine (5 Flagship Courses)

* **NV-C01 — Foundations & Network Architecture**: Digital Representation, Hardware Architecture, Topologies, Transmission Media, OSI/TCP-IP Models.
* **NV-C02 — Ethernet, Switching & IP Networking**: Ethernet Framing, MAC Tables, Enterprise VLANs & 802.1Q Trunks, Spanning Tree (STP), IPv4 Addressing & CIDR Subnetting.
* **NV-C03 — Transport, Routing & Network Services**: Core IP Services (ARP, DNS, DHCP), TCP/UDP Transport Protocols, Static Routing Administration, Dynamic Routing with Single-Area OSPFv2.
* **NV-C04 — Network Security & Secure Connectivity**: Perimeter Security & IPv4 ACLs, Stateful Firewalls, Network Address Translation (NAT/PAT), Site-to-Site IPsec VPN Cryptography.
* **NV-C05 — Network Engineering, Automation & Troubleshooting**: Wireshark PCAP Stream Forensics, Complex Diagnostic & Incident Workflows, Network Automation & Python Programmability.
