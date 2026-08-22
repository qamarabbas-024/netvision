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

* **Public Catalog & Course Discovery**: Clear conceptual spine spanning Levels 0–7 (Foundations to Advanced Protocols).
* **Guest & Authenticated Learning**: Frictionless guest exploration with atomic, server-authoritative progress claiming upon account creation.
* **Topic-Driven Content V2 Lessons**: Focused lessons answering *What*, *Why*, *How*, *What Changes*, and *How to Practice* with zero phantom containers.
* **Interactive Protocol Instruments**: Real-time visualizers (e.g. CIDR Prefix Slider, Binary Bit Engine, ARP State Machine, TCP Handshake) where input changes produce observable protocol consequences.
* **Mastery Assessment**: Cognitively varied quizzes (Understanding, Application, Troubleshooting) aligned strictly to lesson objectives.
* **Interactive Break-Fix Troubleshooting**: Real-world incident catalog isolating Layer 1–7 network anomalies with evidence discovery.
* **Server-Authoritative Certification**: `NV-NET` credentialing with cryptographically verifiable IDs and public verification portal.

---

## 4. Product Principles & AI Guardrails

1. **Content Quality Over Feature Count**: A lesson is successful when the learner genuinely understands the concept and can explain why it works—not when it has 18 arbitrary template sections.
2. **Interaction Must Teach**: Animations are valuable only when the learner can change inputs, observe state mutations, and understand cause and effect.
3. **One Canonical Source of Truth**: Backend PostgreSQL/Prisma database is authoritative for curriculum, assessment, ownership, and credentials.
4. **No Invented Requirements**: No fabricated instructors, synthetic statistics, or fake lab simulations.

---

## 5. Curriculum Progression Spine

* **Level 0 — Digital Foundations**: Bits, Bytes, Binary, Hexadecimal, Physical Media, Transceivers.
* **Level 1 — Networking Foundations**: Communication Elements, Client/Server, P2P, Scopes, Topologies, OSI 7-Layer, TCP/IP 4-Layer.
* **Level 2 — Local & IP Networking**: MAC Addresses, Ethernet II Framing, IPv4 & CIDR Subnetting, ARP, DNS, DHCP, Sockets, TCP/UDP.
* **Level 3 — Enterprise Infrastructure**: Switching & VLANs, Spanning Tree (STP), IP Routing, Single-Area OSPF, ACLs & Firewalls.
* **Level 4 — Advanced Edge & Forensics**: Enterprise NAT/PAT, IPsec VPNs, BGP Autonomous Systems, Wireshark PCAP Dissection.
