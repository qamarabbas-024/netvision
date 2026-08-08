import { PrismaClient, CourseLevel, LessonType, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding NetVision Educational Networking Data (21 Topics + Progressive Difficulty Scenarios + Users)...');

  // Clean existing data
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPasswordHash = await argon2.hash('admin123');
  const studentPasswordHash = await argon2.hash('alex123');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@netvision.edu',
      username: 'admin',
      fullName: 'System Administrator',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'alex@netvision.edu',
      username: 'alex',
      fullName: 'Alex Rivers',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      isVerified: true,
    },
  });

  console.log(`👤 Created Users: ADMIN (${adminUser.email}), STUDENT (${studentUser.email})`);

  // Helper builder function for questions
  const createQ = (
    text: string,
    opts: string[],
    correctIdx: number,
    whyCorrect: string,
    wrongWhys: Record<number, string>
  ) => ({
    questionText: text,
    optionsJson: opts,
    correctOption: correctIdx,
    explanation: whyCorrect,
    explanationsJson: wrongWhys,
  });

  // 21 UNIQUE TOPICS SEED DEFINITIONS WITH EASY, MEDIUM, HARD SCENARIOS
  const topicsData = [
    // 1. WHAT IS COMPUTER NETWORKING?
    {
      slug: 'networking-fundamentals',
      title: 'What is Computer Networking?',
      tagline: 'Understand connected systems, client-server relationships, LANs, and WANs.',
      category: 'Fundamentals',
      description: 'Learn how computers talk to each other across wires and radio waves.',
      level: CourseLevel.BEGINNER,
      icon: 'Network',
      estimatedHours: 3,
      lessonTitle: '1. What is Computer Networking?',
      lessonSlug: 'what-is-computer-networking',
      shortExplanation: 'A computer network is a system of interconnected devices sharing data and resources.',
      theory: `1. WHAT IS IT?\nA computer network connects two or more computers so they can share files, web pages, and services.\n\n2. WHY DO WE NEED IT?\nWithout networks, you would have to copy files to a USB drive and walk over to another computer ("Sneakernet"). Networks allow instant global communication.\n\n3. HOW DOES IT WORK?\nComputers split data into small packets, address them to a destination device, and send them over cables or Wi-Fi.\n\n4. REAL-WORLD EXAMPLE:\nWhen you open Netflix on your laptop, your laptop (client) sends a packet request over your home Wi-Fi to a Netflix server miles away, which streams video packets back to your screen.\n\n5. STEP-BY-STEP FLOW:\nStep 1: Your app creates data.\nStep 2: Data is divided into packets.\nStep 3: Packets travel across switches and routers.\nStep 4: The destination receives packets and rebuilds original data.\n\n6. WHAT SHOULD YOU REMEMBER?\n- Clients request data; Servers host and provide data.\n- LAN = Local Area Network. WAN = Wide Area Network.`,
      analogy: 'Like the postal service: envelopes contain messages, street addresses ensure delivery, and mail vans transport parcels.',
      keyConcepts: ['Client-Server Model: Clients request, Servers serve.', 'LAN vs WAN: Local home network vs Global internet.', 'Packets: Small manageable pieces of larger data files.', 'Bandwidth & Latency: Capacity vs Speed of transmission.'],
      practicalActivity: { title: 'Activity: Check Your Local Network IP', instructions: 'Open your terminal and type `ping google.com` to see packets traveling back and forth.' },
      questions: [
        // Easy
        createQ('[EASY] What is the primary purpose of a computer network?', ['To slow down computer performance', 'To share data, services, and hardware resources between interconnected devices', 'To manufacture computer microchips', 'To format hard drives'], 1, 'Networks enable endpoints to exchange files, print documents, and access web services.', { 0: 'Networks aim to maximize communication speed.', 2: 'Hardware manufacturing occurs in factories.', 3: 'Formatting is disk management.' }),
        createQ('[EASY] In the Client-Server networking model, what is the role of a Client?', ['To host websites for thousands of simultaneous users', 'To request data or services from a central server', 'To forward packets between different cities', 'To supply electrical power to cables'], 1, 'Clients (like your browser) initiate requests to fetch resources from servers.', { 0: 'Servers host services for multiple users.', 2: 'Routers forward packets between networks.', 3: 'Power supplies provide electrical power.' }),
        // Medium
        createQ('[MEDIUM] A company connects computers across two office buildings located 50 miles apart in different cities. What type of network is this?', ['PAN (Personal Area Network)', 'LAN (Local Area Network)', 'WAN (Wide Area Network)', 'SAN (Storage Area Network)'], 2, 'WANs connect geographically distant sites spanning cities or countries.', { 0: 'PAN is bluetooth range around a person.', 1: 'LAN covers a single building or room.', 3: 'SAN connects server storage arrays.' }),
        createQ('[MEDIUM] Why is large data broken into smaller Packets before being transmitted across a network link?', ['Because giant files would block the network link for all other users if sent in one piece', 'Because computers can only read 1 byte per minute', 'To increase total file size on disk', 'To prevent routers from reading headers'], 0, 'Packet switching ensures fair bandwidth distribution and permits easy retransmission of lost fragments.', { 1: 'Computers process billions of bytes per second.', 2: 'Packet headers add minimal overhead.', 3: 'Routers require packet headers to forward data.' }),
        // Hard / Troubleshooting
        createQ('[HARD] Users report that streaming video works smoothly, but interactive online voice calls drop frequently with noticeable stutters. Which network performance metric is most likely degrading the voice calls?', ['Bandwidth capacity', 'Jitter and Latency variation', 'Monitor resolution', 'Storage space'], 1, 'Real-time voice calls require low latency and low jitter (consistent arrival timing); bandwidth alone does not prevent packet delay spikes.', { 0: 'High bandwidth does not fix high latency jitter.', 2: 'Monitor resolution is display hardware.', 3: 'Storage space is disk capacity.' }),
        createQ('[HARD] A system administrator replaces a hub with a managed network switch. What immediate effect will this have on local network collision behavior?', ['Collisions will increase dramatically', 'Each switch port becomes its own isolated Collision Domain, eliminating half-duplex collisions', 'IP addresses will be erased', 'Internet speed drops to zero'], 1, 'Switches operate in Full-Duplex on isolated port domains, eliminating Ethernet collision domains created by hubs.', { 0: 'Hubs cause collisions; switches prevent them.', 2: 'IP addresses exist at Layer 3.', 3: 'Switches improve throughput.' }),
        createQ('[HARD] A laptop is connected to a local Wi-Fi router. The laptop can ping its default gateway IP (192.168.1.1), but cannot ping external IP 8.8.8.8. Where is the failure occurring?', ['In the local laptop network interface card (NIC)', 'Between the home router WAN interface and the Internet Service Provider (ISP)', 'In the laptop web browser software', 'In the local Ethernet cable'], 1, 'Pinging 192.168.1.1 proves local LAN connectivity is healthy; the failure lies at the router WAN/ISP hop.', { 0: 'Local NIC is functioning since local gateway ping succeeded.', 2: 'Ping runs via ICMP in terminal, independent of browser.', 3: 'Wireless Wi-Fi is used, not cable.' }),
        createQ('[HARD] A file of 100 MB is being transferred across a 100 Mbps link with 50ms latency vs a 10 Mbps link with 5ms latency. Which factor limits total completion time for this large bulk transfer?', ['Latency delay', 'Bandwidth throughput capacity', 'MAC address length', 'OSI Layer 7 protocol'], 1, 'For large file transfers, bandwidth (100 Mbps vs 10 Mbps) dominates overall transfer time.', { 0: 'Latency matters for initial round trips, but throughput dominates bulk transfers.', 2: 'MAC address length is fixed at 48 bits.', 3: 'Protocol headers add minimal overhead.' })
      ]
    },

    // 2. NETWORK DEVICES
    {
      slug: 'network-devices',
      title: 'Network Devices',
      tagline: 'Learn about switches, routers, firewalls, hubs, and access points.',
      category: 'Fundamentals',
      description: 'Specialized hardware components that connect, forward, and secure data.',
      level: CourseLevel.BEGINNER,
      icon: 'Cpu',
      estimatedHours: 3,
      lessonTitle: '2. Network Devices',
      lessonSlug: 'network-devices-overview',
      shortExplanation: 'Network devices (switches, routers, firewalls) direct and protect data traffic.',
      theory: `1. WHAT IS IT?\nNetwork devices are specialized hardware units that connect endpoints and route data traffic across networks.\n\n2. WHY DO WE NEED THEM?\nWithout network devices, computers could only connect with a single wire to one other computer. Switches allow local grouping; Routers connect different networks.\n\n3. HOW DOES IT WORK?\n- Hub: Repeats data to EVERY port (outdated).\n- Switch: Reads MAC addresses and sends data ONLY to target port.\n- Router: Reads IP addresses and routes data between different networks.\n- Firewall: Inspects packets and blocks harmful traffic.\n\n4. REAL-WORLD EXAMPLE:\nIn your home, your Wi-Fi Router acts as a router, switch, and firewall all in one box.\n\n5. STEP-BY-STEP DEVICE ACTION:\nLaptop sends frame ➔ Switch reads MAC ➔ Switch forwards to Router port ➔ Router checks IP ➔ Router sends to Internet.\n\n6. WHAT SHOULD YOU REMEMBER?\n- Switch = MAC addresses (Layer 2).\n- Router = IP addresses (Layer 3).`,
      analogy: 'A switch is like a room host directing people by name; a router is an airport traffic controller routing flights between cities.',
      keyConcepts: ['Hub: Broadcasts to all ports indiscriminately.', 'Switch: Unicasts to target MAC port.', 'Router: Connects subnets via IP routing.', 'Firewall: Inspects and filters unauthorized traffic.'],
      practicalActivity: { title: 'Activity: Inspect Your Gateway Router IP', instructions: 'Run `ipconfig` or `netstat -r` and find your Default Gateway IP address.' },
      questions: [
        createQ('[EASY] Which device operates at Layer 3 of the OSI model to connect different networks using IP addresses?', ['Network Switch', 'Router', 'Repeater', 'Ethernet Cable'], 1, 'Routers connect separate subnets by inspecting Layer 3 IP headers.', { 0: 'Switches connect devices within the SAME Layer 2 network.', 2: 'Repeaters regenerate electrical signals at Layer 1.', 3: 'Cables are physical media.' }),
        createQ('[EASY] What table does an Ethernet Switch maintain to determine which port to forward frames to?', ['Routing Table', 'MAC Address Table (CAM Table)', 'DNS Lookup Table', 'DHCP Scope Table'], 1, 'Switches store MAC-to-port mappings in a Content Addressable Memory (CAM) table.', { 0: 'Routers maintain Routing Tables.', 2: 'DNS servers maintain domain records.', 3: 'DHCP servers maintain IP address pools.' }),
        createQ('[MEDIUM] An administrator notices high network congestion on an unmanaged network. Wireshark reveals packets arriving on Port 1 are being sent out of Ports 2, 3, 4, and 5 simultaneously. Which legacy device is causing this behavior?', ['Layer 2 Switch', 'Network Hub', 'Stateful Firewall', 'Wireless Access Point'], 1, 'Hubs repeat incoming bits out of ALL other ports, creating a single shared collision domain.', { 0: 'Switches forward frames only to the specific target port.', 2: 'Firewalls inspect traffic rules.', 3: 'Access points broadcast Wi-Fi frames.' }),
        createQ('[MEDIUM] What is the primary role of a Firewall in a network architecture?', ['To assign IP addresses to new clients', 'To inspect incoming and outgoing traffic and enforce security access control rules', 'To convert analog signals to digital', 'To resolve hostnames to IP addresses'], 1, 'Firewalls filter traffic based on IP, port, protocol, and state rules.', { 0: 'DHCP assigns IP addresses.', 2: 'Modems convert signals.', 3: 'DNS resolves hostnames.' }),
        createQ('[HARD] A layer 2 switch receives a frame with destination MAC `00:1A:2B:3C:4D:5E`. The switch checks its CAM table, but no entry exists for this MAC address. What action does the switch take?', ['It drops the frame immediately', 'It floods the frame out of all ports except the port on which it arrived (Unknown Unicast Flooding)', 'It sends an ICMP destination unreachable message', 'It shuts down the switch port'], 1, 'When a switch encounters an unknown unicast MAC, it floods the frame to ensure the target device receives it and responds.', { 0: 'Dropping would cause communication failure.', 2: 'ICMP is a Layer 3 router response.', 3: 'Ports are not shut down for normal switching.' }),
        createQ('[HARD] A router receives an IP packet on interface FastEthernet0/0. The destination IP is 10.2.0.5. The router checks its routing table and finds no matching subnet route, and no Default Gateway (0.0.0.0/0) is configured. What does the router do?', ['It broadcasts the packet to all ports', 'It drops the packet and returns an ICMP Destination Network Unreachable message to the source', 'It forwards the packet to Google DNS', 'It converts the packet into an ARP request'], 1, 'Without a matching route or default route, a router must drop the packet and send ICMP Unreachable.', { 0: 'Routers do not flood IP packets without routes.', 2: 'Routers cannot forward unroutable traffic to DNS.', 3: 'ARP is used for local LAN destination resolution.' }),
        createQ('[HARD] A network engineer installs a Wireless Access Point (WAP) in an office. Should the WAP be configured in Router mode or Access Point bridge mode if the office already has an enterprise core router and DHCP server?', ['Router mode, to create a double NAT network', 'Access Point bridge mode, to extend the existing Layer 2 broadcast domain and avoid double NAT', 'Hub mode', 'Modem mode'], 1, 'Bridge mode extends the existing single LAN subnet so wireless clients get IPs from the core DHCP server without double NAT.', { 0: 'Double NAT breaks peer-to-peer protocols and incoming connections.', 2: 'Hub mode causes collisions.', 3: 'Modem mode is for ISP line modulation.' }),
        createQ('[HARD] What is a Multilayer Switch (Layer 3 Switch)?', ['A switch that can only connect 3 computers', 'A high-speed switch capable of performing Layer 2 frame switching AND Layer 3 hardware IP routing', 'A switch that uses 3 cables per port', 'A switch with no MAC table'], 1, 'Multilayer switches route IP traffic in hardware ASIC chips at wire-speed across VLANs.', { 0: 'Port capacity is independent of switch layer.', 2: 'Standard RJ-45 cables use 4 pairs.', 3: 'All switches require MAC tables.' })
      ]
    },

    // 3. NETWORK TOPOLOGIES
    {
      slug: 'network-topologies',
      title: 'Network Topologies',
      tagline: 'Explore Star, Mesh, Bus, Ring, and Hybrid network layouts.',
      category: 'Fundamentals',
      description: 'Geometric arrangement and physical/logical layout of network links.',
      level: CourseLevel.BEGINNER,
      icon: 'Layout',
      estimatedHours: 3,
      lessonTitle: '3. Network Topologies',
      lessonSlug: 'network-topologies-overview',
      shortExplanation: 'Topology defines how devices are arranged and connected in a network.',
      theory: `1. WHAT IS IT?\nNetwork topology is the structural layout of connections between devices in a network.\n\n2. WHY DO WE NEED IT?\nChoosing the right topology determines network reliability, speed, redundancy, and cost.\n\n3. HOW DOES IT WORK?\n- Star Topology: All devices connect to a central switch. (Most popular today).\n- Mesh Topology: Every device connects to every other device (High fault tolerance).\n- Bus Topology: All devices share a single backbone cable. (Single point of failure).\n- Ring Topology: Devices connect in a circular loop.\n\n4. REAL-WORLD EXAMPLE:\nYour home or university computer lab uses a Star Topology—all computers plug into a central Ethernet switch or Wi-Fi router.\n\n5. STEP-BY-STEP COMPARISON:\nIf 1 cable breaks in Star: Only 1 PC loses connection.\nIf cable breaks in Bus: Entire network goes down.\n\n6. WHAT SHOULD YOU REMEMBER?\n- Star is standard for modern LANs.\n- Mesh is used for mission-critical WAN links and data centers.`,
      analogy: 'Star is like spokes on a bicycle wheel meeting at the hub; Mesh is like a spiderweb where every thread connects to multiple others.',
      keyConcepts: ['Star: Central switch connection.', 'Mesh: Full redundancy, highest reliability.', 'Bus: Legacy single cable backbone.', 'Ring: Token passing circular loop.'],
      practicalActivity: { title: 'Activity: Sketch Your Home Topology', instructions: 'Identify every phone, TV, and laptop in your house and draw how they connect to your central Wi-Fi router (Star Topology).' },
      questions: [
        createQ('[EASY] Which network topology connects all endpoint computers directly to a single central switch or hub?', ['Bus Topology', 'Star Topology', 'Ring Topology', 'Tree Topology'], 1, 'In Star topology, every host connects via a dedicated point-to-point cable to a central switch.', { 0: 'Bus topology connects devices to a single shared cable.', 2: 'Ring connects devices in a closed loop.', 3: 'Tree combines star and bus hierarchies.' }),
        createQ('[EASY] What is a key advantage of a Full Mesh Topology?', ['It uses the least amount of copper cabling', 'High fault tolerance and maximum redundancy—if one link fails, traffic immediately reroutes', 'It requires zero configuration', 'It is the cheapest network to build'], 1, 'Full mesh provides dedicated redundant links between every pair of nodes.', { 0: 'Full mesh uses the MOST cabling.', 2: 'Mesh requires complex routing configuration.', 3: 'Mesh is expensive due to link count.' }),
        createQ('[MEDIUM] In a legacy Bus Topology network, what occurs if the central coaxial backbone cable is cut in the middle?', ['Only the node closest to the break loses connection', 'The entire network suffers signal reflection, collapsing communication for all nodes', 'Network throughput doubles', 'A backup switch powers on automatically'], 1, 'A cut bus cable destroys termination resistance, causing electrical reflections that disrupt all nodes.', { 0: 'Bus networks lack port isolation.', 2: 'Physical damage never improves performance.', 3: 'Bus networks have no automated failover switches.' }),
        createQ('[MEDIUM] How many physical point-to-point links are required to build a Full Mesh network with 6 nodes?', ['6 links', '12 links', '15 links', '36 links'], 2, 'Using formula N*(N-1)/2: 6 * 5 / 2 = 15 physical links.', { 0: '6 links is Ring or Star.', 1: '12 links is 2 * N.', 3: '36 is N^2.' }),
        createQ('[HARD] A bank design requires 99.999% uptime for connections between 4 regional data centers. Which topology should the network architect select for the WAN links?', ['Bus Topology', 'Full Mesh or Partial Mesh WAN Topology', 'Single Ring Topology', 'Point-to-Point Daisy Chain'], 1, 'Mesh WAN layouts provide multi-path redundancy so single link cuts cause zero outage.', { 0: 'Bus is vulnerable to single cuts.', 2: 'Single Ring fails if 1 link drops without dual-ring.', 3: 'Daisy chain has zero redundancy.' }),
        createQ('[HARD] An enterprise network uses a Hub-and-Spoke WAN topology (Star) connecting 20 branch offices to headquarters. If the Central Hub router interface fails, what is the impact on branch-to-branch communication?', ['Branch offices can still communicate directly', 'All inter-branch communication fails because all traffic must transit the central Hub router', 'Only headquarters loses internet', 'Speed increases by 50%'], 1, 'In Hub-and-Spoke WANs, spokes route through the central hub; hub failure isolates all spokes.', { 0: 'Spokes have no direct mesh tunnels.', 2: 'Branch offices lose connectivity to each other.', 3: 'Failure degrades service.' }),
        createQ('[HARD] In a Dual-Ring FDDI fiber network, what automated mechanism preserves connectivity if a single fiber optic cable is cut?', ['Spanning Tree Protocol', 'Ring Wrap—the dual counter-rotating rings fold back into a single operational loop', 'ARP Poisoning', 'BGP Peering'], 1, 'FDDI dual-ring networks perform Ring Wrap to maintain a single continuous loop during a cable break.', { 0: 'STP is for Ethernet switching.', 2: 'ARP is address resolution.', 3: 'BGP is Internet routing.' }),
        createQ('[HARD] What is a Star-Bus Hybrid Topology?', ['A solar-powered wireless network', 'Multiple Star-topology switch clusters connected together along a central Bus backbone', 'A network running inside a moving bus', 'A topology with no cables'], 1, 'Star-Bus combines local Star switch clusters connected via a high-speed trunk backbone.', { 0: 'Power source is unrelated.', 2: 'Vehicle networking is mobile wireless.', 3: 'Cables are used in Star-Bus.' })
      ]
    },

    // 4. OSI MODEL
    {
      slug: 'osi-model',
      title: 'OSI Model',
      tagline: 'Master the 7-layer framework: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      category: 'Fundamentals',
      description: 'The standard 7-layer theoretical architectural framework for networking.',
      level: CourseLevel.BEGINNER,
      icon: 'Layers',
      estimatedHours: 4,
      lessonTitle: '4. The 7 Layers of the OSI Model',
      lessonSlug: 'osi-model-7-layers',
      shortExplanation: 'The OSI model divides network communication into 7 distinct functional layers.',
      theory: `1. WHAT IS IT?\nThe Open Systems Interconnection (OSI) model is a 7-layer theoretical framework created by ISO to standardize network communication.\n\n2. WHY DO WE NEED IT?\nIt breaks complex networking into 7 smaller layers so hardware and software from different vendors can work together seamlessly.\n\n3. HOW DOES IT WORK?\nLayer 7: Application (HTTP, DNS, FTP - User apps)\nLayer 6: Presentation (Formatting, Encryption, Compression)\nLayer 5: Session (Manages connection sessions)\nLayer 4: Transport (TCP/UDP, Ports, Error checking)\nLayer 3: Network (IP Addresses, Routers, Routing)\nLayer 2: Data Link (MAC Addresses, Switches, Ethernet Frames)\nLayer 1: Physical (Bits, Cables, Radio Frequencies)\n\n4. REAL-WORLD EXAMPLE:\nMnemonic: "Please Do Not Touch Steve's Pet Alligator" (Physical ➔ Data Link ➔ Network ➔ Transport ➔ Session ➔ Presentation ➔ Application).\n\n5. STEP-BY-STEP ENCAPSULATION:\nSender: L7 Data ➔ L4 Segment ➔ L3 Packet ➔ L2 Frame ➔ L1 Bits across cable.\n\n6. WHAT SHOULD YOU REMEMBER?\n- L3 = IP addresses & Routers.\n- L2 = MAC addresses & Switches.\n- L4 = TCP/UDP & Port numbers.`,
      analogy: 'Packing a gift: Putting item in box (L7-L5), addressing label (L4-L3), placing in shipping crate (L2), loading onto truck (L1).',
      keyConcepts: ['Layer 7 Application: User interface & web protocols.', 'Layer 4 Transport: Port numbers & end-to-end delivery.', 'Layer 3 Network: Logical IP routing.', 'Layer 2 Data Link: Physical MAC framing.'],
      practicalActivity: { title: 'Activity: Memory Recall Quiz', instructions: 'Write down all 7 layers from Layer 1 (Physical) to Layer 7 (Application) without looking!' },
      questions: [
        createQ('[EASY] Which layer of the OSI model manages logical IP addressing and packet routing across networks?', ['Layer 1 Physical', 'Layer 2 Data Link', 'Layer 3 Network', 'Layer 7 Application'], 2, 'Layer 3 (Network Layer) is responsible for logical IP addressing and path routing.', { 0: 'Layer 1 manages bits and physical cables.', 1: 'Layer 2 manages MAC addresses and frames.', 3: 'Layer 7 provides user software interfaces.' }),
        createQ('[EASY] What Protocol Data Unit (PDU) is associated with Layer 2 of the OSI model?', ['Bit', 'Frame', 'Packet', 'Segment'], 1, 'Layer 2 PDU is a Frame (contains MAC headers).', { 0: 'Bit is Layer 1.', 2: 'Packet is Layer 3.', 3: 'Segment is Layer 4.' }),
        createQ('[MEDIUM] As data moves DOWN the OSI stack from Layer 7 to Layer 1 during transmission, what process wraps data with layer headers?', ['Decapsulation', 'Encapsulation', 'De-duplication', 'De-fragmentation'], 1, 'Encapsulation prepends protocol headers at each descending layer.', { 0: 'Decapsulation strips headers as data ascends at the receiver.', 2: 'Deduplication removes identical files.', 3: 'De-fragmentation reorganizes disk blocks.' }),
        createQ('[MEDIUM] Which OSI layer handles SSL/TLS encryption, data compression, and character code translation (e.g. ASCII, JPEG)?', ['Layer 3 Network', 'Layer 4 Transport', 'Layer 6 Presentation', 'Layer 7 Application'], 2, 'Layer 6 (Presentation) formats, encrypts, and compresses application payload data.', { 0: 'Layer 3 routes IP packets.', 1: 'Layer 4 handles TCP/UDP ports.', 3: 'Layer 7 provides user application protocols.' }),
        createQ('[HARD] A network technician suspects a broken copper wire inside an Ethernet cable. At which OSI layer is this physical fault occurring?', ['Layer 1 Physical', 'Layer 3 Network', 'Layer 4 Transport', 'Layer 7 Application'], 0, 'Physical wire damage, bad pins, or signal attenuation occur at Layer 1 (Physical).', { 1: 'Layer 3 is logical IP addressing.', 2: 'Layer 4 is transport sockets.', 3: 'Layer 7 is application software.' }),
        createQ('[HARD] A client application sends a TCP segment with Destination Port 80. At which OSI layer is the port number processed to direct traffic to the correct web server process?', ['Layer 2 Data Link', 'Layer 3 Network', 'Layer 4 Transport', 'Layer 6 Presentation'], 2, 'Layer 4 (Transport Layer) uses port numbers to multiplex process sockets.', { 0: 'Layer 2 uses MAC addresses.', 1: 'Layer 3 uses IP addresses.', 3: 'Layer 6 formats data payloads.' }),
        createQ('[HARD] A user opens a browser and types a website address. During decapsulation at the destination server, in what exact order are protocol headers removed?', ['Frame ➔ Packet ➔ Segment ➔ Application Data', 'Application Data ➔ Segment ➔ Packet ➔ Frame', 'Packet ➔ Frame ➔ Segment ➔ Bit', 'Segment ➔ Packet ➔ Bit ➔ Frame'], 0, 'Receiving decapsulation ascends from L2 Frame header ➔ L3 Packet header ➔ L4 Segment header ➔ L7 Data payload.', { 1: 'This order describes sending encapsulation downward.', 2: 'Bits are read before frames.', 3: 'Segment is L4, Packet is L3.' }),
        createQ('[HARD] Why is the 7-layer OSI model classified as a "Reference Model" rather than a strict implementation protocol?', ['Because OSI is copyrighted', 'Because real networks implement the 4-layer TCP/IP suite, but OSI provides a universal conceptual framework for network engineering', 'Because OSI only supports wireless networks', 'Because OSI requires 7 separate physical network cables'], 1, 'OSI is a conceptual reference framework; actual protocol software follows the 4-layer TCP/IP stack.', { 0: 'ISO standards are open standards.', 2: 'OSI applies to wired and wireless.', 3: 'OSI layers are software abstractions.' })
      ]
    },

    // 5. TCP/IP MODEL
    {
      slug: 'tcp-ip-model',
      title: 'TCP/IP Model',
      tagline: 'Understand the 4-layer practical internet architecture model.',
      category: 'Fundamentals',
      description: 'The real-world protocol stack powering the global Internet.',
      level: CourseLevel.BEGINNER,
      icon: 'Network',
      estimatedHours: 3,
      lessonTitle: '5. The 4-Layer TCP/IP Suite',
      lessonSlug: 'tcp-ip-4-layers',
      shortExplanation: 'The TCP/IP model simplifies network architecture into 4 practical layers.',
      theory: `1. WHAT IS IT?\nThe TCP/IP model is the practical 4-layer architecture actually implemented on the Internet.\n\n2. WHY DO WE NEED IT?\nWhile the OSI model is theoretical, TCP/IP is the real protocol suite running in software kernels across every computer today.\n\n3. HOW DOES IT WORK?\nLayer 4: Application Layer (HTTP, DNS, SSH, FTP)\nLayer 3: Transport Layer (TCP, UDP)\nLayer 2: Internet Layer (IP, ICMP, ARP)\nLayer 1: Network Access / Link Layer (Ethernet, Wi-Fi)\n\n4. REAL-WORLD EXAMPLE:\nWhen you load a web page, your browser sends HTTP data (L4 Application), wrapped in TCP (L3 Transport), wrapped in IP (L2 Internet), transmitted over Ethernet (L1 Network Access).\n\n5. STEP-BY-STEP COMPARISON:\nOSI 7 Layers maps into TCP/IP 4 Layers:\n- OSI 7,6,5 ➔ TCP/IP Application\n- OSI 4 ➔ TCP/IP Transport\n- OSI 3 ➔ TCP/IP Internet\n- OSI 2,1 ➔ TCP/IP Network Access\n\n6. WHAT SHOULD YOU REMEMBER?\n- TCP/IP Internet Layer = OSI Network Layer (IP Addressing).\n- TCP/IP is the practical foundation of the World Wide Web.`,
      analogy: 'OSI is a 7-step theoretical recipe book; TCP/IP is the 4-step fast recipe real chefs use in busy kitchens.',
      keyConcepts: ['Application (L4): User protocols (HTTP, DNS).', 'Transport (L3): TCP/UDP ports.', 'Internet (L2): IP addressing & routing.', 'Network Access (L1): Ethernet & Wi-Fi hardware.'],
      practicalActivity: { title: 'Activity: Compare OSI vs TCP/IP Layers', instructions: 'Map out on paper how OSI Layers 5, 6, and 7 combine into the single TCP/IP Application Layer.' },
      questions: [
        createQ('[EASY] How many functional layers make up the classic TCP/IP protocol suite?', ['3 Layers', '4 Layers', '7 Layers', '10 Layers'], 1, 'The classic TCP/IP architecture consists of 4 layers (Network Access, Internet, Transport, Application).', { 0: '3 layers is incomplete.', 2: '7 layers is the OSI reference model.', 3: '10 layers is invalid.' }),
        createQ('[EASY] Which protocol operates at the Internet Layer of the TCP/IP model?', ['HTTP', 'IP (Internet Protocol)', 'TCP', 'Ethernet'], 1, 'IP (Internet Protocol) handles logical addressing and packet routing at the Internet Layer.', { 0: 'HTTP is Application layer.', 2: 'TCP is Transport layer.', 3: 'Ethernet is Network Access layer.' }),
        createQ('[MEDIUM] Which layers of the 7-layer OSI model are combined into the single Application Layer of the TCP/IP model?', ['Layers 1, 2, and 3', 'Layers 3 and 4', 'Layers 5 (Session), 6 (Presentation), and 7 (Application)', 'Layers 1 and 7'], 2, 'TCP/IP merges OSI Session, Presentation, and Application layers into one high-level Application layer.', { 0: 'OSI 1, 2, 3 correspond to Network Access and Internet.', 1: 'OSI 3 and 4 are Internet and Transport.', 3: 'OSI 1 is Physical.' }),
        createQ('[MEDIUM] What is the primary role of the Transport Layer in the TCP/IP model?', ['To convert electrical signals into light', 'To manage end-to-end process communication using TCP or UDP ports', 'To map domain names to MAC addresses', 'To route packets across satellite links'], 1, 'The Transport Layer provides host-to-host process communication using port sockets.', { 0: 'Fiber transceivers convert signals.', 2: 'DNS maps domains; ARP maps IPs to MACs.', 3: 'Internet layer handles path routing.' }),
        createQ('[HARD] A ping command returns `Destination Host Unreachable`. At which layer of the TCP/IP model is ICMP operating to report this diagnostic message?', ['Network Access Layer', 'Internet Layer', 'Transport Layer', 'Application Layer'], 1, 'ICMP (Internet Control Message Protocol) operates alongside IP at the Internet Layer.', { 0: 'Network Access handles frame delivery.', 2: 'Transport handles TCP/UDP.', 3: 'Application handles HTTP/DNS.' }),
        createQ('[HARD] A developer creates a custom socket application using standard TCP. At which layer of the TCP/IP stack does the operating system kernel handle sequence numbers and acknowledgements for this socket?', ['Application Layer', 'Transport Layer', 'Internet Layer', 'Network Access Layer'], 1, 'The OS kernel transport stack manages TCP sequence numbers, ACKs, and sliding windows at the Transport layer.', { 0: 'Application layer creates payload bytes.', 2: 'Internet layer handles IP routing.', 3: 'Network Access handles MAC frames.' }),
        createQ('[HARD] Why is TCP/IP called a "protocol suite" rather than a single protocol?', ['Because it requires 10 different computers to run', 'Because it comprises a collection of specialized protocols (IP, TCP, UDP, ICMP, ARP, HTTP) working together across layers', 'Because it was created by a software company called Suite', 'Because it only runs on Linux'], 1, 'TCP/IP is a suite of complementary protocols operating across distinct functional layers.', { 0: 'Suite refers to protocol collection.', 2: 'TCP/IP was developed by DARPA.', 3: 'TCP/IP runs on all operating systems.' }),
        createQ('[HARD] What happens during encapsulation when an HTTP GET request is prepared for physical transmission in TCP/IP?', ['HTTP header ➔ TCP header ➔ IP header ➔ Ethernet Frame header/trailer ➔ Bits', 'Ethernet header ➔ IP header ➔ TCP header ➔ HTTP header', 'Bits ➔ Frame ➔ IP ➔ TCP', 'IP header ➔ HTTP header ➔ TCP header'], 0, 'Encapsulation descends: L4 App (HTTP) ➔ L3 Transport (TCP) ➔ L2 Internet (IP) ➔ L1 Network Access (Ethernet) ➔ Bits.', { 1: 'This reverses top-down encapsulation order.', 2: 'Bits are physical signals sent last.', 3: 'TCP header comes before IP header in encapsulation.' })
      ]
    },

    // 6. ETHERNET
    {
      slug: 'ethernet',
      title: 'Ethernet & Physical Media',
      tagline: 'Understand IEEE 802.3, copper twisted-pair cables, fiber optics, and frames.',
      category: 'Core Protocols',
      description: 'The fundamental Layer 2 technology connecting devices across wired LANs.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Cpu',
      estimatedHours: 4,
      lessonTitle: '6. Ethernet Standards & Framing',
      lessonSlug: 'ethernet-standards-framing',
      shortExplanation: 'Ethernet (IEEE 802.3) defines wired LAN framing and copper/fiber cabling specs.',
      theory: `1. WHAT IS IT?\nEthernet (IEEE 802.3) is the most widely deployed wired local area network (LAN) protocol standard.\n\n2. WHY DO WE NEED IT?\nIt defines standard frame formats, cable pinouts (RJ-45), and copper/fiber speeds (1 Gbps, 10 Gbps).\n\n3. HOW DOES IT WORK?\nAn Ethernet Frame wraps IP packets with a Preamble, Destination MAC, Source MAC, EtherType (e.g. 0x0800 for IPv4), Payload, and Frame Check Sequence (FCS CRC).\n\n4. REAL-WORLD EXAMPLE:\nPlugging an RJ-45 Cat6 Ethernet cable into your desktop PC connects you to an Ethernet switch at 1 Gbps speed.\n\n5. STEP-BY-STEP ETHERNET FRAME STRUCTURE:\nPreamble (7 bytes) ➔ SFD (1 byte) ➔ Dst MAC (6 bytes) ➔ Src MAC (6 bytes) ➔ EtherType (2 bytes) ➔ Data Payload (46-1500 bytes) ➔ FCS (4 bytes).\n\n6. WHAT SHOULD YOU REMEMBER?\n- Maximum Transmission Unit (MTU) standard is 1500 bytes.\n- Category 6 (Cat6) supports 10 Gbps up to 55 meters.`,
      analogy: 'Like a standardized cargo shipping container: every container has fixed length locks, origin/destination stencils, and weight limits.',
      keyConcepts: ['IEEE 802.3: Ethernet standard.', 'MTU: 1500-byte default payload maximum.', 'EtherType: Identifies encapsulated L3 protocol (IPv4 vs IPv6).', 'FCS (CRC): Detects corrupted bits.'],
      practicalActivity: { title: 'Activity: Inspect Ethernet Adapter Properties', instructions: 'Open Network Connections on your OS and check if your link speed is 1000 Mbps (1 Gbps) Full Duplex.' },
      questions: [
        createQ('[EASY] What IEEE standard governs Ethernet wired network specifications?', ['IEEE 802.11', 'IEEE 802.3', 'IEEE 802.15', 'IEEE 802.1X'], 1, 'IEEE 802.3 defines wired Ethernet standards.', { 0: '802.11 defines Wi-Fi.', 2: '802.15 defines Bluetooth.', 3: '802.1X defines Port-based authentication.' }),
        createQ('[EASY] What is the standard Maximum Transmission Unit (MTU) payload size for an Ethernet frame?', ['512 bytes', '1500 bytes', '9000 bytes', '65535 bytes'], 1, 'Standard Ethernet MTU payload capacity is 1500 bytes.', { 0: '512 bytes is too small.', 2: '9000 bytes is a Jumbo frame.', 3: '65535 bytes is maximum IPv4 packet size.' }),
        createQ('[MEDIUM] What is the function of the Frame Check Sequence (FCS) field located in an Ethernet frame trailer?', ['To store destination IP address', 'To detect bit-level transmission corruption using a Cyclic Redundancy Check (CRC)', 'To assign VLAN tags', 'To encrypt data payloads'], 1, 'FCS contains a 4-byte CRC value calculated by the sender to verify frame integrity on arrival.', { 0: 'Destination IP is in Layer 3 packet header.', 2: '802.1Q tags VLANs.', 3: 'FCS performs error detection, not encryption.' }),
        createQ('[MEDIUM] What does EtherType value `0x0806` signify inside an Ethernet frame header?', ['IPv4 Packet Payload', 'IPv6 Packet Payload', 'ARP Protocol Payload', 'VLAN Tag'], 2, 'EtherType 0x0806 indicates that the frame payload contains an Address Resolution Protocol (ARP) message.', { 0: '0x0800 indicates IPv4.', 1: '0x86DD indicates IPv6.', 3: '0x8100 indicates 802.1Q VLAN tag.' }),
        createQ('[HARD] A network technician runs a Cat5e copper cable 140 meters between two switches. Devices experience intermittent dropouts and high frame corruption rates. What physical limit is being violated?', ['The maximum 100-meter distance limit for Ethernet over copper twisted-pair cabling', 'The maximum 10-meter limit', 'The VLAN limit', 'The MAC address limit'], 0, 'Standard copper twisted-pair Ethernet (100BASE-TX / 1000BASE-T) has a maximum physical run limit of 100 meters (328 feet).', { 1: '100m is the copper standard limit.', 2: 'VLANs are software configurations.', 3: 'MAC address limits do not cause cable attenuation.' }),
        createQ('[HARD] An engineer needs to connect two switches separated by 2 kilometers across a university campus. Which transmission medium must be selected?', ['Cat6a UTP Copper cable', 'Single-Mode Fiber Optic cable (SMF)', 'Cat5e STP Copper cable', 'Coaxial RG-6 cable'], 1, 'Single-Mode Fiber Optic (SMF) uses laser light to carry 10 Gbps+ signals over many kilometers without attenuation.', { 0: 'Cat6a is limited to 100 meters.', 2: 'Cat5e is limited to 100 meters.', 3: 'Coax cannot support multi-gigabit campus backbone distances.' }),
        createQ('[HARD] What is CSMA/CD (Carrier Sense Multiple Access with Collision Detection)?', ['A wireless encryption protocol', 'A media access control method used in legacy Half-Duplex Ethernet to listen to the wire and handle packet collisions', 'A routing algorithm used by routers', 'A DNS record type'], 1, 'CSMA/CD allowed legacy half-duplex nodes to detect collisions and back off using a random timer.', { 0: 'WPA3 encrypts wireless.', 2: 'OSPF is a routing algorithm.', 3: 'A Record is a DNS type.' }),
        createQ('[HARD] Why do modern full-duplex Ethernet switches eliminate the need for CSMA/CD collision handling?', ['Because switches use separate physical wire pairs for transmitting and receiving data simultaneously', 'Because switches use higher voltage', 'Because switches use wireless radio waves', 'Because CSMA/CD is mandatory by law'], 0, 'Full-duplex dedicated switch links separate RX and TX channels, making collisions physically impossible.', { 1: 'Voltage level does not eliminate collisions.', 2: 'Switches use copper/fiber cables.', 3: 'CSMA/CD is disabled in full-duplex mode.' })
      ]
    },

    // 7. MAC ADDRESSES
    {
      slug: 'mac-addresses',
      title: 'MAC Addresses',
      tagline: 'Understand 48-bit physical media access control addresses.',
      category: 'Core Protocols',
      description: 'The unchangeable hardware address burned into every Network Interface Card (NIC).',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Cpu',
      estimatedHours: 3,
      lessonTitle: '7. Physical MAC Addressing',
      lessonSlug: 'mac-addressing-structure',
      shortExplanation: 'A MAC address is a 48-bit (6-byte) unique hardware identifier assigned to a network card.',
      theory: `1. WHAT IS IT?\nA MAC (Media Access Control) address is a permanent 48-bit (6-byte) physical hardware address burned into a network card (NIC) by its manufacturer.\n\n2. WHY DO WE NEED IT?\nIP addresses can change whenever you move networks, but MAC addresses provide a fixed hardware identity for local Layer 2 frame delivery.\n\n3. HOW DOES IT WORK?\nA MAC address is written in hexadecimal notation: e.g. \`00:1A:2B:3C:4D:5E\`.\n- First 24 bits (3 bytes): OUI (Organizational Unique Identifier - Manufacturer Code like Intel or Apple).\n- Last 24 bits (3 bytes): NIC Serial Number assigned by vendor.\n\n4. REAL-WORLD EXAMPLE:\nLike your SSN or Fingerprint vs your Home Postal Address. Your IP address is where you live today; your MAC address is who you permanently are.\n\n5. BROADCAST MAC ADDRESS:\n\`FF:FF:FF:FF:FF:FF\` sends a frame to every single device on the local LAN.\n\n6. WHAT SHOULD YOU REMEMBER?\n- MAC = Layer 2 (Data Link).\n- IP = Layer 3 (Network).`,
      analogy: 'Your MAC address is your permanent fingerprint; your IP address is your temporary room number at a hotel.',
      keyConcepts: ['48-bit Hexadecimal notation.', 'OUI: First 24 bits vendor code.', 'NIC Serial: Last 24 bits unique ID.', 'Broadcast MAC: FF:FF:FF:FF:FF:FF.'],
      practicalActivity: { title: 'Activity: Find Your Physical MAC Address', instructions: 'Run `getmac` (Windows) or `ifconfig` (Linux/Mac) to view your physical network interface MAC address.' },
      questions: [
        createQ('[EASY] How many total bits make up a standard physical MAC address?', ['32 bits', '48 bits', '64 bits', '128 bits'], 1, 'MAC addresses consist of 48 bits (6 hexadecimal octet pairs).', { 0: '32 bits is an IPv4 address.', 2: '64 bits is EUI-64.', 3: '128 bits is an IPv6 address.' }),
        createQ('[EASY] What do the first 24 bits (3 bytes) of a MAC address represent?', ['The host serial number', 'The Organizational Unique Identifier (OUI) assigned to the hardware manufacturer', 'The default gateway IP address', 'The VLAN ID'], 1, 'The OUI identifies the vendor (e.g. Cisco, Apple, Intel) that manufactured the NIC.', { 0: 'The last 24 bits represent the NIC serial number.', 2: 'Gateway IP is Layer 3.', 3: 'VLAN ID is 12 bits.' }),
        createQ('[MEDIUM] What is the universal Layer 2 Broadcast MAC address format?', ['00:00:00:00:00:00', '127.0.0.1', 'FF:FF:FF:FF:FF:FF', '255.255.255.255'], 2, 'FF:FF:FF:FF:FF:FF (all 48 bits set to binary 1) directs a frame to all nodes on a Layer 2 LAN.', { 0: 'All zeros is unassigned.', 1: '127.0.0.1 is IPv4 loopback.', 3: '255.255.255.255 is Layer 3 IPv4 broadcast.' }),
        createQ('[MEDIUM] An administrator inspects a network card MAC address `00:0C:29:4A:8B:1C`. Which portion identifies the specific hardware vendor code?', ['00:0C:29', '4A:8B:1C', '00:0C', '8B:1C'], 0, 'The first three bytes (`00:0C:29`) form the vendor OUI.', { 1: '`4A:8B:1C` is the vendor-assigned NIC interface ID.', 2: 'OUI is 3 bytes, not 2.', 3: '`8B:1C` is the final two bytes.' }),
        createQ('[HARD] A hacker uses MAC Spoofing software to clone the MAC address of an authorized company IP phone. What immediate issue occurs on the local Ethernet switch?', ['The switch burns out', 'MAC Address Table Flapping (CAM Flapping), causing frames to bounce between ports and degrading connectivity', 'IP addresses expand to 128 bits', 'Wi-Fi signals stop completely'], 1, 'Duplicate MAC addresses cause CAM flapping as the switch rapidly updates its table entry between ports.', { 0: 'Switches suffer software table flapping, not physical burnout.', 2: 'IP address bit length is unchanged.', 3: 'Wired CAM flapping affects switch port forwarding.' }),
        createQ('[HARD] How does a host determine if a destination IPv4 address is on its local subnet or a remote network, dictating whether it ARPs for the destination MAC or gateway MAC?', ['By comparing its own IP and subnet mask against the destination IP using bitwise AND operations', 'By asking the DNS server', 'By pinging 127.0.0.1', 'By checking cable color'], 0, 'A host performs bitwise AND calculation of (Local IP & Mask) vs (Dest IP & Mask); matching results indicate local LAN.', { 1: 'DNS returns IP addresses, not local subnet boundaries.', 2: 'Ping 127.0.0.1 tests local stack.', 3: 'Cable color is physical.' }),
        createQ('[HARD] Why are MAC addresses necessary at Layer 2 if devices already have Layer 3 IP addresses?', ['Because IP addresses change dynamically across subnets, while MAC addresses provide local physical framing destination control on Ethernet networks', 'Because MAC addresses are encrypted', 'Because IP addresses only work on wireless', 'Because MAC addresses replace routers'], 0, 'Layer 2 MAC framing handles physical hop-by-hop delivery across local media; Layer 3 IP handles end-to-end global routing.', { 1: 'MAC addresses are clear hex values in frame headers.', 2: 'IP works on wired and wireless.', 3: 'Routers are required for Layer 3 inter-subnet forwarding.' }),
        createQ('[HARD] What is a Multicast MAC address range prefix in IPv4 Ethernet networks?', ['`01:00:5E:xx:xx:xx`', '`FF:FF:FF:xx:xx:xx`', '`00:00:00:xx:xx:xx`', '`192.168.1.x`'], 0, 'IPv4 multicast frames map to destination MAC addresses starting with `01:00:5E`.', { 1: 'FF:FF:FF is broadcast.', 2: '00:00:00 is invalid.', 3: '192.168.1.x is IPv4 decimal string.' })
      ]
    },

    // 8. ARP
    {
      slug: 'arp',
      title: 'ARP (Address Resolution Protocol)',
      tagline: 'Translate Layer 3 IP addresses to Layer 2 MAC addresses.',
      category: 'Core Protocols',
      description: 'The critical glue binding IP network routing to local Ethernet hardware transmission.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Radio',
      estimatedHours: 3,
      lessonTitle: '8. Address Resolution Protocol',
      lessonSlug: 'arp-protocol-mechanics',
      shortExplanation: 'ARP resolves a known IP address to an unknown MAC address on a local network.',
      theory: `1. WHAT IS IT?\nAddress Resolution Protocol (ARP) translates a known Layer 3 IP address (e.g. 192.168.1.50) into a Layer 2 MAC address (e.g. 44:55:66:77:88:99).\n\n2. WHY DO WE NEED IT?\nYour computer knows the target IP address it wants to contact, but Ethernet switches can only deliver frames using MAC addresses.\n\n3. HOW DOES IT WORK?\n- ARP Request: Broadcast ("Who has 192.168.1.50? Tell 192.168.1.10!")\n- ARP Reply: Unicast ("192.168.1.50 is at 44:55:66:77:88:99!")\n\n4. REAL-WORLD EXAMPLE:\nLaptop shouts in a crowded room: "Who has IP 192.168.1.50?" Printer replies directly: "I am 192.168.1.50, here is my MAC address!"\n\n5. STEP-BY-STEP FLOW:\nStep 1: Check local ARP Cache (\`arp -a\`).\nStep 2: If missing, send ARP Broadcast.\nStep 3: Target owner replies with Unicast ARP Reply.\nStep 4: Save mapping into ARP Cache table for 2-10 minutes.\n\n6. WHAT SHOULD YOU REMEMBER?\n- ARP Request = Broadcast (\`FF:FF:FF:FF:FF:FF\`).\n- ARP Reply = Unicast directly to requester MAC.`,
      analogy: 'Calling out in a classroom: "Who is Alex Rivers?" Alex stands up and replies: "I am Alex, here is my seat location."',
      keyConcepts: ['ARP Request: L2 Broadcast.', 'ARP Reply: L2 Unicast.', 'ARP Cache: Local RAM table storing IP-to-MAC mappings.', 'ARP Poisoning: Security threat sending fake ARP replies.'],
      practicalActivity: { title: 'Activity: Display Your OS ARP Cache', instructions: 'Open terminal and type `arp -a` to view all IP-to-MAC address pairs stored in your computer RAM cache.' },
      questions: [
        createQ('[EASY] A workstation needs to communicate with another host on its local IPv4 network but only knows the destination IP address. Which protocol resolves the IP address to a MAC address?', ['ARP (Address Resolution Protocol)', 'DNS (Domain Name System)', 'RTSP (Real-Time Streaming Protocol)', 'ICMP (Internet Control Message Protocol)'], 0, 'ARP resolves a known Layer 3 IPv4 address to an unknown Layer 2 MAC address.', { 1: 'DNS resolves domain names to IP addresses.', 2: 'RTSP controls streaming media.', 3: 'ICMP sends diagnostic ping/error messages.' }),
        createQ('[EASY] What type of transmission is an initial ARP Request message?', ['Layer 2 Unicast', 'Layer 2 Broadcast (sent to FF:FF:FF:FF:FF:FF)', 'Layer 3 Multicast', 'WAN Routing'], 1, 'ARP Requests are broadcast so every host on the local LAN receives the inquiry.', { 0: 'The requester does not know the target MAC yet, so unicast is impossible.', 2: 'Multicast is sent to selective subscriber groups.', 3: 'ARP requests do not cross Layer 3 WAN boundaries.' }),
        createQ('[MEDIUM] What type of transmission is an ARP Reply message returned by the target host?', ['Layer 2 Broadcast', 'Layer 2 Unicast directly to the requesting host MAC address', 'DNS Lookup', 'Default Gateway routing'], 1, 'The target node replies via Unicast because it learned the requester MAC address from the incoming request.', { 0: 'Broadcasting replies would waste LAN bandwidth.', 2: 'DNS is unrelated to ARP replies.', 3: 'Local ARP replies do not route through a gateway.' }),
        createQ('[MEDIUM] Where does an operating system cache recently resolved IP-to-MAC address mappings to prevent broadcasting ARP requests for every single packet?', ['On the hard drive', 'In the local ARP Cache (RAM memory)', 'On the ISP DNS Server', 'In the BIOS chip'], 1, 'The OS maintains an ARP Cache table in RAM memory for fast lookup.', { 0: 'Hard drive storage is too slow for packet processing.', 2: 'ISP DNS servers store domain records.', 3: 'BIOS handles motherboard initialization.' }),
        createQ('[HARD] Host A (192.168.1.10/24) wants to send a packet to Host B (172.16.0.50/16). Which device MAC address will Host A request via ARP?', ['Host B MAC address (172.16.0.50)', 'Host A Default Gateway Router MAC address', 'Google DNS MAC address', 'The Switch management MAC'], 1, 'Because Host B is on a remote subnet, Host A must ARP for its local Default Gateway Router MAC address.', { 0: 'Host A cannot ARP for a remote host across a Layer 3 router boundary.', 2: 'Google DNS is outside the local broadcast domain.', 3: 'Switches forward frames transparently without acting as gateways.' }),
        createQ('[HARD] An attacker sends unsolicited ARP Reply messages to a victim computer claiming that the Gateway IP `192.168.1.1` is associated with the attacker MAC address `AA:BB:CC:11:22:33`. What cyber attack is being executed?', ['DNS Amplification', 'ARP Poisoning / ARP Spoofing (Man-in-the-Middle)', 'SQL Injection', 'SYN Flood'], 1, 'ARP Poisoning tricks victim hosts into sending all outbound traffic through the attacker machine.', { 0: 'DNS amplification floods DNS resolvers.', 2: 'SQL injection exploits databases.', 3: 'SYN flood attacks TCP handshakes.' }),
        createQ('[HARD] What feature on modern managed switches mitigates ARP Poisoning by inspecting ARP packets against trusted DHCP bindings?', ['Dynamic ARP Inspection (DAI)', 'Spanning Tree Protocol (STP)', 'VLAN Tagging (802.1Q)', 'Port Fast'], 0, 'Dynamic ARP Inspection (DAI) drops invalid/spoofed ARP replies that contradict the DHCP snooping table.', { 1: 'STP prevents L2 switching loops.', 2: '802.1Q tags VLANs.', 3: 'PortFast speeds up STP port transition.' }),
        createQ('[HARD] What equivalent protocol replaces ARP in IPv6 networks?', ['ARPv6', 'Neighbor Discovery Protocol (NDP via ICMPv6)', 'DHCPv6 only', 'RARP'], 1, 'IPv6 uses Neighbor Discovery Protocol (NDP) utilizing ICMPv6 multicast messages instead of ARP broadcasts.', { 0: 'ARPv6 does not exist.', 2: 'DHCPv6 provisions IP settings, not L2 resolution.', 3: 'RARP is legacy reverse ARP.' })
      ]
    },

    // 9. IPV4
    {
      slug: 'ipv4',
      title: 'IPv4 Addressing',
      tagline: 'Understand 32-bit dotted-decimal IP addresses, classes, and private ranges.',
      category: 'Core Protocols',
      description: 'The core network layer addressing system powering internet routing.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Network',
      estimatedHours: 4,
      lessonTitle: '9. IPv4 Structure & Private Address Space',
      lessonSlug: 'ipv4-structure-private-space',
      shortExplanation: 'IPv4 uses 32-bit logical addresses written in 4 dotted-decimal octets (e.g. 192.168.1.1).',
      theory: `1. WHAT IS IT?\nIPv4 (Internet Protocol Version 4) is a 32-bit logical address system used to uniquely identify devices on a network.\n\n2. WHY DO WE NEED IT?\nWhile MAC addresses operate locally on Layer 2, IPv4 addresses allow routers to forward packets globally across Layer 3 networks.\n\n3. HOW DOES IT WORK?\nAn IPv4 address consists of 4 octets (8 bits each = 32 bits total), written as: \`192.168.1.100\`.\nTotal theoretical addresses: ~4.3 Billion (\`2^32\`).\n\n4. PRIVATE IP RANGES (RFC 1918):\nPrivate IPs cannot be routed on the public Internet; they are reserved for local LANs:\n- Class A: \`10.0.0.0\` to \`10.255.255.255\`\n- Class B: \`172.16.0.0\` to \`172.31.255.255\`\n- Class C: \`192.168.0.0\` to \`192.168.255.255\`\n\n5. SPECIAL ADDRESSES:\n- Loopback: \`127.0.0.1\` (localhost - test your own network stack).\n- APIPA: \`169.254.x.x\` (Auto-assigned when DHCP fails).\n\n6. WHAT SHOULD YOU REMEMBER?\n- IPv4 = 32 bits.\n- Private IPs (192.168.x.x, 10.x.x.x) require NAT to access the public Internet.`,
      analogy: 'Public IP is your street address reachable by the world; Private IP is an internal extension number inside an office building.',
      keyConcepts: ['32-bit address space (~4.3 Billion total).', 'Dotted-Decimal notation (4 octets).', 'RFC 1918 Private Ranges (10.x, 172.16-31.x, 192.168.x).', 'Loopback 127.0.0.1 & APIPA 169.254.x.x.'],
      practicalActivity: { title: 'Activity: Ping Your Local Loopback', instructions: 'Run `ping 127.0.0.1` in your terminal to confirm your operating system TCP/IP stack is working properly.' },
      questions: [
        createQ('[EASY] How many total bits form a standard IPv4 address?', ['16 bits', '32 bits', '64 bits', '128 bits'], 1, 'An IPv4 address contains 32 bits divided into four 8-bit octets.', { 0: '16 bits is port range.', 2: '64 bits is EUI-64.', 3: '128 bits is IPv6.' }),
        createQ('[EASY] Which of the following IP address ranges is reserved for Private local networks under RFC 1918?', ['8.8.8.0 /24', '192.168.0.0 /16', '1.1.1.0 /24', '200.100.50.0 /24'], 1, '192.168.0.0/16 is an RFC 1918 private IPv4 block.', { 0: '8.8.8.8 is Google public DNS.', 2: '1.1.1.1 is Cloudflare public DNS.', 3: '200.100.50.0 is public routable IP space.' }),
        createQ('[MEDIUM] A user workstation receives IP address `169.254.45.88`. What does this indicate about network status?', ['The workstation has a fast 10 Gbps link', 'The client failed to contact a DHCP server, so Windows auto-assigned an APIPA address', 'The workstation is connected directly to NSA servers', 'The Ethernet cable is unplugged'], 1, '169.254.0.0/16 is APIPA (Automatic Private IP Addressing) assigned when link is active but DHCP fails.', { 0: 'APIPA indicates connection configuration failure.', 2: 'NSA servers are unrelated.', 3: 'APIPA occurs when physical link is up but DHCP server is unreachable.' }),
        createQ('[MEDIUM] What is the decimal value of the binary octet `11000000`?', ['128', '192', '224', '255'], 1, '128 + 64 = 192 in binary positional notation.', { 0: '10000000 is 128.', 2: '11100000 is 224.', 3: '11111111 is 255.' }),
        createQ('[HARD] A computer has IP `10.1.5.20` with subnet mask `255.255.240.0` (/20). What is the Network ID for this host?', ['10.1.0.0', '10.1.5.0', '10.1.16.0', '10.0.0.0'], 0, 'In octet 3: 5 AND 240 (block size 16) ➔ Network ID is 10.1.0.0/20.', { 1: '10.1.5.0 ignores bitwise ANDing of 240.', 2: '10.1.16.0 is the next subnet.', 3: '10.0.0.0 is a /8 summary.' }),
        createQ('[HARD] Why can millions of homes use the exact same private IP `192.168.1.100` simultaneously without causing an IP address conflict on the public Internet?', ['Because private IPs are unroutable on the public Internet and translated via NAT at each home gateway router', 'Because private IPs use wireless radio waves', 'Because private IPs change every 5 seconds', 'Because private IPs are encrypted'], 0, 'Private IPs are isolated within local LANs and translated to a single unique public IP via NAT at the router gateway.', { 1: 'Radio waves carry signals, not IP isolation.', 2: 'IPs do not change every 5 seconds.', 3: 'Private IPs are unencrypted L3 headers.' }),
        createQ('[HARD] What is the Broadcast IP address for host `172.16.35.10` with subnet mask `255.255.240.0` (/20)?', ['172.16.35.255', '172.16.47.255', '172.16.255.255', '172.16.31.255'], 1, 'Network ID is 172.16.32.0; block size is 16 ➔ Broadcast ID is 172.16.47.255.', { 0: '172.16.35.255 ignores third octet subnet boundary.', 2: '172.16.255.255 is a /16 broadcast.', 3: '172.16.31.255 is the broadcast of previous subnet.' }),
        createQ('[HARD] What is the role of the IPv4 Time to Live (TTL) header field during packet routing?', ['To track packet transmission speed', 'To prevent packets from looping indefinitely by decrementing by 1 at each router hop and dropping the packet when TTL reaches 0', 'To record timestamps', 'To assign port numbers'], 1, 'TTL prevents routing loops from consuming bandwidth permanently.', { 0: 'TTL is a hop counter, not speed timer.', 2: 'Timestamps are handled by TCP options.', 3: 'Ports are Layer 4.' })
      ]
    },

    // 10. IPV6
    {
      slug: 'ipv6',
      title: 'IPv6 Addressing',
      tagline: 'Master the 128-bit next-generation Internet Protocol.',
      category: 'Core Protocols',
      description: 'The successor to IPv4 providing virtually unlimited IP addresses.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Globe',
      estimatedHours: 4,
      lessonTitle: '10. Next-Generation IPv6 Architecture',
      lessonSlug: 'ipv6-architecture',
      shortExplanation: 'IPv6 uses 128-bit hexadecimal addresses to solve IPv4 exhaustion forever.',
      theory: `1. WHAT IS IT?\nIPv6 (Internet Protocol Version 6) is a 128-bit addressing system designed to replace depleted IPv4 addresses.\n\n2. WHY DO WE NEED IT?\nIPv4 only has 4.3 billion addresses, which ran out due to smartphones, IoT devices, and cloud servers. IPv6 provides \`3.4 x 10^38\` addresses (\`340 undecillion\`—enough for every grain of sand on Earth!).\n\n3. HOW DOES IT WORK?\nAn IPv6 address contains 8 groups of 4 hexadecimal digits separated by colons:\ne.g. \`2001:0db8:85a3:0000:0000:8a2e:0370:7334\`.\n\n4. RULE OF COMPRESSION:\n- Omit leading zeros: \`0000\` ➔ \`0\`.\n- Double colon (\`::\`): Replaces consecutive blocks of zeros (can only be used ONCE per address).\nCompressed example: \`2001:db8:85a3::8a2e:370:7334\`.\n\n5. SPECIAL ADDRESSES:\n- Loopback: \`::1\` (equivalent to 127.0.0.1 in IPv4).\n- Link-Local: Starts with \`fe80::\` (auto-configured on every IPv6 interface).\n\n6. WHAT SHOULD YOU REMEMBER?\n- IPv6 = 128 bits.\n- Uses Hexadecimal notation & Colons (\`:\`).\n- No ARP or Broadcasts (uses ICMPv6 Multicast instead).`,
      analogy: 'If IPv4 was a small 7-digit telephone book that ran out of numbers, IPv6 is a 128-digit numbering system that can number every atom in the universe.',
      keyConcepts: ['128-bit address length (340 Undecillion total).', 'Hexadecimal blocks separated by colons.', 'Zero compression rule (`::`).', 'Link-Local prefix fe80:: & Loopback ::1.'],
      practicalActivity: { title: 'Activity: View Your IPv6 Address', instructions: 'Run `ipconfig` or `ifconfig` and find your `fe80::` link-local IPv6 address.' },
      questions: [
        createQ('[EASY] How many bits long is an IPv6 address?', ['32 bits', '48 bits', '64 bits', '128 bits'], 3, 'IPv6 addresses are 128 bits long (4x larger than IPv4).', { 0: '32 bits is IPv4.', 1: '48 bits is MAC address.', 2: '64 bits is interface ID length.' }),
        createQ('[EASY] How are IPv6 addresses formatted for human reading?', ['4 octets of decimal numbers separated by dots', '8 groups of 4 hexadecimal digits separated by colons', 'Base64 strings', 'Binary digits'], 1, 'IPv6 uses 8 colon-separated hexadecimal blocks (e.g. 2001:0db8::1).', { 0: 'Dotted decimal is IPv4.', 2: 'Base64 is file encoding.', 3: 'Binary is hardware logic.' }),
        createQ('[MEDIUM] How many times can the double colon (`::`) zero compression symbol be used in a single IPv6 address?', ['Unlimited times', 'Exactly ONCE per address', 'Up to 3 times', 'Never'], 1, '`::` can only be used ONCE per address; multiple double colons create ambiguity when restoring zero blocks.', { 0: 'Multiple `::` breaks unambiguous parsing.', 2: '3 times is invalid.', 3: '`::` is standard compression syntax.' }),
        createQ('[MEDIUM] What IPv6 prefix identifies an automatically generated Link-Local address used on a single local network segment?', ['2001::/16', 'fe80::/10', 'ff00::/8', '::1/128'], 1, '`fe80::/10` identifies IPv6 Link-Local addresses automatically active on every interface.', { 0: '2001:: is Global Unicast.', 2: 'ff00:: is Multicast.', 3: '::1 is Loopback.' }),
        createQ('[HARD] Compress the following IPv6 address using standard zero compression rules: `2001:0db8:0000:0000:0000:0000:1234:5678`', ['2001:db8::1234:5678', '2001:db8:0:1234:5678', '2001::db8::1234:5678', '2001:db8:0000::1234:5678'], 0, 'Omit leading zeros (`0db8`➔`db8`) and replace consecutive 0000 blocks with `::` ➔ `2001:db8::1234:5678`.', { 1: 'Missed `::` compression opportunity.', 2: 'Uses `::` twice, which is illegal.', 3: 'Incompletely compressed.' }),
        createQ('[HARD] Why did IPv6 eliminate traditional Layer 2/3 Broadcast messages in favor of Multicast?', ['To reduce CPU interrupt overhead on non-destination hosts', 'Because broadcast cables were deprecated', 'Because IPv6 has no routers', 'Because IPv6 is slower'], 0, 'Broadcasting forces EVERY network card CPU to process frames; IPv6 multicast delivers frames only to interested subscriber interfaces.', { 1: 'Physical cables carry both multicast and broadcast bits.', 2: 'IPv6 uses routers extensively.', 3: 'IPv6 hardware routing is extremely fast.' }),
        createQ('[HARD] What mechanism allows an IPv6 host to automatically generate its own globally unique IPv6 address without using a stateful DHCPv6 server?', ['SLAAC (Stateless Address Autoconfiguration)', 'ARP Spoofing', 'NAT Overload', 'DNS CNAME'], 0, 'SLAAC combines network prefix advertised by local router with host interface ID (EUI-64 / Random).', { 1: 'ARP spoofing is an attack.', 2: 'NAT Overload is IPv4 translation.', 3: 'CNAME is a DNS alias.' }),
        createQ('[HARD] What is the IPv6 loopback address equivalent to IPv4 `127.0.0.1`?', ['::1', 'fe80::1', '2001::1', 'ff02::1'], 0, '`::1` (or `0:0:0:0:0:0:0:1`) is the IPv6 loopback address.', { 1: 'fe80::1 is link-local gateway.', 2: '2001::1 is global unicast.', 3: 'ff02::1 is all-nodes multicast.' })
      ]
    },

    // 11. SUBNETTING
    {
      slug: 'subnetting',
      title: 'Subnetting & CIDR',
      tagline: 'Master dividing networks, subnet masks, host ranges, and CIDR calculations.',
      category: 'Core Protocols',
      description: 'The process of partitioning a large network into smaller, efficient subnets.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Layout',
      estimatedHours: 5,
      lessonTitle: '11. Practical Subnetting & CIDR Math',
      lessonSlug: 'subnetting-cidr-math',
      shortExplanation: 'Subnetting splits one physical network into smaller logical sub-networks to improve security and performance.',
      theory: `1. WHAT IS IT?\nSubnetting takes a large IP address block and divides it into smaller sub-networks (subnets) using a Subnet Mask or CIDR prefix (e.g. \`/24\`, \`/26\`).\n\n2. WHY DO WE NEED IT?\n- Security: Separate HR, Finance, and Guest Wi-Fi.\n- Performance: Reduce broadcast traffic domain size.\n- Conservation: Avoid wasting thousands of public IP addresses.\n\n3. HOW DOES IT WORK?\nAn IP address has two parts: Network ID and Host ID. Borrowing bits from the Host ID creates Subnet bits.\nFormula for Usable Hosts: \`2^H - 2\` (where H is the number of remaining Host bits).\n\n4. REAL-WORLD SCENARIO:\nYou have 50 computers in an office. A \`/24\` subnet provides 254 hosts (wasting 204 IPs). By picking \`/26\` (62 usable hosts), you fit your 50 PCs perfectly without wasting address space!\n\n5. STEP-BY-STEP CALCULATION:\nFor \`192.168.1.0/26\`:\n- Subnet Mask = \`255.255.255.192\`\n- Host bits = 32 - 26 = 6 bits.\n- Usable Hosts = \`2^6 - 2 = 64 - 2 = 62 hosts\`.\n- Reserved addresses: Network ID (\`.0\`) & Broadcast (\`.63\`).\n\n6. WHAT SHOULD YOU REMEMBER?\n- Always subtract 2 addresses (Network ID & Broadcast ID).\n- \`/24\` = 254 hosts | \`/25\` = 126 hosts | \`/26\` = 62 hosts | \`/30\` = 2 hosts.`,
      analogy: 'Subdividing a large empty building floor into private office cubicles with internal door locks.',
      keyConcepts: ['Network ID: First address in subnet (cannot be assigned to host).', 'Broadcast ID: Last address in subnet (cannot be assigned to host).', 'Usable Hosts Formula: 2^H - 2.', 'CIDR Notation: /24, /26, /30.'],
      practicalActivity: { title: 'Activity: Calculate Host Range for 192.168.1.0/24', instructions: 'Identify Network ID (192.168.1.0), First Usable (.1), Last Usable (.254), and Broadcast (.255).' },
      questions: [
        createQ('[EASY] A host has IP `192.168.1.20/24` and wants to communicate with `192.168.1.50/24`. Are they on the same subnet, and what is the expected packet behavior?', ['They are on the same subnet; traffic is delivered directly via Layer 2 switching without crossing a default gateway router', 'They are on different subnets; packets must be sent to a remote WAN router', 'They cannot communicate because their IPs end in different numbers', 'Packets must be translated via NAT'], 0, 'With a /24 mask (255.255.255.0), both IPs share network ID 192.168.1.0 and communicate directly on the local LAN.', { 1: 'They are on the same subnet, so gateway routing is unnecessary.', 2: 'Host numbers within the subnet range can communicate freely.', 3: 'NAT is for private-to-public internet translation.' }),
        createQ('[EASY] Why must you subtract 2 when calculating usable host addresses in a subnet (`2^H - 2`)?', ['One address is reserved for Network ID and one for Broadcast ID', 'Two IPs are reserved for Google DNS', 'Because Ethernet uses 2 copper wire pairs', 'Because of IPv6 compatibility'], 0, 'The first address (Network ID) and last address (Broadcast ID) are reserved and cannot be assigned to host interfaces.', { 1: 'DNS can use any valid host IP.', 2: 'Cable wiring does not reserve IP addresses.', 3: 'IPv4 math is independent of IPv6.' }),
        createQ('[MEDIUM] How many usable host IP addresses are provided by a `/26` CIDR subnet (subnet mask `255.255.255.192`)?', ['30 usable hosts', '62 usable hosts', '126 usable hosts', '254 usable hosts'], 1, 'Host bits = 32 - 26 = 6 bits. 2^6 - 2 = 64 - 2 = 62 usable host addresses.', { 0: '30 hosts is /27.', 2: '126 hosts is /25.', 3: '254 hosts is /24.' }),
        createQ('[MEDIUM] What CIDR prefix provides exactly 2 usable host IP addresses, making it optimal for point-to-point router links?', ['/24', '/28', '/29', '/30'], 3, '`/30` leaves 2 host bits (2^2 - 2 = 2 usable hosts), perfect for point-to-point links.', { 0: '/24 provides 254 hosts.', 1: '/28 provides 14 hosts.', 2: '/29 provides 6 hosts.' }),
        createQ('[HARD] An administrator needs to divide `192.168.10.0/24` into subnets that support at least 25 computers each. What CIDR prefix minimizes wasted IP addresses while meeting this requirement?', ['/25 (126 hosts)', '/26 (62 hosts)', '/27 (30 hosts)', '/28 (14 hosts)'], 2, '`/27` provides 2^5 - 2 = 30 usable hosts, which satisfies 25 computers with minimal waste.', { 0: '/25 wastes 101 IPs.', 1: '/26 wastes 37 IPs.', 3: '/28 only provides 14 hosts (too small).' }),
        createQ('[HARD] What is the Broadcast Address for subnet `172.16.12.0/22`?', ['172.16.12.255', '172.16.15.255', '172.16.255.255', '172.16.13.255'], 1, '`/22` has block size 4 in 3rd octet (12, 13, 14, 15) ➔ Broadcast address is 172.16.15.255.', { 0: '172.16.12.255 is broadcast for a /24 inside the block.', 2: '172.16.255.255 is /16 broadcast.', 3: '172.16.13.255 is premature.' }),
        createQ('[HARD] What is the first valid usable host IP address in the network `10.5.8.0/21`?', ['10.5.8.0', '10.5.8.1', '10.5.0.1', '10.5.15.254'], 1, 'Network ID is 10.5.8.0; first usable host IP is Network ID + 1 = 10.5.8.1.', { 0: '10.5.8.0 is the reserved Network ID.', 2: '10.5.0.1 is in a lower subnet.', 3: '10.5.15.254 is the LAST usable host IP.' }),
        createQ('[HARD] What is Variable Length Subnet Masking (VLSM)?', ['Using different subnet mask sizes (/24, /28, /30) within the same network hierarchy to match specific host needs without wasting space', 'Changing subnet masks every hour', 'Using variable cable lengths', 'Encrypting subnet masks'], 0, 'VLSM enables recursive subnetting of address blocks into custom sizes.', { 1: 'Subnet masks are static network designs.', 2: 'Cable length is physical.', 3: 'Subnet masks are unencrypted binary masks.' })
      ]
    },

    // 12. TCP
    {
      slug: 'tcp',
      title: 'TCP (Transmission Control Protocol)',
      tagline: 'Master reliable, connection-oriented, ordered transport communication.',
      category: 'Core Protocols',
      description: 'The foundation protocol ensuring reliable, error-checked, ordered data delivery.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Packet',
      estimatedHours: 4,
      lessonTitle: '12. TCP Handshakes, Reliability & Flow Control',
      lessonSlug: 'tcp-mechanics',
      shortExplanation: 'TCP guarantees that data arrives complete, uncorrupted, and in exact order.',
      theory: `1. WHAT IS IT?\nTransmission Control Protocol (TCP) is a Layer 4 connection-oriented protocol that ensures 100% reliable data delivery.\n\n2. WHY DO WE NEED IT?\nIP networks can drop, duplicate, or reorder packets. TCP fixes this by retransmitting lost packets and putting them back in order.\n\n3. HOW DOES IT WORK?\n- Connection Establishment: 3-Way Handshake (\`SYN\` ➔ \`SYN-ACK\` ➔ \`ACK\`).\n- Reliability: Acknowledgements (\`ACK\`) & Sequence Numbers.\n- Flow Control: Sliding Window mechanism to prevent overwhelming slow receivers.\n- Termination: 4-Way Waveform (\`FIN\` ➔ \`ACK\` ➔ \`FIN\` ➔ \`ACK\`).\n\n4. REAL-WORLD EXAMPLE:\nDownloading a PDF document or sending an email. If even 1 byte is missing, the file is corrupted. TCP ensures zero missing bytes.\n\n5. STEP-BY-STEP TCP HANDSHAKE:\nStep 1: Client sends SYN (Seq=1000).\nStep 2: Server sends SYN-ACK (Seq=5000, Ack=1001).\nStep 3: Client sends ACK (Ack=5001). Connection ESTABLISHED.\n\n6. WHAT SHOULD YOU REMEMBER?\n- TCP = Connection-oriented & Reliable.\n- Uses Sequence & Acknowledgement numbers.`,
      analogy: 'Registered Mail with signature tracking: recipient signs receipt for every package; if missing, post office resends.',
      keyConcepts: ['Connection-Oriented 3-Way Handshake (SYN, SYN-ACK, ACK).', 'Reliability: Sequence and Acknowledgement numbers.', 'Flow Control: Sliding Window size.', 'Connection Termination: FIN/ACK.'],
      practicalActivity: { title: 'Activity: Inspect Active TCP Connections', instructions: 'Run `netstat -ano` in terminal to view all ESTABLISHED TCP sockets and local/foreign port numbers.' },
      questions: [
        createQ('[EASY] What is the correct 3-step sequence executed during a TCP connection handshake?', ['ACK ➔ SYN ➔ FIN', 'SYN ➔ SYN-ACK ➔ ACK', 'DISCOVER ➔ OFFER ➔ REQUEST', 'PING ➔ PONG ➔ ACK'], 1, 'TCP connection establishment follows SYN ➔ SYN-ACK ➔ ACK.', { 0: 'FIN is for teardown.', 2: 'Discover/Offer is DHCP.', 3: 'Ping/Pong is ICMP.' }),
        createQ('[EASY] How does TCP handle packets lost due to network congestion?', ['It drops the file download', 'The sender waits for an ACK; if timeout (RTO) occurs without ACK, it retransmits the lost segment', 'It switches to UDP automatically', 'It shuts down the router'], 1, 'TCP uses Retransmission Timeouts (RTO) and ACKs to guarantee delivery of dropped segments.', { 0: 'TCP recovers gracefully without dropping downloads.', 2: 'TCP does not switch protocols dynamically.', 3: 'Routers remain active.' }),
        createQ('[MEDIUM] What mechanism does TCP utilize for Flow Control to prevent a high-speed sender from overwhelming a slow receiver buffer?', ['Sliding Window Size advertisement', 'Subnet Masking', 'MAC Filtering', 'DNS Caching'], 0, 'The receiver advertises its available buffer capacity in the TCP Window Size header field.', { 1: 'Subnetting is Layer 3.', 2: 'MAC filtering is Layer 2 security.', 3: 'DNS caching resolves hostnames.' }),
        createQ('[MEDIUM] What control flag does a TCP endpoint send to gracefully close an active session?', ['SYN flag', 'RST flag', 'FIN flag', 'URG flag'], 2, 'The FIN (Finish) flag initiates graceful four-step session teardown.', { 0: 'SYN initiates connections.', 1: 'RST forcibly resets/aborts connections.', 3: 'URG signals urgent data.' }),
        createQ('[HARD] A client sends TCP Segment with Sequence Number `1000` containing 500 bytes of data. What Acknowledgement Number does the receiving server return in its reply?', ['1000', '1001', '1500', '500'], 2, 'TCP ACK indicates the NEXT expected byte sequence number: 1000 + 500 = 1500.', { 0: 'ACK 1000 indicates 0 bytes received.', 1: 'ACK 1001 is for 1-byte SYN.', 3: 'ACK 500 is invalid.' }),
        createQ('[HARD] A firewall drops incoming TCP SYN packets targeting Port 22 from untrusted WAN IPs. What message does an external scanner receive when attempting an SSH connection?', ['Connection Established', 'Connection Timed Out / Refused', '200 OK', 'DHCP Offer'], 1, 'Dropping SYN packets prevents handshake completion, leading to a connection timeout or RST refusal.', { 0: 'SYN drop blocks handshake.', 2: '200 OK is HTTP.', 3: 'DHCP Offer is UDP.' }),
        createQ('[HARD] What is a TCP SYN Flood DDoS attack?', ['Flooding a server with thousands of fake TCP SYN requests without completing the final ACK, exhausting server memory connection pools', 'Sending giant files', 'Deleting DNS records', 'Unplugging switch power'], 0, 'SYN Floods consume half-open connection state tables in memory until legitimate users are denied access.', { 1: 'File size does not define SYN flood.', 2: 'DNS is unrelated.', 3: 'Physical power cuts are physical security.' }),
        createQ('[HARD] Why is TCP inappropriate for real-time multiplayer FPS gaming and live voice streaming?', ['Because TCP is unencrypted', 'Because TCP head-of-line blocking and retransmissions cause noticeable lag spikes when old packets are delayed', 'Because TCP cannot run over Wi-Fi', 'Because TCP has no port numbers'], 1, 'TCP halts delivery of subsequent data while waiting to retransmit a lost packet (Head-of-Line blocking), causing intolerable real-time lag.', { 0: 'TCP can be encrypted via TLS.', 2: 'TCP runs across Wi-Fi.', 3: 'TCP uses port numbers.' })
      ]
    },

    // 13. UDP
    {
      slug: 'udp',
      title: 'UDP (User Datagram Protocol)',
      tagline: 'Understand lightweight, low-latency, connectionless transport streaming.',
      category: 'Core Protocols',
      description: 'The high-speed transport protocol optimized for real-time video, gaming, and VoIP.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Packet',
      estimatedHours: 3,
      lessonTitle: '13. UDP Mechanics & Real-Time Applications',
      lessonSlug: 'udp-mechanics',
      shortExplanation: 'UDP is a minimal, connectionless protocol prioritizing speed over guaranteed delivery.',
      theory: `1. WHAT IS IT?\nUser Datagram Protocol (UDP) is a lightweight, connectionless Layer 4 transport protocol.\n\n2. WHY DO WE NEED IT?\nTCP overhead (handshakes, ACKs, retransmissions) causes latency delays. Real-time apps like voice calls, live video streaming, and multiplayer gaming prefer speed over perfection.\n\n3. HOW DOES IT WORK?\nUDP sends datagrams without establishing a connection ("Fire and forget"). It has no sequence numbers, no ACKs, and no flow control.\nHeader size: Only 8 bytes (compared to TCP's 20-60 bytes).\n\n4. REAL-WORLD EXAMPLE:\nZoom video calls or Discord voice chat. If 1 frame out of 60 drops, it is better to skip it instantly than to freeze video while waiting for retransmission.\n\n5. TCP VS UDP COMPARISON:\n- TCP: Reliable, Handshake, Slower, Web/Email (PDFs).\n- UDP: Unreliable, No Handshake, Fast, Live Video/Gaming/DNS.\n\n6. WHAT SHOULD YOU REMEMBER?\n- UDP = Fast, Connectionless, Lightweight (8-byte header).\n- Used for DNS queries, VoIP, DHCP, and Online Gaming.`,
      analogy: 'Sending postcards: you drop them in the mailbox without tracking. They arrive quickly, but if one gets lost, no notice is sent.',
      keyConcepts: ['Connectionless: No handshake or teardown.', '8-Byte Minimal Header size.', 'No ACKs or Retransmission timeouts.', 'Ideal for real-time video, voice, gaming, and DNS.'],
      practicalActivity: { title: 'Activity: Identify UDP Traffic', instructions: 'Run Wireshark capture and filter by `udp` to observe real-time DNS and QUIC traffic.' },
      questions: [
        createQ('[EASY] What is the primary design advantage of UDP over TCP?', ['100% guaranteed delivery of every datagram', 'Minimal overhead and ultra-low latency for fast real-time communication', 'Built-in database storage', 'Automatic IP routing'], 1, 'UDP eliminates connection handshakes and ACKs to achieve maximum speed and minimal latency.', { 0: 'TCP guarantees delivery.', 2: 'Databases handle storage.', 3: 'Routers handle IP routing.' }),
        createQ('[EASY] How large is a standard UDP header?', ['8 bytes', '20 bytes', '64 bytes', '1500 bytes'], 0, 'UDP headers are minimal at only 8 bytes (Source Port, Dest Port, Length, Checksum).', { 1: 'TCP headers are 20+ bytes.', 2: '64 bytes is minimum Ethernet frame size.', 3: '1500 bytes is MTU payload.' }),
        createQ('[MEDIUM] Which application protocol defaults to using UDP on Port 53 for simple query-response lookups?', ['HTTP', 'DNS', 'FTP', 'SSH'], 1, 'DNS uses UDP Port 53 because small queries fit inside a single fast datagram.', { 0: 'HTTP uses TCP Port 80.', 2: 'FTP uses TCP Ports 20/21.', 3: 'SSH uses TCP Port 22.' }),
        createQ('[MEDIUM] What happens when a UDP datagram is dropped due to router queue congestion?', ['The sender automatically retransmits the datagram', 'The datagram is lost permanently; UDP performs no retransmission', 'The router reboots', 'The connection is terminated with a FIN packet'], 1, 'UDP provides no ACK or retransmission mechanism; lost datagrams are dropped permanently.', { 0: 'TCP retransmits lost segments.', 2: 'Routers drop packets during congestion without rebooting.', 3: 'FIN packets are TCP flags.' }),
        createQ('[HARD] A VoIP engineer notices minor audio glitches during voice calls across a WAN link, but audio stays synchronized in real time. Why is UDP superior to TCP for this use case?', ['Because UDP forces 4K video resolution', 'Because skipping a lost 20ms audio frame maintains real-time conversation sync, whereas TCP retransmissions cause freezing lag', 'Because TCP cables are slower', 'Because UDP encrypts voice data'], 1, 'In real-time media, dropped samples should be discarded; waiting for TCP retransmissions creates intolerable delay.', { 0: 'VoIP is audio, not 4K video.', 2: 'Cables carry bits regardless of protocol.', 3: 'Encryption is handled by SRTP.' }),
        createQ('[HARD] What 4 fields compose the 8-byte UDP protocol header?', ['Source Port, Destination Port, Length, Checksum', 'Sequence Number, ACK Number, Window Size, Flags', 'Source MAC, Dest MAC, EtherType, FCS', 'Source IP, Dest IP, TTL, Version'], 0, 'The 8-byte UDP header contains: Source Port (2B), Dest Port (2B), Length (2B), Checksum (2B).', { 1: 'These are TCP header fields.', 2: 'These are Ethernet header fields.', 3: 'These are IPv4 header fields.' }),
        createQ('[HARD] Why does QUIC (HTTP/3) run over UDP instead of TCP?', ['Because TCP cannot cross firewalls', 'To eliminate TCP head-of-line blocking and connection handshake delays at the transport layer', 'Because UDP is slower', 'Because UDP has no port numbers'], 1, 'QUIC implements custom multiplexing and encryption over UDP to avoid TCP head-of-line blocking.', { 0: 'TCP crosses firewalls easily.', 2: 'UDP is faster.', 3: 'UDP uses port numbers.' }),
        createQ('[HARD] Can an application implement its own reliability, sequence ordering, and retransmission mechanisms on top of UDP?', ['No, UDP prohibits software custom logic', 'Yes, protocols like QUIC and TFTP implement custom reliability logic at the Application Layer over UDP', 'Yes, but only on Linux', 'No, only routers can add reliability'], 1, 'Application developers can build custom reliability mechanisms on top of UDP.', { 0: 'Applications can implement any logic in code.', 2: 'Supported across all OS platforms.', 3: 'Reliability logic runs in endpoint software.' })
      ]
    },

    // 14. DNS
    {
      slug: 'dns',
      title: 'DNS (Domain Name System)',
      tagline: 'Understand the phonebook of the Internet converting names to IP addresses.',
      category: 'Core Protocols',
      description: 'Translates human-readable domain names into machine-routable IP addresses.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Globe',
      estimatedHours: 4,
      lessonTitle: '14. Domain Name System Hierarchy & Resolution',
      lessonSlug: 'dns-hierarchy-resolution',
      shortExplanation: 'DNS converts human-friendly domain names (e.g. google.com) into IP addresses (e.g. 142.250.190.46).',
      theory: `1. WHAT IS IT?\nDomain Name System (DNS) is the distributed database system that translates domain names into numerical IP addresses.\n\n2. WHY DO WE NEED IT?\nHumans remember names like \`google.com\` or \`youtube.com\`. Computers and routers only route packets using numerical IP addresses like \`142.250.190.46\`.\n\n3. HOW DOES IT WORK?\nDNS Hierarchy:\n- Root Name Servers (\`.\`)\n- TLD (Top Level Domain) Servers (\`.com\`, \`.edu\`, \`.org\`)\n- Authoritative Name Servers (\`ns1.google.com\`)\n\n4. REAL-WORLD RESOLUTION STEPS:\nUser types \`youtube.com\` ➔ Browser checks local cache ➔ Queries Recursive Resolver (e.g. 1.1.1.1) ➔ Resolver asks Root Server ➔ Root points to .COM TLD ➔ TLD points to Authoritative Server ➔ Authoritative server returns IP \`142.250.190.46\` ➔ Browser connects!\n\n5. COMMON DNS RECORD TYPES:\n- **A Record**: Maps name to IPv4 address.\n- **AAAA Record**: Maps name to IPv6 address.\n- **CNAME**: Alias (canonical name) to another domain.\n- **MX Record**: Mail exchange server for emails.\n\n6. WHAT SHOULD YOU REMEMBER?\n- DNS runs on UDP/TCP Port 53.\n- A Record = IPv4 | AAAA Record = IPv6.`,
      analogy: 'Contacts app on your phone: you tap "Mom" (Domain Name), and your phone dials her phone number 555-0199 (IP Address).',
      keyConcepts: ['Port 53 UDP/TCP.', 'A Record (IPv4) vs AAAA Record (IPv6).', 'CNAME (Alias) & MX (Email Mail Server).', 'Recursive Resolver ➔ Root ➔ TLD ➔ Authoritative.'],
      practicalActivity: { title: 'Activity: Perform a Manual DNS Lookup', instructions: 'Run `nslookup google.com` or `dig google.com` in your terminal to view the returned IPv4 A record.' },
      questions: [
        createQ('[EASY] A client can reach a server using its IP address (192.168.1.50) but cannot access it using its hostname (server.local). Which component should be investigated first?', ['DNS (Domain Name System)', 'ARP (Address Resolution Protocol)', 'DHCP (Dynamic Host Configuration Protocol)', 'BGP (Border Gateway Protocol)'], 0, 'If IP connectivity works but hostname access fails, DNS name resolution is failing.', { 1: 'ARP resolves IPs to MACs, which works since IP ping succeeded.', 2: 'DHCP assigned the IP already.', 3: 'BGP is for WAN internet routing.' }),
        createQ('[EASY] Which DNS record type maps a domain name to a 32-bit IPv4 address?', ['A Record', 'AAAA Record', 'MX Record', 'TXT Record'], 0, 'An `A Record` maps a hostname to an IPv4 address.', { 1: 'AAAA Record maps to IPv6.', 2: 'MX Record specifies mail servers.', 3: 'TXT Record holds text verification strings.' }),
        createQ('[MEDIUM] Which DNS record type maps a domain alias to another canonical domain name (e.g. `www.example.com` ➔ `example.com`)?', ['A Record', 'AAAA Record', 'CNAME Record', 'PTR Record'], 2, 'A `CNAME Record` (Canonical Name) aliases one hostname to another.', { 0: 'A Record maps to IPv4.', 1: 'AAAA Record maps to IPv6.', 3: 'PTR Record performs reverse IP-to-name lookups.' }),
        createQ('[MEDIUM] What port number does DNS use for standard client queries?', ['Port 22', 'Port 53', 'Port 80', 'Port 443'], 1, 'DNS operates on Port 53 (using UDP for queries and TCP for zone transfers).', { 0: 'Port 22 is SSH.', 2: 'Port 80 is HTTP.', 3: 'Port 443 is HTTPS.' }),
        createQ('[HARD] Trace the exact sequence of servers queried by a Recursive DNS Resolver to resolve `shop.example.com`:', ['Root Server (`) ➔ TLD Server (.com) ➔ Authoritative Server (example.com)', 'Authoritative Server ➔ TLD Server ➔ Root Server', 'DHCP Server ➔ Gateway Router ➔ Switch', 'Local ARP Cache ➔ MAC Table ➔ IP Table'], 0, 'Recursive resolution queries Root (`.`) ➔ TLD (`.com`) ➔ Authoritative (`example.com`).', { 1: 'Reverses top-down hierarchy.', 2: 'DHCP provisions local IPs.', 3: 'ARP handles L2 MAC resolution.' }),
        createQ('[HARD] A web administrator changes a web server IP address. However, remote users report being directed to the old IP address for several hours. What DNS setting controls how long resolvers cache the old record?', ['TTL (Time to Live) value on the DNS record', 'MAC address table timer', 'Subnet Mask', 'TCP Window Size'], 0, 'The TTL setting specifies the duration in seconds that DNS resolvers cache a record before querying authoritative servers again.', { 1: 'MAC tables handle L2 switching.', 2: 'Subnet mask defines IP range.', 3: 'TCP window size handles flow control.' }),
        createQ('[HARD] What is DNS Cache Poisoning (DNS Spoofing)?', ['Injecting false IP address records into a DNS resolver cache to redirect users to malicious phishing websites', 'Deleting domain names', 'Upgrading DNS server RAM', 'Encrypting domain names'], 0, 'DNS Cache Poisoning alters resolver cache entries, hijacking web traffic.', { 1: 'Deleting domains is unregistering.', 2: 'Hardware upgrade is maintenance.', 3: 'DoH encrypts DNS traffic.' }),
        createQ('[HARD] Which DNS protocol extension encrypts DNS queries inside HTTPS traffic on Port 443 to prevent ISP eavesdropping and tampering?', ['DoH (DNS over HTTPS)', 'DNSSEC', 'DDNS', 'Reverse DNS'], 0, 'DNS over HTTPS (DoH) encrypts DNS lookups inside HTTPS traffic on Port 443.', { 1: 'DNSSEC signs DNS records for integrity.', 2: 'DDNS dynamically updates IP records.', 3: 'Reverse DNS resolves IPs to names.' })
      ]
    },

    // 15. DHCP
    {
      slug: 'dhcp',
      title: 'DHCP (Dynamic Host Configuration Protocol)',
      tagline: 'Understand automatic IP address lease configuration & DORA sequence.',
      category: 'Core Protocols',
      description: 'The service that automatically assigns IP addresses, subnet masks, and gateways to network clients.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Server',
      estimatedHours: 3,
      lessonTitle: '15. Automatic Network Setup via DHCP DORA',
      lessonSlug: 'dhcp-dora-process',
      shortExplanation: 'DHCP automatically provisions IP addresses, subnet masks, default gateways, and DNS servers to new network devices.',
      theory: `1. WHAT IS IT?\nDynamic Host Configuration Protocol (DHCP) is a Layer 7 service that automatically configures network settings for joining devices.\n\n2. WHY DO WE NEED IT?\nWithout DHCP, network admins would have to walk up to every single phone, PC, and smart TV and manually type an IP address, Subnet Mask, Gateway, and DNS server.\n\n3. HOW DOES IT WORK? (THE DORA PROCESS)\n- **D - Discover**: Client broadcasts "Is there a DHCP server?"\n- **O - Offer**: Server offers "Take IP 192.168.1.105!"\n- **R - Request**: Client requests "I accept IP 192.168.1.105!"\n- **A - ACK**: Server acknowledges "Lease confirmed for 24 hours!"\n\n4. REAL-WORLD EXAMPLE:\nWhen you join a coffee shop Wi-Fi network, your phone instantly gets IP \`172.16.42.89\` via DHCP in less than 1 second.\n\n5. DHCP LEASE EXPIRATION:\nIP assignments are temporary **Leases**. Before lease expiration (e.g. 50% time mark), client requests a lease renewal.\n\n6. WHAT SHOULD YOU REMEMBER?\n- DORA = Discover, Offer, Request, ACK.\n- DHCP uses UDP Ports 67 (Server) & 68 (Client).`,
      analogy: 'Hotel check-in desk: receptionist hands you a keycard for Room 105 for 2 nights (Lease). When 2 nights end, you extend or check out.',
      keyConcepts: ['DORA 4-Step Flow.', 'UDP Port 67 (Server) & Port 68 (Client).', 'IP Lease Time & Renewal.', 'Provisioning: IP, Subnet Mask, Default Gateway, DNS.'],
      practicalActivity: { title: 'Activity: Release and Renew Your DHCP IP', instructions: 'Open terminal as Admin and type `ipconfig /release` followed by `ipconfig /renew` to request a fresh DHCP lease.' },
      questions: [
        createQ('[EASY] What is the correct 4-step sequence executed during automatic DHCP IP provisioning?', ['Discover ➔ Offer ➔ Request ➔ ACK (DORA)', 'DNS ➔ ARP ➔ IP ➔ TCP', 'SYN ➔ SYN-ACK ➔ ACK ➔ FIN', 'PING ➔ PONG ➔ LEASE ➔ DONE'], 0, 'DHCP follows the DORA sequence: Discover, Offer, Request, ACK.', { 1: 'DNS/ARP are resolution protocols.', 2: 'SYN/ACK is TCP handshake.', 3: 'Ping/Pong is ICMP.' }),
        createQ('[EASY] Which network parameter provided by DHCP identifies the router IP address used to reach external subnets?', ['Subnet Mask', 'Default Gateway', 'MAC Address', 'Loopback'], 1, 'Default Gateway specifies the router IP for forwarding out-of-subnet traffic.', { 0: 'Subnet mask defines local network scope.', 2: 'MAC address is Layer 2 hardware.', 3: 'Loopback is 127.0.0.1.' }),
        createQ('[MEDIUM] Which UDP ports are utilized by DHCP communication?', ['Port 20 and 21', 'Port 67 (Server) and Port 68 (Client)', 'Port 80 and 443', 'Port 110 and 25'], 1, 'DHCP uses UDP Port 67 for Server listening and Port 68 for Client messages.', { 0: 'Ports 20/21 are FTP.', 2: 'Ports 80/443 are HTTP/HTTPS.', 3: 'Ports 110/25 are POP3/SMTP email.' }),
        createQ('[MEDIUM] What is a DHCP Reservation?', ['Mapping a specific device MAC address to a fixed IP address in the DHCP pool so it always receives the same IP', 'Reserving a table at a restaurant', 'Deleting an IP pool', 'Blocking Wi-Fi clients'], 0, 'DHCP Reservations bind a static IP assignment to a specific device MAC address dynamically.', { 1: 'Restaurant reservation is non-technical.', 2: 'Deleting pools removes address ranges.', 3: 'Blocking is MAC filtering.' }),
        createQ('[HARD] An employee plugs an unauthorized wireless router into a wall jack in an office. Users on the floor suddenly lose Internet access as their PCs receive IP addresses in the `192.168.0.x` range instead of `10.0.x.x`. What issue is occurring?', ['Rogue DHCP Server', 'ARP Poisoning', 'DNS Amplification', 'BGP Route Flapping'], 0, 'A Rogue DHCP server responds faster to DHCP Discovers, offering invalid gateway and IP settings to clients.', { 1: 'ARP poisoning spoofs MAC addresses.', 2: 'DNS amplification attacks resolvers.', 3: 'BGP route flapping affects WAN routers.' }),
        createQ('[HARD] What switch security feature blocks unauthorized DHCP Offer messages from untrusted switch ports to prevent Rogue DHCP attacks?', ['DHCP Snooping', 'Spanning Tree Protocol', 'PortFast', '802.1Q Tagging'], 0, 'DHCP Snooping filters DHCP Offers on untrusted ports, allowing Offers only from designated trusted ports.', { 1: 'STP prevents L2 switching loops.', 2: 'PortFast bypasses STP delay.', 3: '802.1Q tags VLANs.' }),
        createQ('[HARD] When a client DHCP lease reaches 50% of its total T1 lease time, what action does the client perform?', ['Sends a unicast DHCP Request to the issuing DHCP server to renew its lease', 'Reboots the computer', 'Sends a DHCP Discover broadcast', 'Erases its network card driver'], 0, 'At 50% lease expiration (T1 timer), the client sends a unicast DHCP Request to extend its current lease.', { 1: 'Rebooting is unnecessary.', 2: 'Broadcast Discover occurs only if T2 timer (87.5%) expires without renewal.', 3: 'Drivers remain installed.' }),
        createQ('[HARD] What DHCP feature allows a router to forward broadcast DHCP Discover messages from a local client subnet across Layer 3 to a centralized DHCP server on another network?', ['DHCP Relay Agent (IP Helper-Address)', 'NAT Overload', 'DNS Forwarder', 'Proxy ARP'], 0, 'A DHCP Relay Agent (IP Helper) intercepts L2 broadcast DHCP Discovers and forwards them as L3 unicast packets to a central DHCP server.', { 1: 'NAT translates private IPs.', 2: 'DNS forwarder forwards DNS queries.', 3: 'Proxy ARP answers ARP for remote hosts.' })
      ]
    },

    // 16. HTTP
    {
      slug: 'http',
      title: 'HTTP (Hypertext Transfer Protocol)',
      tagline: 'Understand web request methods, status codes, and plaintext headers.',
      category: 'Application Layer',
      description: 'The foundation protocol of data communication for the World Wide Web.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Globe',
      estimatedHours: 3,
      lessonTitle: '16. HTTP Methods, Headers & Status Codes',
      lessonSlug: 'http-methods-status-codes',
      shortExplanation: 'HTTP is an unencrypted Application-layer protocol running on Port 80 for transferring web resources.',
      theory: `1. WHAT IS IT?\nHypertext Transfer Protocol (HTTP) is the Layer 7 protocol used by web browsers and servers to exchange web pages, images, and API JSON data.\n\n2. WHY DO WE NEED IT?\nIt defines standard request commands (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`) and response status codes (\`200 OK\`, \`404 Not Found\`).\n\n3. HOW DOES IT WORK?\n- **GET**: Fetch a web page or file.\n- **POST**: Submit form data or credentials.\n- **PUT / PATCH**: Update existing records.\n- **DELETE**: Remove a resource.\n\n4. COMMON HTTP STATUS CODES:\n- **200 OK**: Request succeeded.\n- **301 Moved Permanently**: URL redirect.\n- **401 Unauthorized**: Missing login authentication.\n- **403 Forbidden**: Insufficient role permissions.\n- **404 Not Found**: Resource does not exist.\n- **500 Internal Server Error**: Backend crash.\n\n5. HTTP IS STATELESS:\nHTTP does not remember previous requests. Websites use Cookies and Tokens to track logged-in session state.\n\n6. WHAT SHOULD YOU REMEMBER?\n- HTTP Port = 80 (Unencrypted).\n- 2xx = Success | 4xx = Client Error | 5xx = Server Error.`,
      analogy: 'Ordering at a restaurant: Customer gives menu order (GET request), waiter brings food (200 OK), or chef says "Out of stock" (404 Not Found).',
      keyConcepts: ['Port 80 TCP.', 'Methods: GET, POST, PUT, DELETE.', 'Status Codes: 200, 301, 401, 403, 404, 500.', 'Stateless nature & Cookies.'],
      practicalActivity: { title: 'Activity: Inspect HTTP Headers in Browser', instructions: 'Press F12 in Chrome/Firefox, open Network tab, reload page, and inspect Response Status 200 and Headers.' },
      questions: [
        createQ('[EASY] What TCP port number is used by default for plain, unencrypted HTTP web traffic?', ['Port 21', 'Port 80', 'Port 443', 'Port 8080'], 1, 'Plain HTTP operates on TCP Port 80 by default.', { 0: 'Port 21 is FTP.', 2: 'Port 443 is HTTPS.', 3: 'Port 8080 is an alternate proxy port.' }),
        createQ('[EASY] Which HTTP method is used to request and fetch a web page or resource from a web server without modifying server state?', ['POST', 'GET', 'DELETE', 'PUT'], 1, 'GET requests retrieve data resources from a web server safely.', { 0: 'POST submits new data payloads.', 2: 'DELETE removes resources.', 3: 'PUT updates existing resources.' }),
        createQ('[MEDIUM] What HTTP status code indicates that a user is authenticated but lacks required role permissions to access a resource?', ['200 OK', '401 Unauthorized', '403 Forbidden', '404 Not Found'], 2, '403 Forbidden indicates that the server understands the client identity but denies access due to insufficient permissions.', { 0: '200 OK indicates success.', 1: '401 Unauthorized indicates missing or invalid authentication credentials.', 3: '404 Not Found indicates missing URI resource.' }),
        createQ('[MEDIUM] Why is HTTP defined as a "Stateless" protocol?', ['Because it cannot send images', 'Because each request-response pair is executed independently without the protocol remembering past requests', 'Because it requires satellite links', 'Because it runs without TCP'], 1, 'HTTP retains no session memory between requests; session persistence requires Cookies or Authorization Tokens.', { 0: 'HTTP transfers all media formats.', 2: 'HTTP runs over standard networks.', 3: 'HTTP runs over TCP.' }),
        createQ('[HARD] A user submits a web form containing a username and password. Which HTTP method should be selected to send credentials securely inside the request body rather than in the visible URL query string?', ['GET', 'POST', 'HEAD', 'OPTIONS'], 1, 'POST includes parameters in the HTTP request payload body rather than appending credentials to the URL.', { 0: 'GET puts parameters in clear text in the URL string.', 2: 'HEAD retrieves headers only.', 3: 'OPTIONS queries supported methods.' }),
        createQ('[HARD] A web application crashes with an unhandled null pointer exception while processing a database query. What HTTP response status code range should the server return?', ['200 - 299', '300 - 399', '400 - 499', '500 - 599 (e.g. 500 Internal Server Error)'], 3, '5xx status codes indicate unhandled backend server errors.', { 0: '2xx indicates success.', 1: '3xx indicates redirection.', 2: '4xx indicates client input error.' }),
        createQ('[HARD] What HTTP header is sent by a web browser to inform the server of stored session authentication state on subsequent requests?', ['Cookie or Authorization: Bearer <token>', 'Content-Type: text/html', 'Host: example.com', 'User-Agent: Mozilla'], 0, '`Cookie` or `Authorization: Bearer <token>` headers convey session state.', { 1: 'Content-Type specifies body MIME type.', 2: 'Host specifies target hostname.', 3: 'User-Agent identifies browser software.' }),
        createQ('[HARD] What is the difference between HTTP/1.1 pipelining and HTTP/2 multiplexing over a single TCP connection?', ['HTTP/1.1 transfers images; HTTP/2 transfers text only', 'HTTP/1.1 requires head-of-line sequential response delivery; HTTP/2 multiplexes multiple streams asynchronously over a single TCP socket', 'HTTP/2 uses no IP addresses', 'HTTP/1.1 is faster'], 1, 'HTTP/2 introduces binary framing and stream multiplexing over a single TCP connection, eliminating HTTP/1.1 head-of-line blocking.', { 0: 'Both support all content types.', 2: 'Both require IP addressing.', 3: 'HTTP/2 is significantly faster.' })
      ]
    },

    // 17. HTTPS
    {
      slug: 'https',
      title: 'HTTPS & SSL/TLS Encryption',
      tagline: 'Understand secure web traffic, SSL/TLS handshake, certificates, and Port 443.',
      category: 'Application Layer',
      description: 'The secure version of HTTP encrypted with TLS certificates.',
      level: CourseLevel.INTERMEDIATE,
      icon: 'Shield',
      estimatedHours: 4,
      lessonTitle: '17. HTTPS & TLS Handshake Cryptography',
      lessonSlug: 'https-tls-handshake',
      shortExplanation: 'HTTPS wraps HTTP inside TLS encryption (Port 443) to guarantee Privacy, Integrity, and Authentication.',
      theory: `1. WHAT IS IT?\nHypertext Transfer Protocol Secure (HTTPS) is HTTP encrypted with Transport Layer Security (TLS).\n\n2. WHY DO WE NEED IT?\nPlain HTTP transmits passwords, credit cards, and cookies in clear plaintext. Anyone sniffing Wi-Fi could steal your credentials. HTTPS encrypts all payload data.\n\n3. HOW DOES IT WORK?\n- **Port**: Operates on TCP Port 443.\n- **Asymmetric Encryption (RSA/ECC)**: Used during TLS Handshake to exchange keys.\n- **Symmetric Encryption (AES-GCM)**: Used for fast bulk encryption of web traffic after key exchange.\n- **Digital Certificates**: Issued by trusted Certificate Authorities (CAs) to verify website identity.\n\n4. REAL-WORLD EXAMPLE:\nWhen you see the **Padlock Icon 🔒** next to \`https://bank.com\` in your browser bar, your session is protected by TLS 1.3 encryption.\n\n5. THE 3 SECURITY PILLARS OF HTTPS:\n1. **Confidentiality**: Eavesdroppers cannot read your data.\n2. **Integrity**: Hackers cannot modify data in transit.\n3. **Authentication**: Proves you are talking to real Google, not an impostor.\n\n6. WHAT SHOULD YOU REMEMBER?\n- HTTPS Port = 443.\n- Asymmetric keys for Handshake ➔ Symmetric AES keys for Data.`,
      analogy: 'Sending documents in a locked steel safe: only you and the bank have the secret combination key to open and read contents.',
      keyConcepts: ['Port 443 TCP.', 'TLS 1.3 Handshake.', 'Asymmetric (Public/Private) vs Symmetric (AES) keys.', 'Certificate Authorities (CA) & Digital Signatures.'],
      practicalActivity: { title: 'Activity: Inspect Website TLS Certificate', instructions: 'Click the Padlock icon in your browser URL bar on any website and view the Certificate Authority issuer.' },
      questions: [
        createQ('[EASY] What default TCP port is used by HTTPS for secure, encrypted web traffic?', ['Port 22', 'Port 80', 'Port 443', 'Port 3389'], 2, 'HTTPS operates on TCP Port 443.', { 0: 'Port 22 is SSH.', 1: 'Port 80 is plain HTTP.', 3: 'Port 3389 is RDP.' }),
        createQ('[EASY] What cryptographic combination makes HTTPS both secure and high-performance?', ['Asymmetric encryption (RSA/ECC) for initial key exchange + Symmetric encryption (AES) for bulk data transfer', 'Symmetric key exchange over public Wi-Fi', 'Plaintext encoding only', 'MD5 hashing for files'], 0, 'Asymmetric encryption safely exchanges secret keys during the TLS handshake; symmetric AES encrypts bulk data efficiently.', { 1: 'Transmitting symmetric keys in plaintext over open Wi-Fi compromises security.', 2: 'Plaintext is unencrypted.', 3: 'MD5 is a weak hashing algorithm.' }),
        createQ('[MEDIUM] What trusted third-party entity issues Digital Certificates to authenticate website identities for HTTPS?', ['Certificate Authority (CA)', 'Local LAN Switch', 'RAM Controller', 'Computer Keyboard'], 0, 'Trusted Certificate Authorities (e.g. Let\'s Encrypt, DigiCert) digitally sign website TLS certificates.', { 1: 'Switches do not issue PKI certificates.', 2: 'RAM is hardware memory.', 3: 'Keyboards are input peripherals.' }),
        createQ('[MEDIUM] What three core security guarantees are provided by HTTPS?', ['Speed, Bandwidth, Latency', 'Confidentiality, Integrity, Authentication', 'Routing, Switching, Bridging', 'Storage, Backup, Recovery'], 1, 'HTTPS guarantees Confidentiality (privacy), Integrity (anti-tampering), and Authentication (identity verification).', { 0: 'Speed/bandwidth are performance metrics.', 2: 'Routing/switching are Layer 2/3 transport.', 3: 'Storage/backup are IT operations.' }),
        createQ('[HARD] A user connects to an online banking portal on public Wi-Fi. An attacker executes a Man-in-the-Middle (MitM) attack by presenting a self-signed TLS certificate. What warning will the browser display?', ['"Your Connection is Not Private / Security Certificate Warning"', '"Internet Speed Increased"', '"Download Completed"', '"Page Loaded Successfully"'], 0, 'Browsers detect untrusted/self-signed certificates and display high-priority security warnings to prevent MitM eavesdropping.', { 1: 'Invalid certificates degrade security.', 2: 'Download notices are file tasks.', 3: 'Success notices appear for valid signed certificates.' }),
        createQ('[HARD] In Public Key Cryptography (Asymmetric), if a web server publishes its Public Key to the world, which key must remain strictly secret on the server to decrypt incoming messages?', ['The Public Key', 'The Private Key', 'The Subnet Mask', 'The MAC Address'], 1, 'The Private Key must remain strictly confidential on the server to decrypt data encrypted with its corresponding Public Key.', { 0: 'The Public Key is shared openly.', 2: 'Subnet mask is Layer 3 config.', 3: 'MAC address is Layer 2.' }),
        createQ('[HARD] What protocol modernly replaced insecure SSL (Secure Sockets Layer) versions 2 and 3 due to vulnerability exploits like POODLE?', ['TLS (Transport Layer Security, version 1.3)', 'SSH', 'FTP', 'Telnet'], 0, 'TLS 1.3 modernly replaces outdated, vulnerable SSL protocols.', { 1: 'SSH is secure terminal shell.', 2: 'FTP is unencrypted file transfer.', 3: 'Telnet is unencrypted remote terminal.' }),
        createQ('[HARD] What is HTTP Strict Transport Security (HSTS)?', ['A web server security header forcing browsers to communicate strictly over HTTPS and refuse plain HTTP downgrades', 'A router firewall rule', 'A DNS record', 'A switch VLAN setting'], 0, 'HSTS prevents SSL-stripping attacks by forcing browsers to connect only via HTTPS.', { 1: 'HSTS is an HTTP response header.', 2: 'HSTS is not a DNS record.', 3: 'HSTS is Application layer security.' })
      ]
    },

    // 18. ROUTING
    {
      slug: 'routing',
      title: 'Routing & Gateway Protocols',
      tagline: 'Master Layer 3 path selection, static routes, OSPF, and BGP.',
      category: 'Routing & Switching',
      description: 'The process of selecting the best path for IP packets across interconnected networks.',
      level: CourseLevel.ADVANCED,
      icon: 'Router',
      estimatedHours: 5,
      lessonTitle: '18. IP Packet Routing & Protocol Algorithms',
      lessonSlug: 'routing-mechanics-protocols',
      shortExplanation: 'Routing determines the optimal path for packets to travel from a source network to a destination network.',
      theory: `1. WHAT IS IT?\nRouting is the Layer 3 process of evaluating IP packet destination addresses against a Routing Table to choose the best path across routers.\n\n2. WHY DO WE NEED IT?\nThe Internet contains millions of interconnected networks. Without routing, packets would get lost or loop endlessly.\n\n3. HOW DOES IT WORK?\n- **Directly Connected Routes**: Interfaces plugged directly into the router.\n- **Static Routes**: Manually configured routes by a network engineer (\`ip route 0.0.0.0 0.0.0.0 192.168.1.1\`).\n- **Dynamic Routing Protocols**: Routers automatically talk to each other to update paths (OSPF, EIGRP, BGP).\n\n4. INTERIOR VS EXTERIOR ROUTING:\n- **OSPF (Open Shortest Path First)**: Interior Gateway Protocol (IGP) used inside a single organization.\n- **BGP (Border Gateway Protocol)**: Exterior Gateway Protocol (EGP) used to route traffic between ISPs globally across the Internet backbone.\n\n5. LONGEST PREFIX MATCHING:\nA router selects the most specific subnet match in its routing table (e.g. \`/28\` wins over \`/24\`).\n\n6. WHAT SHOULD YOU REMEMBER?\n- Routers use IP Addresses & Routing Tables.\n- BGP = Core Internet backbone routing protocol.`,
      analogy: 'GPS navigation in your car: if a highway is closed by a crash (link failure), GPS recalculates a detour route instantly.',
      keyConcepts: ['Routing Table & Longest Prefix Match.', 'Static Routes vs Dynamic Routing Protocols.', 'IGP (OSPF) vs EGP (BGP).', 'Default Route: 0.0.0.0/0.'],
      practicalActivity: { title: 'Activity: View Your OS Routing Table', instructions: 'Run `route print` (Windows) or `netstat -nr` (Linux/Mac) to view your default route gateway.' },
      questions: [
        createQ('[EASY] What is the primary function of a Layer 3 Router?', ['To switch MAC address frames', 'To inspect destination IP addresses and forward packets along optimal paths between separate subnets', 'To print paper documents', 'To format hard drives'], 1, 'Routers evaluate Layer 3 IP headers to route packets across separate networks.', { 0: 'Switches handle MAC frames.', 2: 'Printers produce hard copies.', 3: 'Disk utilities format drives.' }),
        createQ('[EASY] What IPv4 subnet notation represents a Default Route matching all unknown external Internet destinations?', ['127.0.0.1 /8', '0.0.0.0 /0 (0.0.0.0 0.0.0.0)', '192.168.1.255 /24', '255.255.255.255 /32'], 1, '`0.0.0.0/0` matches any IP destination not explicitly listed in a routing table.', { 0: '127.0.0.1 is loopback.', 2: '192.168.1.255 is subnet broadcast.', 3: '255.255.255.255 is limited broadcast.' }),
        createQ('[MEDIUM] Which dynamic routing protocol is the standard Exterior Gateway Protocol (EGP) powering path selection between ISPs on the global Internet backbone?', ['OSPF', 'RIP', 'BGP (Border Gateway Protocol)', 'EIGRP'], 2, 'BGP routes traffic between independent Autonomous Systems (ISPs) across the Internet backbone.', { 0: 'OSPF is an Interior Gateway Protocol.', 1: 'RIP is legacy interior routing.', 3: 'EIGRP is Cisco interior routing.' }),
        createQ('[MEDIUM] What rule does a router follow when multiple routes in its routing table match a packet destination IP address?', ['Longest Prefix Match (the route with the most specific subnet mask, e.g. /28 over /24)', 'Shortest Prefix Match', 'Random selection', 'Alphabetical order'], 0, 'Routers select the route with the Longest Prefix Match (most specific subnet mask).', { 1: 'Shortest prefix is less specific.', 2: 'Routers perform deterministic binary matching.', 3: 'Alphabetical order is irrelevant.' }),
        createQ('[HARD] A router receives a packet for destination IP `10.1.15.5`. Its routing table contains: Route A (`10.1.0.0/16`), Route B (`10.1.12.0/22`), and Route C (`0.0.0.0/0`). Which route will be selected?', ['Route A (/16)', 'Route B (/22)', 'Route C (0.0.0.0/0)', 'All three routes simultaneously'], 1, 'Route B (`/22`) is the Longest Prefix Match that contains 10.1.15.5 (mask /22 spans 10.1.12.0 - 10.1.15.255).', { 0: 'Route A (/16) is less specific than /22.', 2: 'Route C is the default route of last resort.', 3: 'Routers forward a packet along a single chosen route.' }),
        createQ('[HARD] What is Administrative Distance (AD) in Cisco routing tables?', ['The physical distance of a cable in meters', 'A trustworthiness rating (0-255) assigned to routing sources; lower AD routes are preferred over higher AD routes', 'The speed of light', 'The number of router fans'], 1, 'Administrative Distance rates route source reliability (e.g. Connected=0, Static=1, OSPF=110, BGP=20); lower AD is preferred.', { 0: 'AD is a logical software rating, not physical distance.', 2: 'Speed of light is physical constant.', 3: 'Fan count is hardware cooling.' }),
        createQ('[HARD] How does OSPF achieve rapid convergence and prevent routing loops inside an enterprise network?', ['By broadcasting RIP messages every 30 seconds', 'By exchanging Link-State Advertisements (LSAs) and running Dijkstra Shortest Path First (SPF) algorithm to build a complete network topology map', 'By using NAT overload', 'By turning off switch ports'], 1, 'OSPF nodes build a synchronized Link-State Database (LSDB) and calculate shortest paths using Dijkstra SPF algorithm.', { 0: 'RIP uses periodic distance vector broadcasts.', 2: 'NAT translates IP addresses.', 3: 'Port shutdown causes outages.' }),
        createQ('[HARD] What is an Autonomous System (AS) in global Internet routing?', ['A single home Wi-Fi network', 'A collection of IP networks under a single clearly defined administrative domain running BGP (e.g. AS701 Verizon)', 'An operating system kernel', 'A automated robot router'], 1, 'An Autonomous System (AS) is an ISP or enterprise network under unified routing policy assigned an ASN.', { 0: 'Home networks do not hold ASNs.', 2: 'OS kernel runs host software.', 3: 'AS is an administrative network boundary.' })
      ]
    },

    // 19. SWITCHING
    {
      slug: 'switching',
      title: 'Switching & VLANs',
      tagline: 'Master Layer 2 switching, MAC tables, VLANs, and Spanning Tree Protocol (STP).',
      category: 'Routing & Switching',
      description: 'Layer 2 forwarding mechanisms, VLAN segmentation, and loop prevention.',
      level: CourseLevel.ADVANCED,
      icon: 'Switch',
      estimatedHours: 4,
      lessonTitle: '19. VLAN Segmentation & Spanning Tree Loop Prevention',
      lessonSlug: 'vlans-stp-mechanics',
      shortExplanation: 'Switches use MAC address tables to forward local frames, VLANs to isolate traffic, and STP to prevent broadcast loops.',
      theory: `1. WHAT IS IT?\nSwitching is the Layer 2 process of forwarding Ethernet frames between devices on a local area network using MAC addresses.\n\n2. WHY DO WE NEED IT?\n- **VLANs (Virtual LANs)**: Logically divide 1 physical switch into multiple isolated networks (e.g. VLAN 10 Sales, VLAN 20 Engineering).\n- **STP (Spanning Tree Protocol)**: Blocks redundant paths to stop catastrophic Broadcast Storms.\n\n3. HOW DOES IT WORK?\n- **MAC Learning**: Switch inspects source MACs of incoming frames to build its CAM table.\n- **VLAN Tagging (802.1Q)**: Adds a 4-byte VLAN ID tag to frames traveling across Trunk links.\n- **Spanning Tree (802.1D)**: Elects a Root Bridge and puts redundant ports into Blocking state.\n\n4. REAL-WORLD EXAMPLE:\nIn a hospital, Guest Wi-Fi (VLAN 50) plugs into the same physical switch as Medical Records (VLAN 10), but VLAN tagging prevents guest phones from seeing medical database packets.\n\n5. TRUNK VS ACCESS PORTS:\n- **Access Port**: Carries traffic for 1 single VLAN (connects to PC/Printer).\n- **Trunk Port**: Carries tagged traffic for MULTIPLE VLANs (connects Switch-to-Switch or Switch-to-Router).\n\n6. WHAT SHOULD YOU REMEMBER?\n- VLAN = Layer 2 broadcast domain isolation.\n- 802.1Q = VLAN Trunking standard.\n- STP = Blocks loops in redundant switch topologies.`,
      analogy: 'Building partitions: Access ports are office doors for specific departments; Trunk ports are main hallways carrying staff with color-coded ID badges (VLAN tags).',
      keyConcepts: ['CAM / MAC Address Table.', 'VLAN (Virtual LAN) & 802.1Q Trunking.', 'Access Ports vs Trunk Ports.', 'Spanning Tree Protocol (STP - 802.1D) Loop Prevention.'],
      practicalActivity: { title: 'Activity: Learn Switch Port Types', instructions: 'Sketch a diagram showing Access Ports connecting PCs and Trunk Ports connecting Switches.' },
      questions: [
        createQ('[EASY] What is the primary purpose of creating Virtual LANs (VLANs) on an Ethernet switch?', ['To double physical cable speed', 'To logically partition a single physical switch into separate isolated broadcast domains for security and department organization', 'To assign wireless passwords', 'To format server disks'], 1, 'VLANs segment a physical switch into separate logical Layer 2 broadcast domains.', { 0: 'VLANs do not alter physical cable clock speed.', 2: 'Wi-Fi security uses WPA3.', 3: 'Server disks are local storage.' }),
        createQ('[EASY] What IEEE standard defines the 4-byte VLAN tag inserted into Ethernet frames crossing Trunk links?', ['IEEE 802.11', 'IEEE 802.1Q', 'IEEE 802.3', 'IEEE 802.15'], 1, 'IEEE 802.1Q defines VLAN tagging on switch Trunk links.', { 0: '802.11 is Wi-Fi.', 2: '802.3 is standard Ethernet.', 3: '802.15 is Bluetooth.' }),
        createQ('[MEDIUM] What critical network failure occurs if two switches are connected with redundant links without Spanning Tree Protocol (STP / 802.1D) enabled?', ['Internet speed doubles', 'A Layer 2 Broadcast Storm occurs, looping frames endlessly until CPU utilization reaches 100% and switches freeze', 'VLANs merge automatically', 'IP addresses expand'], 1, 'Without STP, broadcast frames loop endlessly across redundant switch links, collapsing local LAN performance.', { 0: 'Loops crash networks, not accelerate speed.', 2: 'VLANs remain distinct.', 3: 'IP address structures are unchanged.' }),
        createQ('[MEDIUM] What is the functional difference between an Access Port and a Trunk Port on a switch?', ['Access ports carry traffic for 1 single VLAN (connecting to end hosts); Trunk ports carry tagged traffic for MULTIPLE VLANs (between switches/routers)', 'Access ports carry power; Trunk ports carry video', 'Trunk ports only connect mice', 'Access ports operate wirelessly'], 0, 'Access ports connect to end devices in a single VLAN; Trunk ports carry multi-VLAN tagged traffic between network devices.', { 1: 'Power is PoE; video is HDMI.', 2: 'Mice use USB.', 3: 'Access ports use wired cables.' }),
        createQ('[HARD] Two hosts are connected to the same physical switch. Host A is assigned to VLAN 10 (IP 192.168.10.5). Host B is assigned to VLAN 20 (IP 192.168.20.5). Can Host A ping Host B directly without a Layer 3 Router?', ['Yes, because they plug into the same physical switch', 'No, because hosts in different VLANs reside in separate Layer 2 broadcast domains and require Layer 3 routing to communicate', 'Yes, if they use the same browser', 'Yes, on weekends'], 1, 'VLAN isolation blocks direct Layer 2 frame forwarding between different VLANs; Inter-VLAN routing via a Layer 3 device is required.', { 0: 'Physical switch co-location does not bypass VLAN software boundaries.', 2: 'Browsers operate at Layer 7.', 3: 'Days of the week do not alter VLAN forwarding.' }),
        createQ('[HARD] How does Spanning Tree Protocol (STP) determine which switch port to put into Blocking state on redundant links?', ['By electing a Root Bridge based on lowest Bridge ID (Priority + MAC) and placing non-designated redundant path ports into Blocking state', 'By random selection', 'By choosing the longest cable', 'By turning off switch power'], 0, 'STP elects a Root Bridge and calculates shortest path costs; redundant paths are placed in Blocking state to eliminate loops.', { 1: 'STP uses deterministic calculation.', 2: 'Cable length is not measured by STP.', 3: 'Switch power remains active.' }),
        createQ('[HARD] What is a Native VLAN on an 802.1Q switch Trunk link?', ['A reserved VLAN for satellite links', 'An unencapsulated VLAN whose frames travel across a Trunk link WITHOUT an 802.1Q tag header', 'A VLAN that cannot carry IP packets', 'A wireless VLAN'], 1, 'Native VLAN traffic travels across an 802.1Q trunk link untagged for backward compatibility.', { 0: 'Satellite links are unrelated.', 2: 'Native VLAN carries standard IP traffic.', 3: 'Native VLAN applies to wired trunks.' }),
        createQ('[HARD] What switch security attack involves an attacker sending double-tagged 802.1Q frames to jump from one VLAN to another unauthorized VLAN?', ['VLAN Hopping', 'ARP Poisoning', 'DNS Amplification', 'SYN Flood'], 0, 'VLAN Hopping exploits misconfigured trunks to inject frames into restricted target VLANs.', { 1: 'ARP poisoning targets L2 MAC caches.', 2: 'DNS amplification targets resolvers.', 3: 'SYN flood attacks TCP.' })
      ]
    },

    // 20. NAT
    {
      slug: 'nat',
      title: 'NAT (Network Address Translation)',
      tagline: 'Understand Static NAT, Dynamic NAT, and PAT (Port Address Translation).',
      category: 'Routing & Switching',
      description: 'Translates private IP addresses to public IP addresses at the gateway router.',
      level: CourseLevel.ADVANCED,
      icon: 'RefreshCw',
      estimatedHours: 4,
      lessonTitle: '20. Network Address Translation & Port Mapping',
      lessonSlug: 'nat-pat-mechanics',
      shortExplanation: 'NAT allows hundreds of local devices with private IPs to share a single public IP address.',
      theory: `1. WHAT IS IT?\nNetwork Address Translation (NAT) is a Layer 3/4 process running on gateway routers that rewrites IP address headers as packets pass between private LANs and the public Internet.\n\n2. WHY DO WE NEED IT?\nIPv4 address depletion! There are only 4.3 billion IPv4 addresses. NAT allows a home with 30 devices to share **1 single public IP** provided by their ISP.\n\n3. TYPES OF NAT:\n- **Static NAT**: Maps 1 Private IP to 1 Public IP (1-to-1 mapping for web servers).\n- **Dynamic NAT**: Maps private IPs to a pool of public IPs.\n- **PAT (Port Address Translation / NAT Overload)**: Maps hundreds of private IPs to 1 single public IP using unique source port numbers.\n\n4. REAL-WORLD EXAMPLE:\nYour phone (\`192.168.1.15:52114\`) and laptop (\`192.168.1.20:52115\`) both access the web. Your home router rewrites both outgoing packets to Public IP \`203.0.113.50\` with distinct NAT source ports.\n\n5. STEP-BY-STEP PAT ACTION:\nHost A (\`192.168.1.10:45000\`) ➔ Router NAT Table (\`203.0.113.5:50001\`) ➔ Internet ➔ Server replies to \`203.0.113.5:50001\` ➔ Router translates back to \`192.168.1.10:45000\`.\n\n6. WHAT SHOULD YOU REMEMBER?\n- PAT (Overload) uses Port Numbers to multiplex 1 Public IP for many private devices.\n- NAT provides built-in security by hiding private IP topologies from the Internet.`,
      analogy: 'A corporate receptionist answering a single public phone number: caller asks for Extension 101 or 102, and receptionist routes the call internally.',
      keyConcepts: ['Private IP to Public IP translation.', 'PAT (Port Address Translation) / NAT Overload.', 'Inside Local vs Inside Global addresses.', 'Security isolation of internal subnets.'],
      practicalActivity: { title: 'Activity: Check Your Public vs Private IP', instructions: 'Go to `whatismyip.com` to see your public NAT IP, then check `ipconfig` to see your private LAN IP.' },
      questions: [
        createQ('[EASY] What primary problem led to the widespread deployment of Network Address Translation (NAT)?', ['Depletion of the 32-bit IPv4 address space', 'Slow CPU clock speeds', 'Excessive fiber cable costs', 'Lack of web browsers'], 0, 'NAT was created to extend IPv4 lifespan by multiplexing multiple private LAN devices over a single public IP address.', { 1: 'CPU speed is processor performance.', 2: 'Cable costs are physical infrastructure.', 3: 'Browsers are software apps.' }),
        createQ('[EASY] Which variant of NAT is also known as "NAT Overload" because it uses unique source port numbers to multiplex hundreds of internal private IPs to 1 single public IP address?', ['Static NAT', 'Dynamic NAT', 'PAT (Port Address Translation)', 'Double NAT'], 2, 'PAT uses Layer 4 port numbers to multiplex thousands of internal sessions onto one public IP.', { 0: 'Static NAT is 1-to-1 mapping.', 1: 'Dynamic NAT uses a pool of public IPs.', 3: 'Double NAT is unintended nested NAT.' }),
        createQ('[MEDIUM] An organization hosts a public web server on internal private IP `10.0.0.50`. Which NAT type provides a permanent 1-to-1 mapping to public IP `203.0.113.10` so external Internet users can reach the server?', ['Static NAT', 'PAT', 'APIPA', 'DHCP'], 0, 'Static NAT maps a specific private IP to a dedicated public IP permanently.', { 1: 'PAT is many-to-one for outbound clients.', 2: 'APIPA is fallback IP.', 3: 'DHCP provisions internal IPs.' }),
        createQ('[MEDIUM] In NAT terminology, what is the "Inside Local" address?', ['The private IP address assigned to a host on the local internal network (e.g. 192.168.1.15)', 'The public IP address of Google', 'The router MAC address', 'The ISP DNS server address'], 0, 'Inside Local is the private IP assigned to an internal LAN host.', { 1: 'Google public IP is Outside Global.', 2: 'Router MAC is Layer 2.', 3: 'ISP DNS IP is an external service.' }),
        createQ('[HARD] A router performs PAT for Host A (`192.168.1.10:45000`) requesting a web page. The router translates the packet to Public IP `203.0.113.5:50001`. When the web server replies to `203.0.113.5:50001`, how does the router determine where to forward the packet?', ['By looking up destination port 50001 in its active NAT Translation Table to find internal IP `192.168.1.10` and port `45000`', 'By asking the ISP', 'By broadcasting to all computers on Earth', 'By checking cable color'], 0, 'PAT routers maintain a translation state table mapping public port numbers back to internal IP:Port sockets.', { 1: 'ISPs do not manage router state tables.', 2: 'Global broadcasting is impossible.', 3: 'Cable color is physical.' }),
        createQ('[HARD] An external gamer wants to connect directly to a multiplayer game server running on a home PC (`192.168.1.50:27015`). Why does the connection fail by default, and how is it resolved?', ['Default NAT blocks unsolicited inbound connections; Port Forwarding must be configured on the home router', 'The PC is turned off', 'The ISP banned gaming', 'Wi-Fi cables are broken'], 0, 'NAT state tables only allow inbound return traffic for connections initiated from inside; Port Forwarding creates a static rule for inbound sessions.', { 1: 'The PC is running the game server.', 2: 'ISPs do not ban standard gaming ports.', 3: 'Wi-Fi is wireless.' }),
        createQ('[HARD] What issue occurs if a network administrator connects a home router WAN port into another router LAN port, creating "Double NAT"?', ['Internet speed quadruples', 'Inbound port forwarding, UPnP, and VoIP protocols fail due to two sequential translation layers', 'IP addresses expand to 128 bits', 'Switches explode'], 1, 'Double NAT breaks peer-to-peer applications, incoming port forwards, and IPsec VPN tunnels.', { 0: 'Double NAT degrades performance.', 2: 'IP bit length is unchanged.', 3: 'Hardware is physically unharmed.' }),
        createQ('[HARD] Does NAT function as a security boundary for internal networks?', ['Yes, because internal private IP addresses are hidden from direct inbound scanning and access from the Internet', 'No, NAT infects systems with malware', 'No, NAT exposes all passwords', 'Yes, because NAT encrypts files'], 0, 'NAT acts as a basic stateful security shield by blocking unsolicited inbound connection attempts from external internet hosts.', { 1: 'NAT does not infect systems.', 2: 'NAT does not expose passwords.', 3: 'NAT translates headers, does not encrypt payload files.' })
      ]
    },

    // 21. NETWORK SECURITY FUNDAMENTALS
    {
      slug: 'network-security',
      title: 'Network Security Fundamentals',
      tagline: 'Understand CIA triad, firewalls, IDS/IPS, VPNs, and common cyber threats.',
      category: 'Security',
      description: 'Principles, defense-in-depth mechanisms, and threat mitigation strategies.',
      level: CourseLevel.ADVANCED,
      icon: 'Shield',
      estimatedHours: 5,
      lessonTitle: '21. Network Security & Defense-in-Depth',
      lessonSlug: 'network-security-defense-depth',
      shortExplanation: 'Network security protects confidentiality, integrity, and availability using firewalls, encryption, IDS/IPS, and VPNs.',
      theory: `1. WHAT IS IT?\nNetwork Security consists of policies, processes, and technologies designed to protect network infrastructure from unauthorized access, attacks, and data breaches.\n\n2. WHY DO WE NEED IT?\nCyber attacks (malware, ransomware, DDoS, phishing) can steal customer data, ruin business reputation, and cause millions in financial losses.\n\n3. THE CIA TRIAD:\n- **Confidentiality**: Only authorized users can read data (Encryption, AES-256).\n- **Integrity**: Data cannot be altered in transit (Hashing, SHA-256, Digital Signatures).\n- **Availability**: Networks and servers remain accessible to users (DDoS Mitigation, Redundancy).\n\n4. DEFENSE-IN-DEPTH TOOLS:\n- **Next-Gen Firewall (NGFW)**: Filters traffic based on stateful rules and application signatures.\n- **IDS / IPS**: Intrusion Detection / Prevention Systems detect & block malicious attack signatures.\n- **VPN (Virtual Private Network)**: Creates an encrypted IPsec/TLS tunnel across the public Internet.\n\n5. COMMON THREATS:\n- **Phishing**: Fake emails stealing credentials.\n- **DDoS (Distributed Denial of Service)**: Flooding servers with millions of botnet requests.\n- **Man-in-the-Middle (MitM)**: Intercepting unencrypted traffic.\n\n6. WHAT SHOULD YOU REMEMBER?\n- CIA Triad = Confidentiality, Integrity, Availability.\n- VPN = Encrypted tunnel over public internet.`,
      analogy: 'Security at a high-value facility: Security perimeter fence (Firewall), ID badge check at door (Auth), CCTV cameras (IDS), security guard (IPS), and armored transport van (VPN).',
      keyConcepts: ['CIA Triad: Confidentiality, Integrity, Availability.', 'Firewalls & Stateful Inspection.', 'IDS (Detection) vs IPS (Active Prevention).', 'VPN (Virtual Private Network) IPsec Tunnels.'],
      practicalActivity: { title: 'Activity: Verify HTTPS Encryption', instructions: 'Check the padlock icon on your current browser session to confirm TLS 1.3 encryption is active.' },
      questions: [
        createQ('[EASY] What three core principles form the cornerstone of Information Security (the CIA Triad)?', ['Control, Inspection, Access', 'Confidentiality, Integrity, Availability', 'Computer, Internet, Application', 'Cisco, Intel, Apple'], 1, 'The CIA Triad stands for Confidentiality, Integrity, and Availability.', { 0: 'Control/Access are control mechanisms.', 2: 'Computer/Internet are components.', 3: 'Cisco/Intel/Apple are companies.' }),
        createQ('[EASY] What is a Virtual Private Network (VPN)?', ['A physical copper wire running under the ocean', 'An encrypted tunnel established across a public network (the Internet) to protect privacy and data confidentiality', 'A database software for passwords', 'A wireless mouse protocol'], 1, 'VPNs construct an encrypted software tunnel across public networks using IPsec or TLS.', { 0: 'Undersea cables are physical infrastructure.', 2: 'Databases store records.', 3: 'Mice use Bluetooth/USB.' }),
        createQ('[MEDIUM] What is the key operational difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)?', ['IDS passively monitors and alerts admins to suspicious traffic; IPS actively sits inline to block or drop malicious attacks in real-time', 'IDS uses no cables; IPS uses fiber', 'IPS only runs on mobile phones', 'IDS is malware'], 0, 'IDS detects and sends alerts passively; IPS sits inline to actively drop malicious packets.', { 1: 'Cable types do not dictate IDS/IPS logic.', 2: 'IPS runs on enterprise network security appliances.', 3: 'IDS is a defensive security tool.' }),
        createQ('[MEDIUM] What mathematical function generates a unique fixed-length digital fingerprint of a file (e.g. SHA-256) to verify Data Integrity against tampering?', ['Cryptographic Hash Function', 'IP Subnet Mask', 'MAC Address Table', 'DHCP Lease'], 0, 'Cryptographic hash functions generate fixed-length digests; any file alteration changes the output hash digest.', { 1: 'Subnet mask defines IP range.', 2: 'MAC table forwards frames.', 3: 'DHCP lease provisions IP addresses.' }),
        createQ('[HARD] A company web server is flooded by 500,000 compromised IoT devices (a botnet) sending HTTP GET requests, causing 100% CPU usage and denying access to legitimate users. What cyber attack is occurring?', ['Phishing', 'Distributed Denial of Service (DDoS)', 'ARP Poisoning', 'SQL Injection'], 1, 'DDoS attacks overwhelm system resources or network bandwidth using distributed botnets.', { 0: 'Phishing tricks users via fake emails.', 2: 'ARP poisoning spoofs MAC address tables.', 3: 'SQL injection targets database queries.' }),
        createQ('[HARD] What is Stateful Packet Inspection (SPI) on an enterprise Firewall?', ['Tracking active TCP/UDP session states in a connection table to permit return traffic for established outbound requests while blocking unsolicited inbound probes', 'Checking cable color', 'Counting monitor displays', 'Scanning PDFs for viruses only'], 0, 'Stateful firewalls maintain connection tables to permit legitimate return traffic automatically while blocking unauthorized inbound probes.', { 1: 'Cable color is physical.', 2: 'Monitors are displays.', 3: 'PDF scanning is antivirus inspection.' }),
        createQ('[HARD] What is Zero Trust Network Architecture (ZTNA)?', ['Trusting all computers on the local office LAN by default', 'A security framework operating on "Never Trust, Always Verify", requiring strict identity authentication and authorization for every access request regardless of location', 'Removing all firewalls', 'Using no passwords'], 1, 'Zero Trust assumes threats exist inside and outside the perimeter, requiring continuous verification for every access attempt.', { 0: 'Implicit LAN trust is legacy perimeter security.', 2: 'ZTNA relies heavily on firewalls and microsegmentation.', 3: 'ZTNA enforces strong MFA authentication.' }),
        createQ('[HARD] What is the difference between Symmetric Encryption (AES-256) and Asymmetric Encryption (RSA-4096)?', ['Symmetric uses the same shared secret key for encryption and decryption; Asymmetric uses a mathematically linked Public/Private key pair', 'Symmetric uses no keys', 'Asymmetric is 1000x faster for bulk file transfers', 'Symmetric only runs on Linux'], 0, 'Symmetric AES uses one shared key (fast bulk encryption); Asymmetric uses public/private key pairs (secure key exchange).', { 1: 'Symmetric requires shared secret keys.', 2: 'Symmetric AES is much faster than Asymmetric RSA.', 3: 'Both run on all platforms.' })
      ]
    }
  ];

  console.log(`📚 Inserting ${topicsData.length} Educational Topics and Quiz Banks...`);

  for (const topic of topicsData) {
    const course = await prisma.course.create({
      data: {
        slug: topic.slug,
        title: topic.title,
        tagline: topic.tagline,
        category: topic.category,
        description: topic.description,
        level: topic.level,
        icon: topic.icon,
        estimatedHours: topic.estimatedHours,
        published: true,
        modules: {
          create: [
            {
              title: `Module 1: ${topic.title}`,
              description: `Master core concept principles and practical applications for ${topic.title}.`,
              order: 1,
              lessons: {
                create: [
                  {
                    title: topic.lessonTitle,
                    slug: topic.lessonSlug,
                    type: LessonType.THEORY,
                    durationMinutes: 15,
                    order: 1,
                    contentJson: {
                      shortExplanation: topic.shortExplanation,
                      theory: topic.theory,
                      analogy: topic.analogy,
                      keyConcepts: topic.keyConcepts,
                      practicalActivity: topic.practicalActivity,
                    },
                    quizzes: {
                      create: [
                        {
                          title: `${topic.title} Concept Assessment`,
                          passingScore: 80,
                          questions: {
                            create: topic.questions.map((q) => ({
                              questionText: q.questionText,
                              optionsJson: q.optionsJson,
                              correctOption: q.correctOption,
                              explanation: q.explanation,
                              explanationsJson: q.explanationsJson,
                            })),
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log(`  ✓ Seeded Topic Course: "${course.title}" (${topic.questions.length} Quiz Qs)`);
  }

  console.log('✅ Educational Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
