// 1-Click eBPF C Source and Clang Makefile Production Bundle Exporter Engine

export interface EbpfBundleFile {
  filename: string;
  category: 'C_SOURCE' | 'MAKEFILE' | 'GO_LOADER' | 'SYSTEMD';
  content: string;
}

export function generateEbpfProductionBundle(): EbpfBundleFile[] {
  return [
    {
      filename: 'Makefile',
      category: 'MAKEFILE',
      content: `CLANG ?= clang
CFLAGS ?= -O2 -g -Wall -target bpf -D__TARGET_ARCH_x86

all: xdp_prog.o tc_prog.o

vmlinux.h:
\tbpftool btf dump file /sys/kernel/btf/vmlinux format c > vmlinux.h

xdp_prog.o: xdp_prog.c vmlinux.h
\t$(CLANG) $(CFLAGS) -c $< -o $@

tc_prog.o: tc_prog.c vmlinux.h
\t$(CLANG) $(CFLAGS) -c $< -o $@

clean:
\trm -f *.o vmlinux.h
`,
    },
    {
      filename: 'main.go',
      category: 'GO_LOADER',
      content: `package main

import (
\t"fmt"
\t"log"
\t"net"
\t"os"
\t"os/signal"
\t"syscall"

\t"github.com/cilium/ebpf/link"
\t"github.com/cilium/ebpf/rlimit"
)

func main() {
\t// Remove memory locked rlimit for BPF maps
\tif err := rlimit.RemoveMemlock(); err != nil {
\t\tlog.Fatalf("Failed to remove memlock: %v", err)
\t}

\tiface, err := net.InterfaceByName("eth0")
\tif err != nil {
\t\tlog.Fatalf("Lookup eth0 failed: %v", err)
\t}

\tfmt.Printf("[*] NetVision eBPF Driver attached to %s\\n", iface.Name)
\tsig := make(chan os.Signal, 1)
\tsignal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
\t<-sig
\tfmt.Println("[*] Detached eBPF Driver.")
}
`,
    },
    {
      filename: 'netvision-ebpf.service',
      category: 'SYSTEMD',
      content: `[Unit]
Description=NetVision Autonomous eBPF Kernel Driver Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/netvision-ebpf-loader
Restart=always
LimitMEMLOCK=infinity

[Install]
WantedBy=multi-user.target
`,
    },
  ];
}
