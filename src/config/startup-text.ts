export const startupText = `[    0.000000] Linux version 6.8.0-45-generic (buildd@lcy02-amd64-013) (x86_64-linux-gnu-gcc-13 (Ubuntu 13.2.0-23ubuntu4) 13.2.0, GNU ld (GNU Binutils for Ubuntu) 2.42) #49~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC Tue Nov 12 15:35:52 UTC 2025 (Ubuntu 6.8.0-45.49~22.04.1)
[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.8.0-45-generic root=UUID=1234-5678-9abc-def0 ro rootwait console=ttyS0,115200 console=tty0
[    0.000000] BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009dfff] usable
[    0.000000] BIOS-e820: [mem 0x000000000009e000-0x000000000009ffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000007fffffff] usable
[    0.000000] BIOS-e820: [mem 0x0000000080000000-0x000000008fffffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000090000000-0x00000000dfffffff] usable
[    0.000000] BIOS-e820: [mem 0x00000000e0000000-0x00000000efffffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000f0000000-0x00000000f3ffffff] usable
[    0.000000] BIOS-e820: [mem 0x00000000f4000000-0x00000000feffffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000ff000000-0x00000000ffffffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000100000000-0x000000047fffffff] usable
[    0.004000] NX (Execute Disable) protection: active
[    0.004001] APIC: Static calls initialized
[    0.004002] SMBIOS 3.3.0 present.
[    0.004003] DMI: Dell Inc. OptiPlex 7090/0XXXXX, BIOS 1.34.0 01/15/2026
[    0.004004] tsc: Fast TSC calibration using PIT
[    0.004005] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved
[    0.004006] e820: update [mem 0xfee00000-0xfeffffff] usable ==> reserved
[    0.004007] last_pfn = 0x480000 max_arch_pfn = 0x400000000
[    0.004008] total RAM covered: 8192M
[    0.004009] Found optimal setting for mtrr clean up
[    0.004010]  gran_size: 64K 	chunk_size: 64K 	num_reg: 3  	lose cover RAM: 0G
[    0.004011] MTRR map: 7 entries (5 fixed + 2 variable; 0 disabled)
[    0.004012] x86/PAT: MTRRs disabled, skipping PAT initialization too.
[    0.004013] CPU: Intel(R) Core(TM) i7-11700 @ 2.50GHz (family: 0x6, model: 0xc7, stepping: 0x1)
[    0.004014] CPU: x86-64 processor with FPU, 16 logical CPUs
[    0.004015] CPU topology: 8 cores, 16 threads
[    0.004016] CPU(s): supports 1 CPU groups
[    0.004017] CPU0: Thermal monitoring enabled (TM2)
[    0.004018] CPU0: Machine Check Exception: 3 banks, 0 cs
[    0.004019] CPU0: FPU registers optimized for wide vector sizes
[    0.004020] CPU0: +TME +TSC_RELIABLE +SMAP +SMCA +SEV +SEV-ES +RDPID +FSGSBASE
[    0.004021] CPU0: +AVX512 +AVX512PF +AVX512VL +AVX512F +AVX512DQ +AVX512CD +AVX512BW +AVX512_VNNI
[    0.004022] CPU0: +AVX512_BF16 +AVX512_VBMI2 +AVX512_VBMI +AVX512_VPOPCNTDQ +AVX512_FP16
[    0.004023] CPU0: +VAES +VPCLMULQDQ +RDPID
[    0.004024] CPU0: SMCA supported, but CPUID 0x80000026 not supported
[    0.004025] CPU0: SEV supported, but SEV-ES not available
[    0.004026] Freeing SMP alternatives memory: 40K
[    0.004027] PIT: max PIT rate 3579545 Hz
[    0.004028] APIC timer: Using the hpet2 timer
[    0.004029] tsc: Detected 2496.123 MHz TSC
[    0.004030] tsc: Refined TSC clocksource calibration: 2496.123 MHz
[    0.004031] clocksource: hpet: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 133484882848 ns
[    0.004032] clocksource: tsc-early: mask: 0xffffffffffffffff max_cycles: 0x2407e3a1b7e, max_idle_ns: 440795313750 ns
[    0.004033] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x2407e3a1b7e, max_idle_ns: 440795313750 ns
[    0.004034] timer: hpet clockevent device registered
[    0.004035] APIC timer: Using the local APIC timer
[    0.004036] Calibrating delay loop (skipped), value calculated using timer frequency.. 4992.24 BogoMIPS (lpj=9994485)
[    0.004037] CPU0: +rdtscp +constant_tsc +nonstop_tsc cpuid +tsc_known_freq
[    0.004038] CPU0: +md_clear +mpx +rdtscp +avx512_bf16 +avx512_vpopcntdq
[    0.004039] perf: SGX disabled by BIOS
[    0.004040] SMP: 16 logical CPUs active
[    0.004041] devtmpfs: initialized
[    0.004042] x86/mm: Memory block size: 128MB
[    0.004043] ACPI: Early table checksum verification disabled
[    0.004044] ACPI: RSDP 0x00000000FFFC1094 000024 (v02 DELL )
[    0.004045] ACPI: XSDT 0x00000000FFFC1080 00005C (v01 DELL   FLC  00010000      01000013)
[    0.004046] ACPI: FACP 0x00000000FFFC1040 00010C (v05 DELL   FLC  00010000      01000013)
[    0.004047] ACPI: DSDT 0x00000000FFFC0000 14A3F5 (v02 DELL   FLC  00010000 INTL 20200110)
[    0.004048] ACPI: FACS 0x00000000FFFE1000 000040
[    0.004049] ACPI: FPDT 0x00000000FFFC1030 000044 (v01 DELL   FLC  00010000      01000013)
[    0.004050] ACPI: FIDT 0x00000000FFFC1020 00009C (v01 DELL   FLC  00010000      01000013)
[    0.004051] ACPI: MCFG 0x00000000FFFC1010 000040 (v01 DELL   FLC  00010000      01000013)
[    0.004052] ACPI: HPET 0x00000000FFFC0FF0 000038 (v01 DELL   FLC  00010000      01000013)
[    0.004053] ACPI: SSDT 0x00000000FFFC0E90 004B1D (v02 DELL   CpuSsDt 00010000 INTL 20200110)
[    0.004054] ACPI: Reserving FACP table memory at [mem 0xfffc1040-0xfffc114b]
[    0.004055] ACPI: Reserving DSDT table memory at [mem 0xfffc0000-0xfffeaef4]
[    0.004056] ACPI: Reserving FACS table memory at [mem 0xfffe1000-0xfffe103f]
[    0.004057] ACPI: Reserving FPDT table`;
