import os
import re
import json
import hashlib

TEXTBOOK_ROOT = os.environ.get('TEXTBOOK_ROOT', os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs')))
MASTER_MD = os.path.join(TEXTBOOK_ROOT, 'CS221-Networking-Complete-Mastery.md')
CURRICULUM_MAP_MD = os.path.join(TEXTBOOK_ROOT, '01_Course_Outline', 'Master_Curriculum_Map.md')
ORIGINAL_MODS_DIR = os.path.join(TEXTBOOK_ROOT, '02_Original_Modules')

def build_manifest():
    with open(MASTER_MD, 'r', encoding='utf-8') as f:
        master_text = f.read()

    master_sha256 = hashlib.sha256(master_text.encode('utf-8')).hexdigest()
    lines = master_text.splitlines()

    manifest = {
        "textbookMetadata": {
            "title": "CS-221 Computer Networking: Complete Mastery Textbook",
            "edition": "2026 Edition — University, CCNA & Packet-Level Engineering",
            "author": "Qamar Abbas",
            "curriculum": "CS-221 Computer Networking (BSCS Foundation Program)",
            "pedagogicalModel": "Roman Urdu Explanations + English Technical Terminology (9-Level Progression)",
            "coreMentalModel": "What actually happens to the packet?",
            "canonicalFile": "CS221-Networking-Complete-Mastery.md",
            "canonicalSha256": master_sha256,
            "totalLines": len(lines),
            "totalCharacters": len(master_text),
            "standardsReferences": [
                "RFC 768 (UDP)",
                "RFC 791 (IPv4)",
                "RFC 792 (ICMPv4)",
                "RFC 793 (TCP)",
                "RFC 826 (ARP)",
                "RFC 896 (Congestion Control / Nagle)",
                "RFC 1034 / 1035 (DNS)",
                "RFC 1519 (CIDR)",
                "RFC 1918 (Private IPv4 Address Allocation)",
                "RFC 2018 (TCP SACK)",
                "RFC 2131 (DHCP)",
                "RFC 2328 (OSPFv2)",
                "RFC 3022 (Traditional NAT / PAT)",
                "RFC 4271 (BGP-4)",
                "RFC 4861 / 4862 (IPv6 NDP & SLAAC)",
                "RFC 4941 (IPv6 Privacy Extensions)",
                "RFC 5952 (IPv6 Text Representation)",
                "RFC 6762 (mDNS)",
                "RFC 8200 (IPv6 Specification)",
                "RFC 8446 (TLS 1.3)",
                "RFC 9000 (QUIC)",
                "RFC 9110 (HTTP Semantics)",
                "RFC 9114 (HTTP/3)",
                "RFC 9293 (TCP Modern Specification)",
                "IEEE 802.3 (Ethernet)",
                "IEEE 802.1Q (VLAN Tagging)",
                "IEEE 802.1D / 802.1w (STP / RSTP)",
                "IEEE 802.11a/b/g/n/ac/ax/be (Wi-Fi 4 through 7)"
            ]
        },
        "parts": [],
        "chapters": [],
        "supplementalSections": []
    }

    # Parse parts from curriculum map
    if os.path.exists(CURRICULUM_MAP_MD):
        with open(CURRICULUM_MAP_MD, 'r', encoding='utf-8') as f:
            curr_text = f.read()

        part_matches = list(re.finditer(r'### (PART [I|V|X]+: [^\n]+)', curr_text))
        for idx, pm in enumerate(part_matches):
            p_start = pm.start()
            p_end = part_matches[idx+1].start() if idx+1 < len(part_matches) else len(curr_text)
            p_chunk = curr_text[p_start:p_end]
            p_title = pm.group(1).strip()
            mod_names = re.findall(r'- \*\*Module (\d+): ([^\*]+)\*\*', p_chunk)
            manifest["parts"].append({
                "partTitle": p_title,
                "moduleRange": [int(m[0]) for m in mod_names]
            })

    # Parse modules from master_text
    module_matches = list(re.finditer(r'^# (MODULE \d+ [^\n]+|CS-221 [^\n]+)', master_text, re.MULTILINE))
    
    for i, m in enumerate(module_matches):
        start = m.start()
        end = module_matches[i+1].start() if i+1 < len(module_matches) else len(master_text)
        mod_chunk = master_text[start:end]
        raw_header = m.group(1).strip()

        # Check if it's a numeric module or supplemental
        mod_num_match = re.match(r'MODULE\s+(\d+)\s+[–\-\—\?]\s+(.+)', raw_header)
        
        # Extract sections ##
        section_matches = list(re.finditer(r'^## ([^\n]+)', mod_chunk, re.MULTILINE))
        sections = []
        for s in section_matches:
            sec_title = s.group(1).strip()
            if not sec_title.startswith("2026 Edition"):
                sections.append(sec_title)

        # Extract subsections ###
        subsections = [sub.group(1).strip() for sub in re.finditer(r'^### ([^\n]+)', mod_chunk, re.MULTILINE)]
        
        # Extract major concepts
        concepts = []
        for line in mod_chunk.splitlines():
            if line.startswith("### Concept") or line.startswith("### Deep Technical"):
                pass
            if line.startswith("Concept:") or "Bit =" in line or "Data =" in line:
                concepts.append(line.strip()[:100])

        # RFC references
        mod_rfcs = sorted(list(set(re.findall(r'RFC\s*(\d+)', mod_chunk, re.IGNORECASE))))
        
        # Code/diagram blocks
        diagram_blocks = len(re.findall(r'```(?:text|ascii|mermaid)?[\s\S]*?```', mod_chunk))

        # Check quizzes/problems
        has_quiz = "### Quiz" in mod_chunk or "MCQ" in mod_chunk or "Question" in mod_chunk or "EXAM" in mod_chunk
        has_lab = "### Practical Lab" in mod_chunk or "Wireshark" in mod_chunk or "Packet Tracer" in mod_chunk or "Lab" in mod_chunk

        chunk_hash = hashlib.sha256(mod_chunk.encode('utf-8')).hexdigest()

        if mod_num_match:
            ch_num = int(mod_num_match.group(1))
            ch_title = mod_num_match.group(2).strip()
            manifest["chapters"].append({
                "chapterNumber": ch_num,
                "chapterTitle": ch_title,
                "rawHeader": raw_header,
                "sections": sections,
                "subsections": subsections[:12],
                "rfcs": mod_rfcs,
                "diagramsCount": diagram_blocks,
                "hasAssessment": has_quiz,
                "hasLab": has_lab,
                "characterCount": len(mod_chunk),
                "lineCount": len(mod_chunk.splitlines()),
                "contentHash": chunk_hash
            })
        else:
            manifest["supplementalSections"].append({
                "sectionTitle": raw_header,
                "sections": sections,
                "rfcs": mod_rfcs,
                "diagramsCount": diagram_blocks,
                "characterCount": len(mod_chunk),
                "lineCount": len(mod_chunk.splitlines()),
                "contentHash": chunk_hash
            })

    output_path = os.path.join(os.getcwd(), 'backend', 'src', 'topics', 'data', 'textbook-manifest.json')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    docs_path = os.path.join(os.getcwd(), 'docs', 'textbook-manifest.json')
    with open(docs_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"Manifest written successfully to {output_path} and {docs_path}")
    print(f"Chapters indexed: {len(manifest['chapters'])}, Supplemental sections: {len(manifest['supplementalSections'])}")

if __name__ == '__main__':
    build_manifest()
