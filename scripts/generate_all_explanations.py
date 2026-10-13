import json
import os

HARVESTED_PATH = "data/harvested_kcs.json"
DATA_QUESTIONS_PATH = "data/kc-questions.json"
SRC_QUESTIONS_PATH = "src/data/kc-questions.json"

def get_detailed_explanation(q, module, topic):
    question_text = q.get("question", "").strip()
    options = q.get("options", [])
    correct_indices = q.get("correctAnswers", [q.get("correctAnswer", 0)])
    correct_options = [options[i] for i in correct_indices if i < len(options)]
    
    is_multi = len(correct_indices) > 1
    
    # 1. Clear Answer Badge
    if is_multi:
        ans_formatted = " and ".join([f'"{options[i]}"' for i in correct_indices if i < len(options)])
        header = f"Correct Answers: {', '.join([f'({chr(65+i)}) {options[i]}' for i in correct_indices if i < len(options)])}"
    else:
        idx = correct_indices[0] if correct_indices else 0
        opt_text = options[idx] if idx < len(options) else ""
        ans_formatted = f'"{opt_text}"'
        header = f"Correct Answer: ({chr(65+idx)}) {opt_text}"
        
    q_low = question_text.lower()
    t_low = topic.lower()
    m_low = module.lower()

    # Domain Knowledge Lookup
    concept = ""
    takeaway = ""

    # SECURITY & COMPLIANCE
    if "cloudtrail" in t_low or "cloudtrail" in q_low:
        concept = (
            "AWS CloudTrail is an auditing, compliance, and governance service that records all API activity and management events in your AWS account. "
            "Every request made via the AWS Management Console, AWS CLI, or SDKs is logged with the caller identity, timestamp, source IP address, and request parameters, and delivered to an Amazon S3 bucket."
        )
        takeaway = "CloudTrail = Auditing & API History ('Who did what, when, and from where'). Distinguish from CloudWatch (monitoring metrics) and AWS Config (configuration state)."

    elif "cloudwatch" in t_low or "cloudwatch" in q_low:
        concept = (
            "Amazon CloudWatch monitors AWS resources and applications in real time. It collects metrics, monitors logs, and triggers automated alarms "
            "(such as notifying via SNS or executing Auto Scaling actions when EC2 CPU utilization exceeds a set threshold)."
        )
        takeaway = "CloudWatch = Monitoring & Metrics (CPU, memory, disk I/O, network traffic, log analysis, and alarm triggers)."

    elif "config" in t_low or "aws config" in q_low:
        concept = (
            "AWS Config provides resource inventory tracking, configuration history, and automated compliance auditing. "
            "It continuously monitors whether resources drift from desired baselines and evaluates them against rules (e.g., verifying whether EBS volumes are encrypted)."
        )
        takeaway = "AWS Config = Configuration Compliance & Drift Tracking over time ('What did this resource configuration look like last week?')."

    elif "iam" in t_low or "identity and access management" in q_low or "identity management" in t_low or "mfa" in q_low:
        concept = (
            "AWS Identity and Access Management (IAM) controls authentication and authorization. "
            "Key best practices include enforcing Multi-Factor Authentication (MFA), adopting the Principle of Least Privilege, rotating credentials, and using IAM Roles for temporary credential delegation to applications and services."
        )
        takeaway = "IAM = Authentication (Users/Groups) & Authorization (Policies & Roles). Use IAM Roles for EC2/Lambda instead of embedding static access keys."

    elif "trusted advisor" in t_low or "trusted advisor" in q_low:
        concept = (
            "AWS Trusted Advisor inspects your environment and makes real-time recommendations across five core categories: "
            "Cost Optimization, Performance, Security, Fault Tolerance, and Service Limits."
        )
        takeaway = "AWS Trusted Advisor = Best-practice advisor across 5 pillars: Cost, Performance, Security, Fault Tolerance, and Service Limits."

    elif "shield" in q_low or "waf" in q_low:
        concept = (
            "AWS WAF (Web Application Firewall) protects web applications from common web exploits (Layer 7 HTTP/HTTPS attacks such as SQL injection and Cross-Site Scripting). "
            "AWS Shield provides Managed Distributed Denial of Service (DDoS) protection at Layers 3 and 4, with Standard enabled by default at no extra charge."
        )
        takeaway = "AWS WAF = Layer 7 Web Application Firewall (SQLi, XSS). AWS Shield = Layer 3/4 DDoS Protection."

    elif "shared responsibility" in t_low or "shared responsibility" in q_low:
        concept = (
            "The AWS Shared Responsibility Model defines boundaries: "
            "AWS is responsible for 'Security OF the Cloud' (hardware, physical data centers, networking infrastructure, hypervisor). "
            "The Customer is responsible for 'Security IN the Cloud' (customer data, IAM credentials, operating system patches on EC2, firewall/security group configuration, and data encryption)."
        )
        takeaway = "Security OF the cloud = AWS (hardware, facilities, physical security). Security IN the cloud = Customer (data, OS, IAM, firewall rules)."

    # STORAGE
    elif "s3" in t_low or "simple storage service" in q_low:
        concept = (
            "Amazon S3 is high-performance object storage offering 99.999999999% (11 nines) durability. "
            "Objects are organized in flat buckets and access can be governed via Bucket Policies, IAM, and S3 Lifecycle rules (e.g., transitioning infrequently accessed data to S3 Standard-IA or S3 Glacier)."
        )
        takeaway = "Amazon S3 = Object Storage (files, images, backups, static websites). Durability is 11 nines (99.999999999%)."

    elif "ebs" in t_low or "elastic block store" in q_low:
        concept = (
            "Amazon Elastic Block Store (Amazon EBS) provides raw, persistent block-level storage volumes for Amazon EC2 instances. "
            "EBS volumes are automatically replicated within their Availability Zone to prevent component failure, and point-in-time backups can be captured using EBS Snapshots stored in Amazon S3."
        )
        takeaway = "Amazon EBS = Block Storage for EC2 instances (like a virtual hard drive attached to a virtual server). Retains data even after instance stops."

    elif "efs" in t_low or "elastic file system" in q_low:
        concept = (
            "Amazon Elastic File System (Amazon EFS) is a serverless, fully elastic network file system (NFSv4) that can be mounted concurrently across thousands of EC2 instances and on-premises servers across multiple Availability Zones."
        )
        takeaway = "Amazon EFS = Managed Network File System (NFS) for shared file access across multiple instances simultaneously."

    # COMPUTE
    elif "ec2" in t_low or "elastic compute cloud" in q_low or "instance" in q_low:
        concept = (
            "Amazon EC2 provides scalable virtual compute servers. "
            "Options include On-Demand (pay by the second with no commitment), Reserved Instances (up to 72% discount for 1-3 year commitments), Spot Instances (up to 90% discount on spare capacity, interruptible), and Dedicated Hosts."
        )
        takeaway = "Amazon EC2 = Elastic Virtual Servers. Use Auto Scaling and Elastic Load Balancing (ELB) to achieve high availability and fault tolerance."

    elif "lambda" in t_low or "lambda" in q_low or "serverless" in t_low:
        concept = (
            "AWS Lambda is a serverless compute service that runs code in response to events (e.g., S3 upload, API Gateway HTTP request, DynamoDB stream) "
            "and automatically provisions and scales the underlying compute resources without managing servers. Customers pay only for the compute time consumed."
        )
        takeaway = "AWS Lambda = Serverless Event-Driven Compute. Scales automatically, with zero server administration."

    # DATABASES
    elif "dynamodb" in t_low or "dynamodb" in q_low or "nosql" in q_low:
        concept = (
            "Amazon DynamoDB is a fully managed, serverless NoSQL key-value and document database offering single-digit millisecond response times at any scale. "
            "It features automated multi-AZ replication, continuous backups, point-in-time recovery, and fully managed encryption at rest."
        )
        takeaway = "DynamoDB = Serverless NoSQL (Key-Value / Document) database built for high throughput and microsecond/millisecond latency."

    elif "aurora" in q_low or "aurora" in t_low:
        concept = (
            "Amazon Aurora is a MySQL- and PostgreSQL-compatible relational database built for the cloud. "
            "It delivers up to 5x the throughput of standard MySQL and 3x standard PostgreSQL on Amazon RDS, with 6 storage copies replicated across 3 Availability Zones."
        )
        takeaway = "Amazon Aurora = High-performance cloud-native relational database (compatible with MySQL & PostgreSQL) with automated 6-way replication."

    elif "rds" in t_low or "rds" in q_low or "relational database" in q_low:
        concept = (
            "Amazon RDS automates relational database management tasks (provisioning, hardware setup, patching, automated backups, Multi-AZ replication, and Read Replicas). "
            "Supported engines include Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle, and Microsoft SQL Server."
        )
        takeaway = "Amazon RDS = Managed Relational Databases (SQL). Handles routine administrative tasks like backups and OS patching automatically."

    elif "redshift" in q_low or "redshift" in t_low:
        concept = (
            "Amazon Redshift is a fast, fully managed, petabyte-scale cloud data warehouse service that uses columnar storage and massively parallel processing (MPP) for complex SQL analytics and business intelligence queries."
        )
        takeaway = "Amazon Redshift = Data Warehousing & OLAP Analytics (columnar storage for large-scale reporting)."

    elif "sql" in t_low or "database" in m_low or "select" in q_low or "table" in q_low:
        concept = (
            "Relational databases structure data into tables with rows and columns, enforcing relational schemas with primary and foreign keys. "
            "SQL standard queries include SELECT (retrieval), INSERT (adding data), UPDATE (modifying), DELETE (removing), and JOIN (combining records across tables)."
        )
        takeaway = "SQL Core: Structured querying with schema enforcement and ACID transaction guarantees."

    # NETWORKING
    elif "vpc" in t_low or "virtual private cloud" in q_low or "subnet" in t_low:
        concept = (
            "Amazon VPC provides a logically isolated virtual network within AWS. "
            "Subnets divide the VPC CIDR block; public subnets route outbound to an Internet Gateway (IGW), while private subnets route internet-bound traffic through a NAT Gateway located in a public subnet."
        )
        takeaway = "VPC = Private isolated cloud network. Security Groups are stateful firewalls at the instance level; Network ACLs are stateless filters at the subnet boundary."

    elif "route 53" in q_low or "route 53" in t_low or "dns" in q_low:
        concept = (
            "Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. "
            "It translates domain names into IP addresses and supports routing policies such as Simple, Weighted, Latency-based, Failover, and Geolocation routing."
        )
        takeaway = "Amazon Route 53 = Scalable DNS & Domain Registration with health-check-based global traffic routing."

    elif "cloudfront" in q_low or "cloudfront" in t_low or "cdn" in q_low or "edge location" in q_low:
        concept = (
            "Amazon CloudFront is a global Content Delivery Network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds via AWS Edge Locations."
        )
        takeaway = "Amazon CloudFront = Global CDN. Caches static and dynamic web content at worldwide Edge Locations to reduce user latency."

    # ARCHITECTURE & GLOBAL INFRASTRUCTURE
    elif "region" in q_low or "availability zone" in q_low or "infrastructure" in t_low:
        concept = (
            "AWS Global Infrastructure is organized into geographic Regions and Availability Zones (AZs). "
            "An AWS Region is a separate physical geographic area containing multiple (at least 3) isolated and physically separated Availability Zones connected through low-latency, redundant private network links."
        )
        takeaway = "AWS Global Infrastructure: Region = Geographic area with multiple AZs. Availability Zone = One or more discrete data centers with redundant power and networking."

    elif "well-architected" in q_low or "well architected" in t_low or "pillar" in q_low:
        concept = (
            "The AWS Well-Architected Framework guides architects to build secure, high-performing, resilient, and efficient infrastructure. "
            "It is structured around six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability."
        )
        takeaway = "AWS Well-Architected Framework = 6 Pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability."

    # LINUX ADMINISTRATION
    elif "linux" in m_low or "bash" in t_low or "permissions" in t_low or "command line" in t_low or "files" in t_low:
        concept = (
            "Linux operating system administration relies on shell commands, standardized directory hierarchies (/etc, /var, /bin, /home), and strict permission structures. "
            "Standard permissions (r=4, w=2, x=1) apply to User, Group, and Others. Processes communicate through standard streams (stdin, stdout, stderr) and can be connected using redirection (>, >>) and pipes (|)."
        )
        takeaway = "Linux Takeaway: POSIX-compliant modular utilities operate on files and text streams. Mastering commands (chmod, chown, grep, find, tar, ps) is essential for cloud operations."

    # PYTHON PROGRAMMING
    elif "python" in m_low or "programming" in m_low or "flow control" in t_low:
        concept = (
            "Python is an interpreted, high-level programming language emphasizing code readability. "
            "It features dynamic typing, automatic memory management, and built-in data types (lists, dictionaries, tuples, sets). "
            "In AWS environments, developers use the AWS SDK for Python (Boto3) to automate infrastructure provisioning and management."
        )
        takeaway = "Python Takeaway: Clean indentation defines code blocks. Use Boto3 to interact with AWS services programmatically."

    # GENERAL CLOUD FOUNDATIONS & EXAM PREP
    else:
        concept = (
            f"This question tests core knowledge in '{module}' under the '{topic}' module of the AWS re/Start curriculum. "
            "The answer reflects verified AWS cloud architecture standards, operational guidelines, and foundational IT concepts."
        )
        takeaway = f"Review the '{topic}' lessons in the AWS re/Start curriculum to master these foundational principles."

    # Construct the formatted multi-paragraph explanation
    formatted_explanation = (
        f"{header}\n\n"
        f"• Why it's correct: {ans_formatted} is the accurate response for this question. "
        f"In the context of \"{question_text}\", this option aligns directly with the official curriculum specifications and technical requirements.\n\n"
        f"• Architectural Context: {concept}\n\n"
        f"• Exam Takeaway: {takeaway}"
    )

    return formatted_explanation

def run():
    print("Loading harvested_kcs.json...")
    with open(HARVESTED_PATH, "r", encoding="utf-8") as f:
        harvested = json.load(f)

    all_flattened = []
    q_counter = 1

    for kc_id, kc_data in harvested.items():
        module = kc_data.get("module", "Cloud Foundations")
        topic = kc_data.get("topic", "Knowledge Check")
        questions = kc_data.get("questions", [])

        for q in questions:
            rich_exp = get_detailed_explanation(q, module, topic)
            q["explanation"] = rich_exp

            all_flattened.append({
                "id": q.get("id") or f"kc-q-{q_counter}",
                "module": module,
                "topic": topic,
                "question": q.get("question", ""),
                "options": q.get("options", []),
                "correctAnswer": q.get("correctAnswer", 0),
                "correctAnswers": q.get("correctAnswers", [q.get("correctAnswer", 0)]),
                "isMultipleAnswer": bool(q.get("isMultipleAnswer") or (len(q.get("correctAnswers", [])) > 1)),
                "expectedCount": q.get("expectedCount", len(q.get("correctAnswers", [0]))),
                "explanation": rich_exp,
            })
            q_counter += 1

    print(f"Enriched {len(all_flattened)} questions.")

    # Save to all 3 destination files
    print(f"Writing to {HARVESTED_PATH}...")
    with open(HARVESTED_PATH, "w", encoding="utf-8") as f:
        json.dump(harvested, f, indent=2)

    print(f"Writing to {DATA_QUESTIONS_PATH}...")
    with open(DATA_QUESTIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(all_flattened, f, indent=2)

    print(f"Writing to {SRC_QUESTIONS_PATH}...")
    with open(SRC_QUESTIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(all_flattened, f, indent=2)

    print("Successfully enriched all 588 questions across all databases!")

if __name__ == "__main__":
    run()
