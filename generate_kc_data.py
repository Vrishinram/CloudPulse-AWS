import json
import os

modules_data = {
    "Cloud Foundations": [
        {
            "topic": "KC - Introduction to Cloud Computing",
            "questions": [
                {
                    "id": "cf-intro-1",
                    "question": "Which of the following best defines cloud computing according to the NIST and AWS definitions?",
                    "options": [
                        "The on-demand delivery of IT resources over the internet with pay-as-you-go pricing",
                        "The practice of running dedicated private physical servers in an on-premises data center",
                        "A local storage system using network-attached drives to backup office workstations",
                        "A software distribution model where applications are purchased exclusively via physical media"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Cloud computing is the on-demand delivery of IT resources (compute, storage, database, networking) over the internet with pay-as-you-go pricing, eliminating upfront capital infrastructure investments."
                },
                {
                    "id": "cf-intro-2",
                    "question": "Which cloud computing deployment model allows an organization to keep sensitive data on-premises while leveraging the public cloud for scalable workloads?",
                    "options": [
                        "Pure Public Cloud",
                        "Hybrid Cloud",
                        "Private Cloud exclusively",
                        "Community Cloud only"
                    ],
                    "correctAnswer": 1,
                    "explanation": "A Hybrid Cloud deployment connects on-premises infrastructure or private clouds with public cloud resources, enabling data portability and seamless integration."
                }
            ]
        },
        {
            "topic": "KC - Basic Computing Concepts",
            "questions": [
                {
                    "id": "cf-basic-1",
                    "question": "In basic computing architecture, what is the primary role of Random Access Memory (RAM)?",
                    "options": [
                        "To provide permanent, non-volatile long-term storage for archive files",
                        "To deliver fast, volatile temporary working memory for currently running processes",
                        "To translate domain names into corresponding IP addresses",
                        "To modulate analog signals into digital pulses across Ethernet cables"
                    ],
                    "correctAnswer": 1,
                    "explanation": "RAM is fast, volatile primary storage used by the CPU to hold instructions and data for active processes. When power is lost, data in RAM is cleared."
                },
                {
                    "id": "cf-basic-2",
                    "question": "What is the primary function of a hypervisor in virtualization technology?",
                    "options": [
                        "To inspect network packets for malware signatures",
                        "To create, run, and manage virtual machines by abstracting physical hardware",
                        "To encrypt database tables at rest using AES-256 keys",
                        "To balance incoming HTTP traffic across web servers"
                    ],
                    "correctAnswer": 1,
                    "explanation": "A hypervisor (or Virtual Machine Monitor) is software or firmware that creates and runs virtual machines by virtualizing hardware resources like CPU, memory, and storage."
                }
            ]
        },
        {
            "topic": "KC - What is Cloud Computing?",
            "questions": [
                {
                    "id": "cf-whatis-1",
                    "question": "Which service model gives the consumer the highest level of control over operating systems, storage, and deployed applications?",
                    "options": [
                        "Infrastructure as a Service (IaaS)",
                        "Platform as a Service (PaaS)",
                        "Software as a Service (SaaS)",
                        "Function as a Service (FaaS)"
                    ],
                    "correctAnswer": 0,
                    "explanation": "IaaS provides fundamental compute, storage, and networking resources. The customer is responsible for managing the operating system, middleware, and application runtime."
                },
                {
                    "id": "cf-whatis-2",
                    "question": "A customer uses Google Workspace or Microsoft 365 where the vendor manages all infrastructure, runtime, and software maintenance. Which cloud service model is this?",
                    "options": [
                        "Infrastructure as a Service (IaaS)",
                        "Software as a Service (SaaS)",
                        "Platform as a Service (PaaS)",
                        "Hardware as a Service (HaaS)"
                    ],
                    "correctAnswer": 1,
                    "explanation": "Software as a Service (SaaS) delivers end-user applications over the web where the cloud service provider manages everything including hardware, OS, application code, and maintenance."
                }
            ]
        },
        {
            "topic": "KC - Advantages of Cloud Computing",
            "questions": [
                {
                    "id": "cf-adv-1",
                    "question": "Which AWS cloud advantage refers to trading capital expense (CapEx) for variable expense (OpEx)?",
                    "options": [
                        "Paying only for resources consumed instead of investing heavily upfront in data centers and servers",
                        "Purchasing physical hardware with five-year depreciation schedules",
                        "Contracting third-party colocation facilities with long-term leasing commitments",
                        "Deploying custom server chassis designed for maximum thermal dissipation"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Trading capital expense for variable expense allows organizations to pay only for the compute and storage resources they consume, without large upfront capital investments."
                },
                {
                    "id": "cf-adv-2",
                    "question": "Which advantage of cloud computing enables a company to deploy applications globally to customers in multiple geographic regions within minutes?",
                    "options": [
                        "Massive economies of scale",
                        "Go global in minutes",
                        "Stop guessing capacity",
                        "Benefit from operational obsolescence"
                    ],
                    "correctAnswer": 1,
                    "explanation": "'Go global in minutes' allows businesses to easily deploy applications to multiple AWS Regions around the world with just a few clicks, reducing latency for global users."
                }
            ]
        },
        {
            "topic": "KC - What is Amazon Web Services?",
            "questions": [
                {
                    "id": "cf-aws-1",
                    "question": "Which interface allows developers and administrators to automate interactions with AWS services using command-line scripts?",
                    "options": [
                        "AWS Management Console",
                        "AWS Command Line Interface (AWS CLI)",
                        "AWS Knowledge Center",
                        "AWS Marketplace"
                    ],
                    "correctAnswer": 1,
                    "explanation": "The AWS CLI is an open-source tool that enables interaction with AWS services using commands in your command-line shell, ideal for automation and scripting."
                },
                {
                    "id": "cf-aws-2",
                    "question": "Which AWS programmatic toolset provides language-specific APIs for languages like Python (Boto3), JavaScript, and Java?",
                    "options": [
                        "AWS Software Development Kits (SDKs)",
                        "AWS CloudHSM",
                        "AWS Outposts",
                        "AWS Ground Station"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS SDKs provide language-specific client libraries that enable developers to integrate AWS services directly into their application code."
                }
            ]
        },
        {
            "topic": "KC - Fundamentals of AWS Pricing",
            "questions": [
                {
                    "id": "cf-pricing-1",
                    "question": "What are the three fundamental pricing drivers for most core AWS services?",
                    "options": [
                        "Compute, Storage, and Outbound Data Transfer",
                        "Inbound Data Transfer, CPU Temperature, and Memory Voltage",
                        "User Login Count, Operating System Type, and Firewall Rules",
                        "Storage Size, Domain Registration, and Customer Age"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The three fundamental drivers of cost in AWS are Compute (per hour/second), Storage (per GB), and Outbound Data Transfer (data transfer out from AWS to the internet). Inbound data transfer is generally free."
                },
                {
                    "id": "cf-pricing-2",
                    "question": "Which AWS tool enables you to estimate monthly costs and model architecture spend before deploying resources?",
                    "options": [
                        "AWS Pricing Calculator",
                        "AWS Artifact",
                        "AWS Cost Explorer",
                        "AWS Trusted Advisor"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Pricing Calculator is a web-based planning tool that allows you to create cost estimates for your architecture use cases before launching resources."
                }
            ]
        },
        {
            "topic": "KC - AWS Infrastructure Overview",
            "questions": [
                {
                    "id": "cf-infra-1",
                    "question": "What is an AWS Availability Zone (AZ)?",
                    "options": [
                        "A geographical region containing at least 10 countries",
                        "One or more discrete data centers with redundant power, networking, and connectivity in an AWS Region",
                        "A content delivery cache location operated exclusively by third-party ISPs",
                        "A logical grouping of IAM users and groups across an organization"
                    ],
                    "correctAnswer": 1,
                    "explanation": "An Availability Zone (AZ) consists of one or more discrete data centers, each with redundant power, networking, and connectivity, housed in separate facilities within an AWS Region."
                },
                {
                    "id": "cf-infra-2",
                    "question": "Which infrastructure component does Amazon CloudFront use to deliver content to end users with low latency?",
                    "options": [
                        "Edge Locations",
                        "Local Storage Gateways",
                        "VPC Endpoints",
                        "Transit Gateways"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon CloudFront uses a worldwide network of Edge Locations and regional edge caches to cache and deliver content with ultra-low latency."
                }
            ]
        },
        {
            "topic": "KC - AWS Services and Service Categories",
            "questions": [
                {
                    "id": "cf-services-1",
                    "question": "Under which AWS service category do Amazon VPC, Route 53, and Elastic Load Balancing belong?",
                    "options": [
                        "Compute",
                        "Networking and Content Delivery",
                        "Security, Identity, and Compliance",
                        "Management and Governance"
                    ],
                    "correctAnswer": 1,
                    "explanation": "Amazon VPC, Route 53, CloudFront, Direct Connect, and Elastic Load Balancing belong to the Networking and Content Delivery category."
                },
                {
                    "id": "cf-services-2",
                    "question": "Which AWS service is categorized under Management and Governance and tracks user actions and API calls?",
                    "options": [
                        "AWS CloudTrail",
                        "Amazon Aurora",
                        "AWS Glue",
                        "Amazon Athena"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS CloudTrail records AWS API calls and governance events, belonging to the Management and Governance service category."
                }
            ]
        },
        {
            "topic": "KC - Shared Responsibility Model",
            "questions": [
                {
                    "id": "cf-shared-1",
                    "question": "According to the AWS Shared Responsibility Model, which responsibility belongs exclusively to AWS?",
                    "options": [
                        "Configuring guest OS firewall rules",
                        "Patching the host virtualization software and physical data center facilities",
                        "Managing customer data encryption keys in application code",
                        "Setting up IAM password policies and MFA for IAM users"
                    ],
                    "correctAnswer": 1,
                    "explanation": "AWS is responsible for 'Security OF the Cloud' - protecting the physical data centers, host hardware, hypervisors, and core networking infrastructure."
                },
                {
                    "id": "cf-shared-2",
                    "question": "Under the Shared Responsibility Model for Amazon EC2, which task is the customer's responsibility?",
                    "options": [
                        "Replacing defective physical RAM in server racks",
                        "Updating and patching the guest operating system installed on the EC2 instance",
                        "Maintaining physical perimeter security at the data center",
                        "Decommissioning failing physical hard drives"
                    ],
                    "correctAnswer": 1,
                    "explanation": "For IaaS services like EC2, the customer is responsible for 'Security IN the Cloud', including guest OS updates, security patches, firewall configuration, and application security."
                }
            ]
        },
        {
            "topic": "KC - Introduction to Amazon S3",
            "questions": [
                {
                    "id": "cf-s3-1",
                    "question": "What is the fundamental unit of storage in Amazon Simple Storage Service (Amazon S3)?",
                    "options": [
                        "Objects stored inside Buckets",
                        "Block volumes attached to instances",
                        "Mounted NFS directories",
                        "Structured relational database rows"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon S3 is an object storage service. Data is stored as individual objects (consisting of data, key, and metadata) organized within buckets."
                },
                {
                    "id": "cf-s3-2",
                    "question": "Which Amazon S3 storage class offers the lowest cost for long-term archiving where retrieval time of several hours is acceptable?",
                    "options": [
                        "S3 Standard",
                        "S3 Glacier Flexible Retrieval / Deep Archive",
                        "S3 One Zone-IA",
                        "S3 Standard-IA"
                    ],
                    "correctAnswer": 1,
                    "explanation": "S3 Glacier Deep Archive is Amazon S3's lowest-cost storage class, designed for long-term archival where data is accessed once or twice a year and retrieval times of 3 to 12 hours are acceptable."
                }
            ]
        },
        {
            "topic": "KC - Introduction to Amazon EC2",
            "questions": [
                {
                    "id": "cf-ec2-1",
                    "question": "What does an Amazon Machine Image (AMI) provide when launching an Amazon EC2 instance?",
                    "options": [
                        "A template containing the software configuration (operating system, application server, and applications)",
                        "A physical power supply rating for the virtual server",
                        "A permanent domain name registered on public DNS root servers",
                        "An automated credit card billing authorization token"
                    ],
                    "correctAnswer": 0,
                    "explanation": "An AMI provides the required information to launch an instance, including the operating system, storage volume mappings, and pre-installed application software."
                },
                {
                    "id": "cf-ec2-2",
                    "question": "Which Amazon EC2 purchasing option provides up to a 90% discount for fault-tolerant workloads that can handle sudden interruptions?",
                    "options": [
                        "On-Demand Instances",
                        "Spot Instances",
                        "Reserved Instances",
                        "Dedicated Hosts"
                    ],
                    "correctAnswer": 1,
                    "explanation": "Spot Instances take advantage of unused EC2 capacity in the AWS cloud at up to a 90% discount compared to On-Demand prices, but AWS can reclaim them with a 2-minute warning."
                }
            ]
        }
    ],
    "Linux": [
        {
            "topic": "KC - An Introduction to Linux",
            "questions": [
                {
                    "id": "lx-intro-1",
                    "question": "What core component of the Linux operating system directly controls hardware resources and allocates system memory and CPU time?",
                    "options": [
                        "The Shell",
                        "The Kernel",
                        "The Desktop Environment",
                        "The Package Manager"
                    ],
                    "correctAnswer": 1,
                    "explanation": "The Linux Kernel is the core program that manages system resources, memory allocation, process scheduling, and hardware drivers."
                },
                {
                    "id": "lx-intro-2",
                    "question": "Which open-source software license is the Linux kernel distributed under?",
                    "options": [
                        "GNU General Public License version 2 (GPLv2)",
                        "Apache License 2.0",
                        "MIT License",
                        "Proprietary Commercial EULA"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Linus Torvalds released the Linux kernel under the GNU General Public License (GPLv2), ensuring it remains free and open-source."
                }
            ]
        },
        {
            "topic": "KC - Linux Command Line",
            "questions": [
                {
                    "id": "lx-cli-1",
                    "question": "Which Linux command displays the current absolute path of the directory you are working in?",
                    "options": [
                        "whoami",
                        "pwd",
                        "ls",
                        "locate"
                    ],
                    "correctAnswer": 1,
                    "explanation": "`pwd` stands for 'Print Working Directory' and displays the full absolute path of the current working directory."
                },
                {
                    "id": "lx-cli-2",
                    "question": "Which flag is commonly passed to `ls` to display detailed file information including permissions, owner, size, and modification timestamp?",
                    "options": [
                        "-l",
                        "-r",
                        "-x",
                        "-q"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`ls -l` formats the directory listing in long format, showing file permissions, number of links, owner, group, file size, and timestamp."
                }
            ]
        },
        {
            "topic": "KC - Users and Groups",
            "questions": [
                {
                    "id": "lx-users-1",
                    "question": "In Linux systems, which file contains the hashed encrypted passwords for local user accounts?",
                    "options": [
                        "/etc/passwd",
                        "/etc/shadow",
                        "/etc/group",
                        "/etc/security"
                    ],
                    "correctAnswer": 1,
                    "explanation": "While `/etc/passwd` contains general account information, encrypted password hashes are stored securely in `/etc/shadow`, readable only by root."
                },
                {
                    "id": "lx-users-2",
                    "question": "Which command is used by a system administrator to create a new user account in Linux?",
                    "options": [
                        "useradd",
                        "groupadd",
                        "usermod",
                        "chown"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`useradd` (or `adduser`) is used to create new user accounts in Linux systems."
                }
            ]
        },
        {
            "topic": "KC - Editing Files",
            "questions": [
                {
                    "id": "lx-edit-1",
                    "question": "In the `vim` text editor, how do you switch from Command (Normal) mode into Insert mode to type text?",
                    "options": [
                        "Press the 'i' key",
                        "Press Ctrl + C",
                        "Type ':wq'",
                        "Press Esc twice"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Pressing 'i' (insert) in Vim normal mode enters Insert mode, allowing the user to start typing text."
                },
                {
                    "id": "lx-edit-2",
                    "question": "In `vim`, which sequence of keystrokes saves changes and exits the editor from Normal mode?",
                    "options": [
                        ":wq followed by Enter",
                        ":q! followed by Enter",
                        "Ctrl + S",
                        ":edit! followed by Enter"
                    ],
                    "correctAnswer": 0,
                    "explanation": "In Vim command mode, `:wq` stands for 'write and quit', saving changes to the file and exiting."
                }
            ]
        },
        {
            "topic": "KC - Working with the File System",
            "questions": [
                {
                    "id": "lx-fs-1",
                    "question": "According to the Linux Filesystem Hierarchy Standard (FHS), which directory holds system-wide configuration files?",
                    "options": [
                        "/bin",
                        "/etc",
                        "/var",
                        "/tmp"
                    ],
                    "correctAnswer": 1,
                    "explanation": "The `/etc` directory contains host-specific system-wide configuration files in Linux."
                },
                {
                    "id": "lx-fs-2",
                    "question": "Which directory in the Linux FHS is used for variable data such as system logs, mail queues, and databases?",
                    "options": [
                        "/usr",
                        "/var",
                        "/opt",
                        "/boot"
                    ],
                    "correctAnswer": 1,
                    "explanation": "The `/var` directory contains variable data files whose contents are expected to continually change during normal system operation, including `/var/log`."
                }
            ]
        },
        {
            "topic": "KC - Working with Files",
            "questions": [
                {
                    "id": "lx-files-1",
                    "question": "Which Linux command is used to copy files or directories from one location to another?",
                    "options": [
                        "mv",
                        "cp",
                        "rm",
                        "touch"
                    ],
                    "correctAnswer": 1,
                    "explanation": "`cp` is the copy command. To copy directories recursively, the `-r` flag is used (`cp -r`)."
                },
                {
                    "id": "lx-files-2",
                    "question": "Which command creates an empty file if it does not exist, or updates its access and modification timestamp if it does?",
                    "options": [
                        "echo",
                        "touch",
                        "mkdir",
                        "cat"
                    ],
                    "correctAnswer": 1,
                    "explanation": "The `touch` command updates the access and modification times of a file, or creates an empty new file if the specified name does not exist."
                }
            ]
        },
        {
            "topic": "KC - Managing File Permissions",
            "questions": [
                {
                    "id": "lx-perm-1",
                    "question": "What permission representation corresponds to the octal value `755` in Linux?",
                    "options": [
                        "rwxr-xr-x",
                        "rw-r--r--",
                        "rwx------",
                        "r-xr-xr-x"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Octal 7 = 4+2+1 (rwx), Octal 5 = 4+0+1 (r-x). Therefore 755 represents Owner: rwx, Group: r-x, Others: r-x."
                },
                {
                    "id": "lx-perm-2",
                    "question": "Which command changes the ownership of a file named `web.conf` to user `ubuntu` and group `www-data`?",
                    "options": [
                        "chmod ubuntu:www-data web.conf",
                        "chown ubuntu:www-data web.conf",
                        "usermod -aG www-data web.conf",
                        "chgrp ubuntu web.conf"
                    ],
                    "correctAnswer": 1,
                    "explanation": "`chown user:group filename` is used to change both user and group ownership of files in Linux."
                }
            ]
        },
        {
            "topic": "KC - Working with Commands",
            "questions": [
                {
                    "id": "lx-cmd-1",
                    "question": "In Linux, what operator redirects the standard output (stdout) of a command and appends it to an existing file without overwriting?",
                    "options": [
                        ">",
                        ">>",
                        "<",
                        "|"
                    ],
                    "correctAnswer": 1,
                    "explanation": "`>>` appends stdout to the destination file. Single `>` redirects stdout and overwrites the destination file."
                },
                {
                    "id": "lx-cmd-2",
                    "question": "What is the function of the pipe operator (`|`) in a Linux shell?",
                    "options": [
                        "To send the standard output of the first command as the standard input to the second command",
                        "To execute two commands simultaneously in separate background subshells",
                        "To redirect standard error to `/dev/null`",
                        "To prompt the user for password credentials"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The pipe operator (`|`) connects the standard output (stdout) of the preceding command directly to the standard input (stdin) of the following command."
                }
            ]
        },
        {
            "topic": "KC - Managing Processes",
            "questions": [
                {
                    "id": "lx-proc-1",
                    "question": "Which command displays an interactive real-time view of running processes, CPU load, and memory usage?",
                    "options": [
                        "ps",
                        "top",
                        "df",
                        "free"
                    ],
                    "correctAnswer": 1,
                    "explanation": "`top` (and `htop`) provides an interactive, real-time dynamic view of active system processes, CPU, and memory utilization."
                },
                {
                    "id": "lx-proc-2",
                    "question": "Which signal number is sent by `kill -9 <PID>` to immediately terminate a process without allowing cleanup?",
                    "options": [
                        "SIGTERM (15)",
                        "SIGKILL (9)",
                        "SIGHUP (1)",
                        "SIGINT (2)"
                    ],
                    "correctAnswer": 1,
                    "explanation": "Signal 9 (`SIGKILL`) forces an immediate kernel-level termination of a process and cannot be caught, ignored, or blocked."
                }
            ]
        },
        {
            "topic": "KC - Managing Services",
            "questions": [
                {
                    "id": "lx-serv-1",
                    "question": "On modern systemd-based Linux distributions, which command configures the `nginx` service to start automatically upon system boot?",
                    "options": [
                        "systemctl enable nginx",
                        "systemctl start nginx",
                        "systemctl restart nginx",
                        "service nginx load"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`systemctl enable <service>` configures the service to launch automatically when the system boots up."
                },
                {
                    "id": "lx-serv-2",
                    "question": "Which command checks the active runtime status and recent log output of the Apache service?",
                    "options": [
                        "systemctl status apache2",
                        "systemctl stop apache2",
                        "ps -u apache2",
                        "systemctl reload-daemon"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`systemctl status <service>` displays whether a service is active (running), its PID, memory footprint, and recent systemd journal log lines."
                }
            ]
        },
        {
            "topic": "KC - The Bash Shell",
            "questions": [
                {
                    "id": "lx-bash-1",
                    "question": "Which environment variable in Bash contains a colon-separated list of directories searched for executable commands?",
                    "options": [
                        "$HOME",
                        "$PATH",
                        "$SHELL",
                        "$USER"
                    ],
                    "correctAnswer": 1,
                    "explanation": "The `$PATH` environment variable holds the ordered directory list where the shell searches for executable binary files when a command is entered."
                },
                {
                    "id": "lx-bash-2",
                    "question": "What special shell variable stores the exit status (return code) of the last executed command?",
                    "options": [
                        "$0",
                        "$?",
                        "$$",
                        "$#"
                    ],
                    "correctAnswer": 1,
                    "explanation": "`$?` holds the exit status code of the most recently executed foreground command. A value of `0` indicates success; non-zero indicates an error."
                }
            ]
        },
        {
            "topic": "KC - Bash Shell Scripts",
            "questions": [
                {
                    "id": "lx-scripts-1",
                    "question": "What is the proper shebang line at the very beginning of a Bash script to designate the interpreter?",
                    "options": [
                        "#!/bin/bash",
                        "//bin/bash",
                        "#bash/bin",
                        "<!-- /bin/bash -->"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`#!/bin/bash` is the shebang (or hashbang) directive informing the operating system program loader to execute the file using `/bin/bash`."
                },
                {
                    "id": "lx-scripts-2",
                    "question": "What command must you run on `script.sh` before you can execute it directly with `./script.sh`?",
                    "options": [
                        "chmod +x script.sh",
                        "chown root script.sh",
                        "touch script.sh",
                        "cat script.sh"
                    ],
                    "correctAnswer": 0,
                    "explanation": "A file must have execute permissions (`+x`) before the operating system permits direct execution as a script or binary."
                }
            ]
        },
        {
            "topic": "KC - Software Management",
            "questions": [
                {
                    "id": "lx-sw-1",
                    "question": "On Debian and Ubuntu systems, which command refreshes the local package index cache from remote software repositories?",
                    "options": [
                        "apt update",
                        "apt upgrade",
                        "apt install",
                        "apt purge"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`apt update` (or `apt-get update`) synchronizes the local index of available packages with repository package lists."
                },
                {
                    "id": "lx-sw-2",
                    "question": "On Red Hat, Amazon Linux 2023, and Fedora systems, which modern package manager replaces the legacy `yum` command?",
                    "options": [
                        "pacman",
                        "dnf",
                        "rpm -q",
                        "brew"
                    ],
                    "correctAnswer": 1,
                    "explanation": "`dnf` (Dandified YUM) is the modern package manager for RPM-based distributions like Red Hat Enterprise Linux and Amazon Linux 2023."
                }
            ]
        },
        {
            "topic": "KC - Managing Log Files",
            "questions": [
                {
                    "id": "lx-logs-1",
                    "question": "Which command is used to query and view system logs indexed by the systemd journal service?",
                    "options": [
                        "journalctl",
                        "syslogd",
                        "logrotate",
                        "tail -f /dev/null"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`journalctl` is the utility used to query and inspect logs generated by the systemd-journald logging service."
                },
                {
                    "id": "lx-logs-2",
                    "question": "What is the purpose of the `logrotate` utility in Linux systems?",
                    "options": [
                        "To rotate, compress, truncate, and mail system log files to prevent storage exhaustion",
                        "To encrypt log files with SSL certificates before uploading to S3",
                        "To convert text log files into SQLite database tables",
                        "To restart daemon processes whenever an error log is detected"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`logrotate` is designed to automate log file administration, including scheduled rotation, compression, removal, and archiving of logs to manage disk space."
                }
            ]
        }
    ],
    "Networking": [
        {
            "topic": "KC - Introduction to Networking",
            "questions": [
                {
                    "id": "net-intro-1",
                    "question": "What is the main purpose of a computer network?",
                    "options": [
                        "To allow connected computing devices to exchange data and share resources",
                        "To increase the clock speed of individual CPU microprocessors",
                        "To eliminate the need for operating system security patches",
                        "To convert alternating current into direct current for servers"
                    ],
                    "correctAnswer": 0,
                    "explanation": "A computer network connects autonomous devices together to enable communication, data transfer, and collaborative resource sharing."
                },
                {
                    "id": "net-intro-2",
                    "question": "In the OSI 7-layer model, at which layer do IP addressing and packet routing decisions occur?",
                    "options": [
                        "Layer 2 - Data Link Layer",
                        "Layer 3 - Network Layer",
                        "Layer 4 - Transport Layer",
                        "Layer 7 - Application Layer"
                    ],
                    "correctAnswer": 1,
                    "explanation": "Layer 3 (Network Layer) is responsible for logical addressing (IP addresses), packet encapsulation, and determining routing paths across networks."
                }
            ]
        },
        {
            "topic": "KC - Networking Concepts",
            "questions": [
                {
                    "id": "net-conc-1",
                    "question": "What is the primary difference between Transmission Control Protocol (TCP) and User Datagram Protocol (UDP)?",
                    "options": [
                        "TCP is connection-oriented with guaranteed delivery, while UDP is connectionless without delivery guarantees",
                        "TCP works only with IPv6, while UDP works only with IPv4",
                        "TCP is used exclusively for DNS queries, while UDP is used for web traffic",
                        "TCP operates at Layer 7, while UDP operates at Layer 2"
                    ],
                    "correctAnswer": 0,
                    "explanation": "TCP establishes a 3-way handshake and guarantees reliable, ordered packet delivery with error-checking. UDP is lightweight and connectionless, prioritized for low-latency streaming and gaming."
                },
                {
                    "id": "net-conc-2",
                    "question": "Which device operates at Layer 2 of the OSI model and forwards frames based on hardware MAC addresses?",
                    "options": [
                        "Network Switch",
                        "Router",
                        "Firewall",
                        "Modem"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Network Switches operate at Layer 2 (Data Link) and forward Ethernet frames between connected devices using MAC address tables."
                }
            ]
        },
        {
            "topic": "KC - Internet Protocol [IP]",
            "questions": [
                {
                    "id": "net-ip-1",
                    "question": "How many bits are in an IPv4 address compared to an IPv6 address?",
                    "options": [
                        "IPv4 has 32 bits; IPv6 has 128 bits",
                        "IPv4 has 64 bits; IPv6 has 256 bits",
                        "IPv4 has 16 bits; IPv6 has 64 bits",
                        "IPv4 has 128 bits; IPv6 has 32 bits"
                    ],
                    "correctAnswer": 0,
                    "explanation": "IPv4 uses 32-bit addresses (e.g. 192.168.1.1), providing ~4.3 billion addresses. IPv6 uses 128-bit hexadecimal addresses to provide virtually unlimited addressing."
                },
                {
                    "id": "net-ip-2",
                    "question": "Which of the following IPv4 ranges is defined as private non-routable address space under RFC 1918?",
                    "options": [
                        "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16",
                        "8.8.8.0/24 and 1.1.1.0/24",
                        "169.254.0.0/16 exclusively",
                        "127.0.0.0/8 exclusively"
                    ],
                    "correctAnswer": 0,
                    "explanation": "RFC 1918 reserves three private address spaces: Class A (10.0.0.0/8), Class B (172.16.0.0/12), and Class C (192.168.0.0/16)."
                }
            ]
        },
        {
            "topic": "KC - Amazon VPC",
            "questions": [
                {
                    "id": "net-vpc-1",
                    "question": "What is an Amazon Virtual Private Cloud (Amazon VPC)?",
                    "options": [
                        "A logically isolated virtual network dedicated to your AWS account that closely resembles a traditional on-premises network",
                        "A physical server rack shipped by AWS to your corporate headquarters",
                        "A public DNS server managed by AWS to host domain registrations",
                        "A hardware load balancer installed in your office datacenter"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon VPC allows you to provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define."
                },
                {
                    "id": "net-vpc-2",
                    "question": "Which component allows instances in a private subnet to connect outbound to the internet (for software updates) while preventing inbound internet traffic?",
                    "options": [
                        "NAT Gateway",
                        "Internet Gateway",
                        "Customer Gateway",
                        "VPC Peering Connection"
                    ],
                    "correctAnswer": 0,
                    "explanation": "A NAT (Network Address Translation) Gateway deployed in a public subnet allows instances in private subnets to initiate outbound requests to the internet while preventing external entities from initiating inbound connections."
                }
            ]
        },
        {
            "topic": "KC - IP Subnetting",
            "questions": [
                {
                    "id": "net-sub-1",
                    "question": "In a `/24` IPv4 CIDR block, how many total theoretical IP addresses exist, and how many are usable in an AWS subnet?",
                    "options": [
                        "256 total IP addresses; 251 usable in an AWS subnet",
                        "256 total IP addresses; 254 usable in an AWS subnet",
                        "128 total IP addresses; 123 usable in an AWS subnet",
                        "512 total IP addresses; 507 usable in an AWS subnet"
                    ],
                    "correctAnswer": 0,
                    "explanation": "A `/24` block has 2^(32-24) = 256 total IP addresses. In AWS, 5 IP addresses per subnet are reserved (Network, VPC router, DNS, future use, and broadcast), leaving 251 usable IPs."
                },
                {
                    "id": "net-sub-2",
                    "question": "Which CIDR prefix mask represents a single specific IPv4 host address?",
                    "options": [
                        "/32",
                        "/0",
                        "/16",
                        "/24"
                    ],
                    "correctAnswer": 0,
                    "explanation": "A `/32` prefix represents exactly one host IP address (all 32 network bits fixed, 0 host bits)."
                }
            ]
        },
        {
            "topic": "KC - Additional Networking Protocols",
            "questions": [
                {
                    "id": "net-proto-1",
                    "question": "Which network protocol translates human-friendly domain names like `aws.amazon.com` into numeric IP addresses, running primarily on port 53?",
                    "options": [
                        "DNS (Domain Name System)",
                        "DHCP (Dynamic Host Configuration Protocol)",
                        "SNMP (Simple Network Management Protocol)",
                        "FTP (File Transfer Protocol)"
                    ],
                    "correctAnswer": 0,
                    "explanation": "DNS (Domain Name System) translates hostnames into IP addresses and operates on UDP/TCP port 53."
                },
                {
                    "id": "net-proto-2",
                    "question": "Which protocol automatically assigns dynamic IP addresses, default gateways, and subnet masks to client devices joining a network?",
                    "options": [
                        "DHCP",
                        "ARP",
                        "BGP",
                        "ICMP"
                    ],
                    "correctAnswer": 0,
                    "explanation": "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP configuration parameters to devices on an IP network."
                }
            ]
        },
        {
            "topic": "KC - Additional Networking Technologies",
            "questions": [
                {
                    "id": "net-tech-1",
                    "question": "What is the purpose of an Elastic Load Balancer (ELB) in AWS architecture?",
                    "options": [
                        "Automatically distributing incoming application traffic across multiple targets such as EC2 instances, containers, and IP addresses",
                        "Compressing image files uploaded into Amazon S3 buckets",
                        "Assigning physical fiber optics between on-premises sites and AWS Regions",
                        "Managing database schema migrations between Oracle and PostgreSQL"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Elastic Load Balancing (ELB) automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, and IP addresses, across multiple Availability Zones."
                },
                {
                    "id": "net-tech-2",
                    "question": "Which dedicated cloud networking service establishes a private, physical fiber connection directly from your on-premises datacenter to AWS, bypassing the public internet?",
                    "options": [
                        "AWS Direct Connect",
                        "AWS Site-to-Site VPN",
                        "VPC Peering",
                        "Internet Gateway"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Direct Connect links your internal network to an AWS Direct Connect location over a standard Ethernet fiber-optic cable, bypassing the public internet for consistent bandwidth and reduced latency."
                }
            ]
        }
    ],
    "Python Programming": [
        {
            "topic": "KC - Introduction to Programming",
            "questions": [
                {
                    "id": "py-intro-1",
                    "question": "What is the main difference between a compiled programming language (like C++) and an interpreted programming language (like Python)?",
                    "options": [
                        "Interpreted languages execute code line-by-line via a runtime interpreter without needing a separate compilation step into machine code",
                        "Compiled languages cannot run on 64-bit operating systems",
                        "Interpreted languages do not support variables or loops",
                        "Compiled languages require the internet to execute"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Interpreted languages like Python process code instructions at runtime using an interpreter, offering high developer agility and cross-platform flexibility without manual compilation ahead of time."
                },
                {
                    "id": "py-intro-2",
                    "question": "What is an algorithm in computer science?",
                    "options": [
                        "A step-by-step procedure or set of rules to be followed in calculations or problem-solving operations",
                        "A physical piece of silicon soldered onto the motherboard",
                        "A proprietary software license key from a vendor",
                        "An error thrown when RAM is completely full"
                    ],
                    "correctAnswer": 0,
                    "explanation": "An algorithm is a finite sequence of well-defined computer-implementable instructions to solve a class of specific problems or perform a computation."
                }
            ]
        },
        {
            "topic": "KC - Introduction to Python",
            "questions": [
                {
                    "id": "py-intropy-1",
                    "question": "How does Python define code blocks and scope for functions, loops, and conditional statements?",
                    "options": [
                        "Using whitespace and indentation",
                        "Using curly braces { }",
                        "Using `begin` and `end` keywords",
                        "Using semicolon delimiters"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Unlike C or Java which use curly braces `{}`, Python uses whitespace indentation to define code blocks and scope."
                },
                {
                    "id": "py-intropy-2",
                    "question": "Who created the Python programming language in the late 1980s?",
                    "options": [
                        "Guido van Rossum",
                        "Linus Torvalds",
                        "James Gosling",
                        "Dennis Ritchie"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Python was conceived in the late 1980s by Guido van Rossum at CWI in the Netherlands and released in 1991."
                }
            ]
        },
        {
            "topic": "KC - Python Basics",
            "questions": [
                {
                    "id": "py-basics-1",
                    "question": "What is the output of `type(3.14)` in Python 3?",
                    "options": [
                        "<class 'float'>",
                        "<class 'int'>",
                        "<class 'str'>",
                        "<class 'double'>"
                    ],
                    "correctAnswer": 0,
                    "explanation": "In Python, real numbers with decimal points are represented as floating-point instances of `<class 'float'>`."
                },
                {
                    "id": "py-basics-2",
                    "question": "Which of the following data structures in Python is immutable (cannot be altered after creation)?",
                    "options": [
                        "Tuple",
                        "List",
                        "Dictionary",
                        "Set"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Tuples (e.g., `(1, 2, 3)`) are immutable sequences in Python; items cannot be modified, added, or removed after creation."
                }
            ]
        },
        {
            "topic": "KC - Flow Control",
            "questions": [
                {
                    "id": "py-flow-1",
                    "question": "Which statement immediately halts the current iteration of a loop and skips to the next iteration?",
                    "options": [
                        "continue",
                        "break",
                        "pass",
                        "return"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The `continue` statement terminates the current loop iteration and proceeds directly to the next iteration. `break` exits the loop entirely."
                },
                {
                    "id": "py-flow-2",
                    "question": "What is the result of evaluating `bool([])` in Python?",
                    "options": [
                        "False",
                        "True",
                        "None",
                        "ValueError"
                    ],
                    "correctAnswer": 0,
                    "explanation": "In Python, empty collections (empty lists `[]`, empty dicts `{}`, empty strings `\"\"`, empty tuples `()`) evaluate to falsy values (`False`)."
                }
            ]
        },
        {
            "topic": "KC - Functions",
            "questions": [
                {
                    "id": "py-func-1",
                    "question": "Which keyword is used to define a reusable function in Python?",
                    "options": [
                        "def",
                        "function",
                        "fn",
                        "define"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The `def` keyword introduces a function definition in Python: `def my_function(param): ...`"
                },
                {
                    "id": "py-func-2",
                    "question": "What does a Python function return by default if it contains no explicit `return` statement?",
                    "options": [
                        "None",
                        "0",
                        "False",
                        "Undefined"
                    ],
                    "correctAnswer": 0,
                    "explanation": "In Python, if execution falls off the end of a function without reaching a `return` statement, it implicitly returns `None`."
                }
            ]
        },
        {
            "topic": "KC - Modules and Libraries",
            "questions": [
                {
                    "id": "py-mod-1",
                    "question": "What is the official package installer for third-party Python libraries from PyPI?",
                    "options": [
                        "pip",
                        "npm",
                        "apt",
                        "gem"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`pip` is the standard package manager for Python used to install packages from the Python Package Index (PyPI)."
                },
                {
                    "id": "py-mod-2",
                    "question": "Which official AWS SDK for Python allows developers to manage EC2, S3, and DynamoDB programmatically?",
                    "options": [
                        "Boto3",
                        "AWS-PyCore",
                        "PyAWS",
                        "Amplify-Py"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Boto3 is the official Amazon Web Services (AWS) SDK for Python, allowing Python developers to write software that integrates with AWS services."
                }
            ]
        },
        {
            "topic": "KC - Python for System Administration",
            "questions": [
                {
                    "id": "py-sys-1",
                    "question": "Which Python standard library module is recommended for executing external shell commands and capturing their stdout and stderr?",
                    "options": [
                        "subprocess",
                        "math",
                        "json",
                        "random"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The `subprocess` module (`subprocess.run()`) is the standard Python library module used to spawn new processes, connect to their input/output pipes, and obtain return codes."
                },
                {
                    "id": "py-sys-2",
                    "question": "Which function in the `os.path` module verifies whether a specific file or directory exists on the filesystem?",
                    "options": [
                        "os.path.exists()",
                        "os.path.find()",
                        "os.path.verify()",
                        "os.path.touch()"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`os.path.exists(path)` returns `True` if `path` refers to an existing path or an open file descriptor."
                }
            ]
        },
        {
            "topic": "KC - Debugging and Testing",
            "questions": [
                {
                    "id": "py-test-1",
                    "question": "What built-in interactive source code debugger comes standard with Python?",
                    "options": [
                        "pdb",
                        "gdb",
                        "pytest",
                        "pytrace"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The module `pdb` defines an interactive source code debugger for Python programs supporting breakpoints, stepping, and inspection."
                },
                {
                    "id": "py-test-2",
                    "question": "What is the purpose of unit testing in software development?",
                    "options": [
                        "To test individual functions or components in isolation to ensure they work as expected",
                        "To measure end-to-end user satisfaction with the UI colors",
                        "To monitor server rack temperature in the AWS datacenter",
                        "To compile Python bytecode into machine instructions"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Unit testing tests individual units or components of software in isolation to validate that each unit performs correctly according to specification."
                }
            ]
        },
        {
            "topic": "KC - DevOps and Continuous Integration",
            "questions": [
                {
                    "id": "py-devops-1",
                    "question": "What is Continuous Integration (CI)?",
                    "options": [
                        "A software development practice where developers frequently merge code changes into a central repository, followed by automated builds and tests",
                        "Manually copying compiled files over SFTP to production servers once every six months",
                        "A billing technique that merges all cloud vendor invoices into a single PDF",
                        "A hardware architecture that clusters physical hard drives into RAID arrays"
                    ],
                    "correctAnswer": 0,
                    "explanation": "CI is a DevOps software development practice where developers regularly merge code changes into a central repository, after which automated builds and tests are run to detect bugs early."
                },
                {
                    "id": "py-devops-2",
                    "question": "Which AWS developer service provides a fully managed continuous integration service that compiles source code, runs tests, and produces software packages?",
                    "options": [
                        "AWS CodeBuild",
                        "AWS CodeDeploy",
                        "AWS CodePipeline",
                        "AWS Cloud9"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS CodeBuild is a fully managed build service that compiles source code, runs automated tests, and produces ready-to-deploy software packages."
                }
            ]
        },
        {
            "topic": "KC - Configuration Management",
            "questions": [
                {
                    "id": "py-cfg-1",
                    "question": "What concept in configuration management ensures that applying the same configuration script multiple times produces the exact same end state without unintended side effects?",
                    "options": [
                        "Idempotence",
                        "Polymorphism",
                        "Concurrency",
                        "Abstraction"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Idempotence is the property where an operation can be applied multiple times without changing the result beyond the initial application, critical for tools like Ansible and Puppet."
                },
                {
                    "id": "py-cfg-2",
                    "question": "Which agentless open-source automation tool uses human-readable YAML playbooks to configure servers over SSH?",
                    "options": [
                        "Ansible",
                        "Chef",
                        "Puppet",
                        "Docker"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Ansible is an open-source, agentless configuration management and automation tool that connects via SSH and executes tasks defined in YAML playbooks."
                }
            ]
        }
    ],
    "Databases": [
        {
            "topic": "KC - Introduction to Databases",
            "questions": [
                {
                    "id": "db-intro-1",
                    "question": "Which type of database organizes structured data into tables consisting of rows and columns with strict schema constraints?",
                    "options": [
                        "Relational Database (RDBMS)",
                        "Key-Value NoSQL Store",
                        "Document Store",
                        "Graph Database"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Relational Database Management Systems (RDBMS) like MySQL, PostgreSQL, and Oracle store structured data in tables with predefined columns, relationships, and data types."
                },
                {
                    "id": "db-intro-2",
                    "question": "What does the 'ACID' acronym stand for in relational database transactions?",
                    "options": [
                        "Atomicity, Consistency, Isolation, Durability",
                        "Availability, Concurrency, Integrity, Distribution",
                        "Authentication, Cryptography, Identity, Delegation",
                        "Accuracy, Cloud, Infrastructure, Deployment"
                    ],
                    "correctAnswer": 0,
                    "explanation": "ACID properties (Atomicity, Consistency, Isolation, Durability) guarantee that database transactions are processed reliably."
                }
            ]
        },
        {
            "topic": "KC - Data Interaction and Database Transaction",
            "questions": [
                {
                    "id": "db-tx-1",
                    "question": "Which SQL transaction command permanently saves all changes made during the current transaction to the database?",
                    "options": [
                        "COMMIT",
                        "ROLLBACK",
                        "SAVEPOINT",
                        "CHECKPOINT"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`COMMIT` ends the current transaction and makes all pending data changes permanent in the database."
                },
                {
                    "id": "db-tx-2",
                    "question": "If an error occurs midway through a multi-step financial transfer transaction, which command restores the database to its pre-transaction state?",
                    "options": [
                        "ROLLBACK",
                        "COMMIT",
                        "UNDO",
                        "DROP TRANSACTION"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`ROLLBACK` undoes all transactions and modifications performed since the last `COMMIT` or `SAVEPOINT`, maintaining data consistency."
                }
            ]
        },
        {
            "topic": "KC - Creating Tables and Learning Different Data Types",
            "questions": [
                {
                    "id": "db-create-1",
                    "question": "Which SQL Data Definition Language (DDL) command creates a new table in a database?",
                    "options": [
                        "CREATE TABLE",
                        "NEW TABLE",
                        "MAKE TABLE",
                        "INIT TABLE"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`CREATE TABLE table_name (column1 datatype, column2 datatype, ...);` is the standard SQL DDL statement for defining a new table."
                },
                {
                    "id": "db-create-2",
                    "question": "Which SQL data type is best suited for storing variable-length character strings up to 255 characters?",
                    "options": [
                        "VARCHAR(255)",
                        "CHAR(255)",
                        "INTEGER",
                        "BOOLEAN"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`VARCHAR(n)` stores variable-length character strings, only consuming storage for characters actually entered plus a small length byte, unlike fixed-length `CHAR(n)`."
                }
            ]
        },
        {
            "topic": "KC - Inserting Data into a Database",
            "questions": [
                {
                    "id": "db-insert-1",
                    "question": "Which standard SQL command is used to add new rows of records into an existing table?",
                    "options": [
                        "INSERT INTO",
                        "ADD RECORD",
                        "APPEND TO",
                        "UPDATE ROW"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The standard SQL syntax is `INSERT INTO table_name (col1, col2) VALUES (val1, val2);`."
                },
                {
                    "id": "db-insert-2",
                    "question": "What occurs if you attempt to insert a record with a duplicate primary key value into a table?",
                    "options": [
                        "The database raises a primary key constraint violation error and rejects the insertion",
                        "The database automatically overwrites the original row without notification",
                        "The database creates a second row with the same key silently",
                        "The entire database drops all existing tables"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Primary keys must be unique. Attempting to insert a duplicate value violates the entity integrity constraint and triggers a unique constraint error."
                }
            ]
        },
        {
            "topic": "KC - Selecting Data from a Database",
            "questions": [
                {
                    "id": "db-select-1",
                    "question": "Which SQL statement retrieves all columns and all rows from a table named `customers`?",
                    "options": [
                        "SELECT * FROM customers;",
                        "GET ALL FROM customers;",
                        "EXTRACT * IN customers;",
                        "FIND ROWS IN customers;"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`SELECT * FROM customers;` is the standard SQL query to project all columns (`*`) across all rows from the specified table."
                },
                {
                    "id": "db-select-2",
                    "question": "Which SQL keyword eliminates duplicate rows from the query output?",
                    "options": [
                        "DISTINCT",
                        "UNIQUE",
                        "DIFFERENT",
                        "DISCRETE"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The `DISTINCT` keyword (e.g. `SELECT DISTINCT country FROM customers;`) eliminates duplicate rows from the result set."
                }
            ]
        },
        {
            "topic": "KC - Performing a Conditional Search",
            "questions": [
                {
                    "id": "db-where-1",
                    "question": "Which SQL clause filters records based on specified criteria before rows are returned or grouped?",
                    "options": [
                        "WHERE",
                        "HAVING",
                        "ORDER BY",
                        "GROUP BY"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The `WHERE` clause filters individual rows meeting specific conditional expressions before any grouping or projection."
                },
                {
                    "id": "db-where-2",
                    "question": "Which SQL operator searches for a specified pattern in a column, commonly used with the `%` wildcard?",
                    "options": [
                        "LIKE",
                        "IN",
                        "BETWEEN",
                        "IS"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The `LIKE` operator is used in a WHERE clause to search for specified patterns in text columns (`WHERE name LIKE 'A%'`)."
                }
            ]
        },
        {
            "topic": "KC - Working with Functions",
            "questions": [
                {
                    "id": "db-func-1",
                    "question": "Which SQL aggregate function returns the total number of rows matching the query criteria?",
                    "options": [
                        "COUNT()",
                        "SUM()",
                        "AVG()",
                        "TOTAL()"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`COUNT()` is an aggregate function that returns the total count of rows or non-null values matching query criteria."
                },
                {
                    "id": "db-func-2",
                    "question": "Which SQL clause is used to filter groups created by a `GROUP BY` clause using aggregate functions?",
                    "options": [
                        "HAVING",
                        "WHERE",
                        "FILTER",
                        "LIMIT"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`HAVING` filters aggregated groups (e.g., `HAVING COUNT(*) > 5`), whereas `WHERE` filters individual rows prior to grouping."
                }
            ]
        },
        {
            "topic": "KC - Organizing Data",
            "questions": [
                {
                    "id": "db-org-1",
                    "question": "Which SQL clause sorts the returned records in ascending or descending order?",
                    "options": [
                        "ORDER BY",
                        "SORT BY",
                        "GROUP BY",
                        "ARRANGE"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`ORDER BY column_name ASC|DESC` sorts the resulting result set by one or more columns."
                },
                {
                    "id": "db-org-2",
                    "question": "What is the default sort direction when `ORDER BY` is used without specifying `ASC` or `DESC`?",
                    "options": [
                        "Ascending (ASC)",
                        "Descending (DESC)",
                        "Random",
                        "Chronological"
                    ],
                    "correctAnswer": 0,
                    "explanation": "In SQL, the default sort order for `ORDER BY` is ascending (`ASC`) (smallest to largest or alphabetical A to Z)."
                }
            ]
        },
        {
            "topic": "KC - Retrieving Data from Multiple Tables",
            "questions": [
                {
                    "id": "db-multi-1",
                    "question": "Which type of SQL JOIN returns only rows that have matching values in both tables?",
                    "options": [
                        "INNER JOIN",
                        "LEFT JOIN",
                        "FULL OUTER JOIN",
                        "CROSS JOIN"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`INNER JOIN` selects records that have matching values in both joined tables based on the join predicate."
                },
                {
                    "id": "db-multi-2",
                    "question": "Which JOIN returns all records from the left table, and matched records from the right table (with NULLs for unmatched right rows)?",
                    "options": [
                        "LEFT JOIN (LEFT OUTER JOIN)",
                        "INNER JOIN",
                        "RIGHT JOIN",
                        "UNION"
                    ],
                    "correctAnswer": 0,
                    "explanation": "`LEFT JOIN` returns all records from the left table and matched values from the right table. If no match is found, NULL values are populated for right table columns."
                }
            ]
        },
        {
            "topic": "KC - Amazon RDS",
            "questions": [
                {
                    "id": "db-rds-1",
                    "question": "Which feature of Amazon RDS provides high availability and automatic failover by maintaining a synchronous standby replica in a different Availability Zone?",
                    "options": [
                        "Multi-AZ Deployment",
                        "Read Replicas",
                        "Amazon RDS Proxy",
                        "Storage Auto Scaling"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon RDS Multi-AZ deployments provision and maintain a synchronous standby replica in a different Availability Zone for automatic failover and high availability during outages."
                },
                {
                    "id": "db-rds-2",
                    "question": "What is the primary benefit of deploying Amazon RDS Read Replicas?",
                    "options": [
                        "To scale read-heavy database workloads horizontally and offload read queries from the primary DB instance",
                        "To provide synchronous disaster recovery failover",
                        "To encrypt data at rest without performance overhead",
                        "To convert relational tables into DynamoDB documents"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Read Replicas asynchronously replicate data from the primary instance to allow read-heavy applications to scale read throughput horizontally."
                }
            ]
        },
        {
            "topic": "KC - Amazon DynamoDB",
            "questions": [
                {
                    "id": "db-ddb-1",
                    "question": "What type of database service is Amazon DynamoDB?",
                    "options": [
                        "A fully managed NoSQL key-value and document database offering single-digit millisecond latency at any scale",
                        "A managed relational database engine compatible with PostgreSQL",
                        "An in-memory Redis cache cluster",
                        "A columnar data warehouse for SQL analytics"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon DynamoDB is a fully managed, serverless NoSQL database service providing fast, predictable, single-digit millisecond performance with seamless scalability."
                },
                {
                    "id": "db-ddb-2",
                    "question": "In Amazon DynamoDB, what constitutes a composite primary key?",
                    "options": [
                        "A Partition Key (Hash attribute) and a Sort Key (Range attribute)",
                        "Two Partition Keys from separate tables",
                        "A foreign key pointing to an RDS database table",
                        "A 128-bit MD5 checksum hash"
                    ],
                    "correctAnswer": 0,
                    "explanation": "A composite primary key in DynamoDB consists of a Partition Key (used by DynamoDB's internal hash function to distribute items across physical partitions) and a Sort Key (stores items with the same partition key in sorted order)."
                }
            ]
        }
    ],
    "AWS Architecture": [
        {
            "topic": "KC – AWS Architecture",
            "questions": [
                {
                    "id": "arch-1",
                    "question": "Which of the following represents the 6 Pillars of the AWS Well-Architected Framework?",
                    "options": [
                        "Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability",
                        "Speed, Agility, Global Footprint, Open Source, Encryption, Compute",
                        "Compute, Storage, Networking, Database, Security, Billing",
                        "Automation, Scalability, High Availability, Fault Tolerance, Redundancy, Recovery"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The AWS Well-Architected Framework is built on six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability."
                },
                {
                    "id": "arch-2",
                    "question": "Which architectural design principle decouples application components so that the failure of one service does not crash downstream dependencies?",
                    "options": [
                        "Loose coupling with message queues (e.g., Amazon SQS)",
                        "Hardcoding IP addresses into frontend client code",
                        "Running all components on a single monolithic EC2 instance",
                        "Using synchronous point-to-point HTTP calls without buffers"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Loose coupling using asynchronous messaging services like Amazon SQS isolates components, allowing them to scale and fail independently without taking down the entire system."
                }
            ]
        }
    ],
    "Systems Operations & Tooling": [
        {
            "topic": "KC - System Operations",
            "questions": [
                {
                    "id": "sysop-ops-1",
                    "question": "Which AWS service allows system administrators to remotely execute commands, run configuration scripts, and patch managed EC2 instances without needing open inbound SSH ports or bastion hosts?",
                    "options": [
                        "AWS Systems Manager (Session Manager / Run Command)",
                        "AWS Cloud9",
                        "AWS CodeCommit",
                        "Amazon Route 53"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Systems Manager Run Command and Session Manager allow you to remotely and securely manage EC2 instances without opening inbound ports or maintaining bastion hosts."
                },
                {
                    "id": "sysop-ops-2",
                    "question": "What is the primary role of Amazon CloudWatch in AWS systems operations?",
                    "options": [
                        "Collecting and monitoring operational metrics, logs, and alarms for AWS resources and applications",
                        "Writing and compiling code in an online browser-based IDE",
                        "Managing credit card billing and invoices",
                        "Purchasing third-party domain names"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon CloudWatch monitors applications and infrastructure, collecting metrics, logs, and traces, and triggering automated alarms or actions when thresholds are breached."
                }
            ]
        },
        {
            "topic": "KC - Tooling and Automation",
            "questions": [
                {
                    "id": "sysop-tool-1",
                    "question": "Which AWS service enables Infrastructure as Code (IaC) by modeling and provisioning AWS resources using declarative JSON or YAML template files?",
                    "options": [
                        "AWS CloudFormation",
                        "AWS Config",
                        "AWS Secrets Manager",
                        "AWS AppSync"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS CloudFormation allows you to model, provision, and manage AWS and third-party resources by treating infrastructure as code with JSON or YAML templates."
                },
                {
                    "id": "sysop-tool-2",
                    "question": "Which open-source software development framework allows developers to define cloud infrastructure using familiar programming languages like TypeScript, Python, and Java?",
                    "options": [
                        "AWS Cloud Development Kit (AWS CDK)",
                        "AWS Elastic Beanstalk",
                        "AWS Amplify",
                        "AWS Systems Manager Inventory"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The AWS CDK lets you define cloud infrastructure in code (using TypeScript, Python, Java, etc.) and synthesize it into AWS CloudFormation templates."
                }
            ]
        }
    ],
    "Servers & Scaling": [
        {
            "topic": "KC - Servers",
            "questions": [
                {
                    "id": "serv-srv-1",
                    "question": "Which AWS compute service provides virtual servers with customizable CPU, memory, storage, and networking options for full administrative control?",
                    "options": [
                        "Amazon Elastic Compute Cloud (Amazon EC2)",
                        "AWS Lambda",
                        "AWS Fargate",
                        "Amazon S3"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon EC2 provides resizable compute capacity in the cloud as virtual servers (instances), giving users full administrative and operating system control."
                },
                {
                    "id": "serv-srv-2",
                    "question": "When an application requires simple pre-packaged virtual private servers with bundled compute, SSD storage, and DNS management for beginners, which AWS service is best suited?",
                    "options": [
                        "Amazon Lightsail",
                        "Amazon EMR",
                        "AWS Outposts",
                        "AWS Batch"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon Lightsail is an easy-to-use virtual private server (VPS) provider offering everything needed to build an application or website at a predictable monthly price."
                }
            ]
        },
        {
            "topic": "KC - Scaling and Name Resolution",
            "questions": [
                {
                    "id": "serv-scale-1",
                    "question": "What is the difference between horizontal scaling (scaling out/in) and vertical scaling (scaling up/down)?",
                    "options": [
                        "Horizontal scaling adds or removes instances of resources; vertical scaling increases or decreases the compute capacity (CPU/RAM) of an existing instance",
                        "Horizontal scaling moves servers between regions; vertical scaling reboots instances",
                        "Horizontal scaling applies only to databases; vertical scaling applies only to DNS",
                        "Horizontal scaling increases network bandwidth; vertical scaling reduces storage capacity"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Horizontal scaling (scale out/in) adds or removes server instances (e.g. EC2 Auto Scaling). Vertical scaling (scale up/down) upgrades or downgrades instance sizes (e.g. t3.micro to m5.large)."
                },
                {
                    "id": "serv-scale-2",
                    "question": "Which Amazon Route 53 routing policy routes user traffic to the resource that provides the lowest network latency for the end user?",
                    "options": [
                        "Latency Routing Policy",
                        "Weighted Routing Policy",
                        "Geolocation Routing Policy",
                        "Failover Routing Policy"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Route 53 Latency Routing routes requests to the AWS Region that yields the lowest network round-trip time for the visiting user."
                }
            ]
        },
        {
            "topic": "KC - Serverless and Containers",
            "questions": [
                {
                    "id": "serv-less-1",
                    "question": "Which serverless compute service allows you to run code in response to events without provisioning or managing servers?",
                    "options": [
                        "AWS Lambda",
                        "Amazon EC2",
                        "Amazon Lightsail",
                        "Amazon Elastic Beanstalk"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Lambda is a serverless, event-driven compute service that lets you run code for virtually any type of application or backend without provisioning or managing servers."
                },
                {
                    "id": "serv-less-2",
                    "question": "Which serverless compute engine works with Amazon ECS and Amazon EKS to run containers without having to manage the underlying EC2 instances?",
                    "options": [
                        "AWS Fargate",
                        "Amazon S3",
                        "AWS App Runner",
                        "Amazon Elastic Block Store"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Fargate is a serverless, pay-as-you-go compute engine that lets you build and run containerized applications without managing physical or virtual EC2 servers."
                }
            ]
        }
    ],
    "AWS Core Services": [
        {
            "topic": "KC - AWS Database Services",
            "questions": [
                {
                    "id": "core-db-1",
                    "question": "Which enterprise-grade, MySQL and PostgreSQL-compatible relational database was built for the cloud by AWS, offering up to 5x the throughput of standard MySQL?",
                    "options": [
                        "Amazon Aurora",
                        "Amazon Redshift",
                        "Amazon DynamoDB",
                        "Amazon Neptune"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon Aurora is a fully managed relational database engine compatible with MySQL and PostgreSQL that provides high performance and availability."
                },
                {
                    "id": "core-db-2",
                    "question": "Which fully managed in-memory data store service supports Redis and Memcached to accelerate application response times with sub-millisecond latency?",
                    "options": [
                        "Amazon ElastiCache",
                        "Amazon DocumentDB",
                        "Amazon Keyspaces",
                        "Amazon QLDB"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon ElastiCache is a fully managed in-memory caching service compatible with Redis and Memcached, designed to boost application performance."
                }
            ]
        },
        {
            "topic": "KC - AWS Networking Services",
            "questions": [
                {
                    "id": "core-net-1",
                    "question": "Which AWS service connects VPCs and on-premises networks to a single central regional hub, simplifying complex multi-VPC networking topologies?",
                    "options": [
                        "AWS Transit Gateway",
                        "Internet Gateway",
                        "NAT Instance",
                        "Route 53 Resolver"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Transit Gateway acts as a central cloud router that connects multiple Virtual Private Clouds (VPCs) and on-premises networks through a single hub."
                },
                {
                    "id": "core-net-2",
                    "question": "What is VPC Peering in AWS?",
                    "options": [
                        "A networking connection between two VPCs that enables direct, private routing using private IP addresses",
                        "A public VPN connection through the open internet",
                        "A physical fiber patch between two on-premises server racks",
                        "An automated DNS record generator for Amazon Route 53"
                    ],
                    "correctAnswer": 0,
                    "explanation": "A VPC peering connection is a networking connection between two VPCs that enables you to route traffic between them using private IPv4 or IPv6 addresses privately."
                }
            ]
        },
        {
            "topic": "KC - Storage and Archiving",
            "questions": [
                {
                    "id": "core-store-1",
                    "question": "Which storage service provides persistent, high-performance block-level storage volumes for use with Amazon EC2 instances?",
                    "options": [
                        "Amazon Elastic Block Store (Amazon EBS)",
                        "Amazon S3",
                        "Amazon Glacier",
                        "AWS Snowball"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon EBS provides block-level storage volumes designed for use with Amazon EC2 instances, supporting high-throughput and transaction-intensive workloads."
                },
                {
                    "id": "core-store-2",
                    "question": "Which AWS service provides a scalable, elastic, cloud-native NFS file system that can be concurrently mounted to hundreds of Linux EC2 instances?",
                    "options": [
                        "Amazon Elastic File System (Amazon EFS)",
                        "Amazon EBS",
                        "Amazon S3",
                        "AWS Storage Gateway"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon EFS provides a simple, serverless, set-and-forget elastic file system using the NFS protocol that can be mounted simultaneously by multiple EC2 instances."
                }
            ]
        },
        {
            "topic": "KC - Monitoring and Security",
            "questions": [
                {
                    "id": "core-mon-1",
                    "question": "What is the key difference between AWS CloudTrail and Amazon CloudWatch?",
                    "options": [
                        "CloudTrail records API calls and user account governance activity; CloudWatch monitors operational resource performance metrics and application logs",
                        "CloudTrail is for databases; CloudWatch is for virtual private clouds",
                        "CloudTrail costs money per ping; CloudWatch is only for physical data centers",
                        "CloudTrail provisions EC2 instances; CloudWatch configures subnets"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS CloudTrail audits API calls and user actions across your AWS account for compliance and governance. Amazon CloudWatch collects metrics and performance logs to monitor resource health and trigger alarms."
                },
                {
                    "id": "core-mon-2",
                    "question": "Which intelligent threat detection service continuously monitors your AWS accounts and workloads for malicious activity and unauthorized behavior using machine learning?",
                    "options": [
                        "Amazon GuardDuty",
                        "AWS Shield",
                        "AWS WAF",
                        "AWS KMS"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon GuardDuty is an intelligent threat detection service that analyzes VPC Flow Logs, DNS logs, and CloudTrail events to identify unauthorized activity."
                }
            ]
        },
        {
            "topic": "KC - Managing Resource Consumption",
            "questions": [
                {
                    "id": "core-res-1",
                    "question": "Which AWS feature enables you to set custom budgets that trigger alerts when your costs or usage exceed (or are forecasted to exceed) your budgeted thresholds?",
                    "options": [
                        "AWS Budgets",
                        "AWS Cost Explorer",
                        "AWS Trusted Advisor",
                        "AWS Pricing Calculator"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Budgets allows you to set custom cost and usage budgets that alert you via email or SNS when costs exceed or are forecasted to exceed your set thresholds."
                },
                {
                    "id": "core-res-2",
                    "question": "Which tool provides visual reporting and charting to visualize, understand, and track your historical AWS spending trends and patterns over time?",
                    "options": [
                        "AWS Cost Explorer",
                        "AWS Cloud9",
                        "AWS Resource Groups",
                        "AWS License Manager"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Cost Explorer has an easy-to-use interface that lets you visualize, understand, and manage your AWS costs and usage over time."
                }
            ]
        },
        {
            "topic": "KC - Creating Automated Repeatable Deployments",
            "questions": [
                {
                    "id": "core-rep-1",
                    "question": "What is the main benefit of using AWS CloudFormation for provisioning resources across multiple AWS regions?",
                    "options": [
                        "Repeatable, automated, and consistent deployment of standardized infrastructure stacks",
                        "Automatic conversion of Windows servers into macOS machines",
                        "Free unlimited EC2 compute capacity",
                        "Direct fiber optic connections to local ISPs"
                    ],
                    "correctAnswer": 0,
                    "explanation": "CloudFormation enables Infrastructure as Code, making infrastructure deployments predictable, repeatable, standardized, and auditable across multiple regions."
                },
                {
                    "id": "core-rep-2",
                    "question": "Which AWS developer service automates software deployments to compute services such as Amazon EC2, AWS Fargate, AWS Lambda, and on-premises servers?",
                    "options": [
                        "AWS CodeDeploy",
                        "AWS CodeCommit",
                        "AWS Artifact",
                        "AWS CloudTrail"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS CodeDeploy is a fully managed deployment service that automates software deployments to a variety of compute services, minimizing downtime during releases."
                }
            ]
        }
    ],
    "Exam Prep": [
        {
            "topic": "KC - Assessment Scenario Certification Preparation",
            "questions": [
                {
                    "id": "ep-prep-1",
                    "question": "A startup is designing a web application and wants to ensure that all static assets are cached closer to global customers while mitigating DDoS attacks. Which AWS combination should they select?",
                    "options": [
                        "Amazon S3 with Amazon CloudFront and AWS Shield",
                        "Amazon EC2 with local instance store and public IP",
                        "Amazon EBS multi-attach in a single AZ",
                        "Amazon RDS with automated snapshots"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon S3 stores static assets, Amazon CloudFront caches them at Edge Locations globally for low-latency delivery, and AWS Shield provides DDoS protection."
                },
                {
                    "id": "ep-prep-2",
                    "question": "Under the AWS Shared Responsibility Model, which action is considered the customer's responsibility when running an Amazon Relational Database Service (RDS) instance?",
                    "options": [
                        "Managing database user access permissions and table encryption settings",
                        "Applying security patches to the underlying physical server OS",
                        "Replacing failed hard disk drives in the AWS storage rack",
                        "Managing the physical facilities and perimeter security"
                    ],
                    "correctAnswer": 0,
                    "explanation": "With managed RDS, AWS manages OS patching and physical infrastructure, while the customer is responsible for network access rules, database user credentials, table schemas, and data encryption configuration."
                }
            ]
        },
        {
            "topic": "KC - Scenario Test Strategy Practice",
            "questions": [
                {
                    "id": "ep-strat-1",
                    "question": "When taking multiple-choice AWS exams, which strategy is most effective when encountering questions with two seemingly viable answers?",
                    "options": [
                        "Carefully identify the specific constraints in the question stem, such as 'most cost-effective', 'least operational overhead', or 'highest availability'",
                        "Always select the answer with the longest word count",
                        "Pick the first choice without reading the remaining options",
                        "Choose the newest AWS service regardless of question requirements"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS exam questions frequently include specific criteria (e.g. 'least operational overhead', 'most cost-effective'). Looking for these qualifiers helps eliminate technically functional but suboptimal answers."
                },
                {
                    "id": "ep-strat-2",
                    "question": "A question asks for a solution with 'minimal operational overhead'. Which type of architecture is generally prioritized?",
                    "options": [
                        "Serverless or fully managed AWS services (e.g. AWS Lambda, DynamoDB, S3)",
                        "Custom self-managed EC2 instances running open-source daemons",
                        "On-premises bare metal servers configured with cron jobs",
                        "Self-managed Kubernetes clusters on physical hosts"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Serverless and managed services offload operational management (patching, scaling, hardware provisioning) to AWS, delivering the lowest operational overhead."
                }
            ]
        },
        {
            "topic": "KC - Cloud Computing",
            "questions": [
                {
                    "id": "ep-cc-1",
                    "question": "Which AWS cloud characteristic enables an application to automatically scale resources up during high traffic spikes and scale down during quiet hours to optimize cost?",
                    "options": [
                        "Elasticity",
                        "Fixed Capacity",
                        "Monolithic Coupling",
                        "Physical Segregation"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Elasticity is the ability to acquire resources as you need them and release resources when you no longer need them of your own accord."
                },
                {
                    "id": "ep-cc-2",
                    "question": "What is the primary benefit of decoupling application architecture in the cloud?",
                    "options": [
                        "Components can be updated, scaled, and managed independently without cascading failures",
                        "All components share the exact same physical CPU socket",
                        "It eliminates the need for any IP addressing",
                        "It guarantees 100% zero-dollar AWS billing"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Decoupling ensures that individual components interact through asynchronous interfaces (like SQS queues), preventing issues in one tier from bringing down the entire application."
                }
            ]
        },
        {
            "topic": "KC - Cloud Economics",
            "questions": [
                {
                    "id": "ep-econ-1",
                    "question": "What is Total Cost of Ownership (TCO) in cloud computing?",
                    "options": [
                        "The comprehensive financial estimate of direct and indirect costs of owning and running an IT environment, comparing on-premises data center expenses to AWS cloud costs",
                        "The exact purchase price of a replacement server motherboard",
                        "The hourly cost of an on-demand t3.micro EC2 instance",
                        "The annual registration fee for an Amazon Route 53 domain name"
                    ],
                    "correctAnswer": 0,
                    "explanation": "TCO encompasses all expenses including hardware, data center leases, power, cooling, network bandwidth, physical security, administration salaries, and software licensing."
                },
                {
                    "id": "ep-econ-2",
                    "question": "How does AWS achieve massive economies of scale that pass savings on to customers in the form of price reductions?",
                    "options": [
                        "By aggregating usage from hundreds of thousands of customers, enabling higher purchasing power for hardware and infrastructure efficiency",
                        "By requiring all customers to sign 10-year lock-in agreements",
                        "By charging extra for inbound data transfer",
                        "By operating exclusively during business hours"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Because AWS aggregates usage from hundreds of thousands of customers, it achieves higher economies of scale, resulting in lower pay-as-you-go prices for all consumers."
                }
            ]
        },
        {
            "topic": "KC - AWS Global Infrastructure",
            "questions": [
                {
                    "id": "ep-glob-1",
                    "question": "When designing a highly available architecture for a mission-critical web application, across what infrastructure boundary should EC2 instances be distributed?",
                    "options": [
                        "Across at least two Availability Zones (AZs) within an AWS Region",
                        "Across two racks in the same physical room",
                        "Across multiple local subnets in the exact same data center building",
                        "On a single high-memory bare-metal server"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Deploying across multiple Availability Zones in a Region provides fault tolerance against localized facility outages (power, flood, or connectivity failures in a single AZ)."
                },
                {
                    "id": "ep-glob-2",
                    "question": "Which AWS infrastructure component delivers low-latency single-digit millisecond responses to users in specific metropolitan cities that lack a full AWS Region?",
                    "options": [
                        "AWS Local Zones",
                        "AWS Snowball Edge",
                        "AWS DataSync",
                        "Amazon Inspector"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Local Zones place compute, storage, database, and select AWS services close to large population and industry centers where no AWS Region currently exists."
                }
            ]
        },
        {
            "topic": "KC - Compute",
            "questions": [
                {
                    "id": "ep-comp-1",
                    "question": "An organization has a steady, predictable background workload that will run continuously 24/7 for the next three years. Which EC2 pricing model yields the greatest cost savings?",
                    "options": [
                        "Savings Plans or Reserved Instances",
                        "On-Demand Instances",
                        "Spot Instances",
                        "Dedicated Hosts on-demand"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Compute Savings Plans and Reserved Instances offer up to a 72% discount compared to On-Demand in exchange for a 1-year or 3-year consistent usage commitment."
                },
                {
                    "id": "ep-comp-2",
                    "question": "Which AWS service is best suited for executing short-lived, event-driven background tasks (running under 15 minutes) without maintaining virtual servers?",
                    "options": [
                        "AWS Lambda",
                        "Amazon EC2",
                        "AWS Outposts",
                        "Amazon Elastic Block Store"
                    ],
                    "correctAnswer": 0,
                    "explanation": "AWS Lambda runs stateless code in response to events with a maximum execution time of 15 minutes per invocation, requiring zero server maintenance."
                }
            ]
        },
        {
            "topic": "KC - Identity and Access Management [IAM]",
            "questions": [
                {
                    "id": "ep-iam-1",
                    "question": "Which AWS security best practice should be followed regarding the AWS account root user?",
                    "options": [
                        "Lock away root access keys, enable Multi-Factor Authentication (MFA), and use IAM roles/users for daily tasks",
                        "Use the root user for daily administrative command-line scripts",
                        "Share the root user password among all system engineers",
                        "Disable MFA on the root account to prevent lockout"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The root user has unrestricted access to all resources and billing. Best practice is to enable MFA, avoid creating access keys, and use IAM roles and users for everyday administrative work."
                },
                {
                    "id": "ep-iam-2",
                    "question": "Which IAM entity should be attached to an Amazon EC2 instance to grant it temporary permissions to read objects from an Amazon S3 bucket securely?",
                    "options": [
                        "An IAM Role",
                        "An IAM User with hardcoded access keys in the code",
                        "A Root Access Key Pair",
                        "A public security group rule"
                    ],
                    "correctAnswer": 0,
                    "explanation": "IAM Roles allow EC2 instances to obtain temporary security credentials automatically via instance metadata, avoiding hardcoded secrets in application code."
                }
            ]
        },
        {
            "topic": "KC - Amazon Virtual Private Cloud [VPC]",
            "questions": [
                {
                    "id": "ep-vpc-1",
                    "question": "What is the primary difference between a Security Group and a Network Access Control List (NACL) in an Amazon VPC?",
                    "options": [
                        "Security Groups are stateful firewalls operating at the instance level; NACLs are stateless firewalls operating at the subnet level",
                        "Security Groups operate at the subnet level; NACLs operate at the instance level",
                        "Security Groups are stateless; NACLs are stateful",
                        "Security Groups only filter outgoing traffic; NACLs only filter incoming traffic"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Security Groups operate at the virtual network interface/instance level and are stateful (return traffic is automatically allowed). NACLs operate at the subnet boundary and are stateless (rules must be explicitly defined for inbound and outbound)."
                },
                {
                    "id": "ep-vpc-2",
                    "question": "Which component must be attached to a VPC, and referenced in a subnet's route table as the default gateway (`0.0.0.0/0`), for instances in that subnet to have direct two-way internet access?",
                    "options": [
                        "Internet Gateway (IGW)",
                        "Virtual Private Gateway (VGW)",
                        "Customer Gateway",
                        "Egress-Only Internet Gateway"
                    ],
                    "correctAnswer": 0,
                    "explanation": "An Internet Gateway (IGW) enables communication between instances in your VPC and the internet, converting private subnets into public subnets when routed to."
                }
            ]
        },
        {
            "topic": "KC - Storage",
            "questions": [
                {
                    "id": "ep-stor-1",
                    "question": "Which Amazon S3 feature protects objects from being accidentally overwritten or deleted by keeping multiple iterations of an object in the same bucket?",
                    "options": [
                        "S3 Versioning",
                        "S3 Transfer Acceleration",
                        "S3 Multipart Upload",
                        "S3 Static Web Hosting"
                    ],
                    "correctAnswer": 0,
                    "explanation": "S3 Versioning keeps multiple versions of an object in the same bucket, allowing easy recovery from accidental overwrites or deletions."
                },
                {
                    "id": "ep-stor-2",
                    "question": "Which storage option is non-persistent (ephemeral) and is physically attached to the host computer of an EC2 instance, losing its data when the instance is stopped?",
                    "options": [
                        "EC2 Instance Store",
                        "Amazon EBS General Purpose SSD",
                        "Amazon EFS",
                        "Amazon S3 Glacier"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Instance Store provides temporary block-level storage located on disks physically attached to the host computer. Data is lost if the instance stops, terminates, or hardware fails."
                }
            ]
        },
        {
            "topic": "KC - Databases",
            "questions": [
                {
                    "id": "ep-db-1",
                    "question": "A financial company needs to migrate a traditional MySQL database to AWS. They require automated backups, high availability failover, and OS patching handled by AWS. Which service should they choose?",
                    "options": [
                        "Amazon Relational Database Service (Amazon RDS)",
                        "Amazon DynamoDB",
                        "Amazon Redshift",
                        "Self-managed MySQL on Amazon EC2"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon RDS is a managed service that automates administrative tasks such as hardware provisioning, database setup, patching, and backups, while supporting MySQL."
                },
                {
                    "id": "ep-db-2",
                    "question": "Which database service is best suited for real-time mobile gaming leaderboards that require single-digit millisecond latency at massive scale?",
                    "options": [
                        "Amazon DynamoDB",
                        "Amazon RDS for SQL Server",
                        "Amazon Athena",
                        "Amazon Neptune"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Amazon DynamoDB provides fast, predictable, single-digit millisecond response times and handles high-velocity read and write traffic effortlessly."
                }
            ]
        },
        {
            "topic": "KC - Billing and Support",
            "questions": [
                {
                    "id": "ep-bill-1",
                    "question": "Which AWS Support Plan provides 24/7 phone, email, and chat access to Cloud Support Engineers, with a 15-minute response time SLA for business-critical system outages?",
                    "options": [
                        "Enterprise Support",
                        "Developer Support",
                        "Business Support",
                        "Basic Support"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The Enterprise Support plan offers < 15-minute response times for business-critical system down events, a designated Technical Account Manager (TAM), and 24/7 access to Cloud Support Engineers."
                },
                {
                    "id": "ep-bill-2",
                    "question": "Which feature of AWS Organizations allows a company to consolidate payment across multiple member AWS accounts and benefit from volume pricing discounts?",
                    "options": [
                        "Consolidated Billing",
                        "Service Control Policies (SCPs)",
                        "Cost Allocation Tags",
                        "AWS Trusted Advisor"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Consolidated Billing is a feature of AWS Organizations that aggregates usage across all member accounts to receive a single monthly bill and benefit from volume tiered discounts."
                }
            ]
        },
        {
            "topic": "KC - Cloud Architecting",
            "questions": [
                {
                    "id": "ep-arch-1",
                    "question": "Which architectural concept describes an application's ability to remain functional despite the complete failure of one or more underlying components?",
                    "options": [
                        "Fault Tolerance",
                        "Scalability",
                        "Agility",
                        "Portability"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Fault tolerance is the property that enables a system to continue operating properly without interruption in the event of the failure of one or more of its components."
                },
                {
                    "id": "ep-arch-2",
                    "question": "In the AWS Well-Architected Framework, which pillar emphasizes using computing resources efficiently to meet system requirements and maintaining that efficiency as demand changes?",
                    "options": [
                        "Performance Efficiency Pillar",
                        "Security Pillar",
                        "Cost Optimization Pillar",
                        "Operational Excellence Pillar"
                    ],
                    "correctAnswer": 0,
                    "explanation": "The Performance Efficiency pillar focuses on the structured use of computing resources to meet requirements and maintaining efficiency as demand evolves and technologies change."
                }
            ]
        },
        {
            "topic": "KC - Balancing - Scaling - Monitoring",
            "questions": [
                {
                    "id": "ep-bsm-1",
                    "question": "Which three AWS services work synergistically to build an elastic, self-healing web tier that dynamically responds to fluctuating user load?",
                    "options": [
                        "Amazon EC2 Auto Scaling, Elastic Load Balancing (ELB), and Amazon CloudWatch",
                        "AWS Lambda, Amazon S3, and AWS Glue",
                        "Amazon Route 53, AWS IAM, and AWS Key Management Service",
                        "AWS CloudTrail, Amazon GuardDuty, and Amazon Inspector"
                    ],
                    "correctAnswer": 0,
                    "explanation": "CloudWatch monitors CPU/traffic metrics and fires alarms, EC2 Auto Scaling adds or removes EC2 instances based on those alarms, and ELB routes user traffic evenly to healthy instances."
                },
                {
                    "id": "ep-bsm-2",
                    "question": "How does an Elastic Load Balancer determine whether an EC2 instance in a target group is capable of handling incoming traffic?",
                    "options": [
                        "By performing periodic Health Checks against a specified port and path",
                        "By checking the instance's billing status in AWS Organizations",
                        "By inspecting the Linux root password hash in `/etc/shadow`",
                        "By measuring the physical temperature of the server chassis"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Elastic Load Balancer periodically sends health check requests (such as an HTTP 200 GET check to `/health`) to target instances, automatically routing traffic away from failing targets."
                }
            ]
        }
    ]
}

def generate_ts():
    all_questions = []
    topics_by_module = {}
    
    for module_name, topics_list in modules_data.items():
        topics_by_module[module_name] = []
        for topic_obj in topics_list:
            t_name = topic_obj["topic"]
            topics_by_module[module_name].append(t_name)
            for q in topic_obj["questions"]:
                q_copy = dict(q)
                q_copy["module"] = module_name
                q_copy["topic"] = t_name
                all_questions.append(q_copy)
                
    modules_list = list(modules_data.keys())
    
    code = f'''// AWS re/Start Knowledge Check (KC) Question Database
// Strict TypeScript interface and curated realistic practice questions

export interface Question {{
  id: string;
  module: string;
  topic: string; // Exact KC assignment title
  question: string;
  options: string[]; // 4 choices
  correctAnswer: number; // index 0-3
  explanation: string;
}}

export const MODULES: string[] = {json.dumps(modules_list, indent=2)};

export const TOPICS_BY_MODULE: Record<string, string[]> = {json.dumps(topics_by_module, indent=2)};

export const QUESTIONS: Question[] = {json.dumps(all_questions, indent=2)};

export function getAllTopics(): string[] {{
  const topics = new Set<string>();
  QUESTIONS.forEach((q) => topics.add(q.topic));
  return Array.from(topics);
}}

export function getQuestionsByModule(module: string): Question[] {{
  if (!module || module === "All Modules") return QUESTIONS;
  return QUESTIONS.filter((q) => q.module === module);
}}

export function getQuestionsByTopic(topic: string): Question[] {{
  if (!topic || topic === "All Topics") return QUESTIONS;
  return QUESTIONS.filter((q) => q.topic === topic);
}}

export function filterQuestions(module?: string, topic?: string): Question[] {{
  let list = QUESTIONS;
  if (module && module !== "All Modules") {{
    list = list.filter((q) => q.module === module);
  }}
  if (topic && topic !== "All Topics") {{
    list = list.filter((q) => q.topic === topic);
  }}
  return list;
}}

export function shuffleQuestions(questions: Question[]): Question[] {{
  const array = [...questions];
  for (let i = array.length - 1; i > 0; i--) {{
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }}
  return array;
}}
'''
    return code

ts_content = generate_ts()

# Write to src/data/kc-questions.ts
with open("src/data/kc-questions.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

# Write to data/kc-questions.ts for backward compatibility
with open("data/kc-questions.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated successfully! Total questions: {len(json.loads(json.dumps([q for m in modules_data.values() for t in m for q in t['questions']])))}")
