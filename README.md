# ALXO — Scope Creep Ledger & Change Order Generator

<div align="center">

<img src="arixen_logo.png" alt="Team Arixen Logo" width="220" />
<br />
<img src="alxo_logo.png" alt="ALXO Logo" width="450" />

### *"Catch the work hiding between the lines."*

**Built by Team Arixen**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-Deployed-FF9900?style=for-the-badge&logo=amazonaws)](https://master.d2ctutlbtt1yhj.amplifyapp.com/)
[![Amazon Bedrock](https://img.shields.io/badge/Amazon_Bedrock-Claude_3-232F3E?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/bedrock/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_25/25_Passing-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)

[**🚀 Launch Live Demo**](https://master.d2ctutlbtt1yhj.amplifyapp.com/) • [**🔑 Demo Credentials**](docs/DEMO_CREDENTIALS.md) • [**🧪 15 Benchmark Test Cases**](apps/web/public/test-cases/)

</div>

---

## 👥 Team Arixen — Credits & Roles

ALXO is designed and engineered by **Team Arixen**.

| Member Name | Role & Responsibilities | GitHub Handle | Contact Email |
| :--- | :--- | :--- | :--- |
| **Ilakkiyan J** | **Team Lead & Sole Backend Engineer**<br>*(Architecture, API Specs, AWS Persistence, Bedrock Engine, E2E Suite)* | [@ilakkiyan-j](https://github.com/ilakkiyan-j) | `ilakkiyanj03@gmail.com` |
| **Manikandan E** | **Frontend Developer**<br>*(Glassmorphic UI Components, Currency Engine, React State)* | [@Manikandan-e56](https://github.com/Manikandan-e56) | `emanigandan58@gmail.com` |
| **Anshika P** | **QA Docs & UI Design Support**<br>*(Product Specifications, User Stories, UI Layout Support)* | [@anishka-009](https://github.com/anishka-009) | `anshikapal9450@gmail.com` |

---

## 🌟 Overview

**ALXO** is an enterprise-grade SaaS platform built for agencies, software consultants, and freelancers to eliminate unbilled work. By continuously parsing client communication channels (email exports, Slack threads, WhatsApp logs), ALXO automatically detects scope creep using **Amazon Bedrock Claude 3**, logs line-item items into an authoritative **Scope Creep Ledger**, and generates legally binding, deterministic **Change Orders** with zero manual friction.

---

## 🚀 Live Demo & Judge Credentials

The application is fully deployed and accessible live on **AWS Amplify Cloud Infrastructure**.

- **Live URL**: [https://master.d2ctutlbtt1yhj.amplifyapp.com/](https://master.d2ctutlbtt1yhj.amplifyapp.com/)

### Pre-Seeded Judge Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Demo Account** | `demo@scopecreep.io` | `Demo123!` | Full workspace, ledger analysis, change order export |
| **Admin Account** | `admin@scopecreep.io` | `Admin123!` | User management, system metrics, deployment status |
| **Provisioned User** | `jordan@designstudio.com` | `Jordan123!` | Standard project workspace access |

> *Note: One-click fast authentication buttons are available on the live Sign-In page for instant evaluator access.*

---

## ✨ Key Features

1. **AI Scope Creep Classifier**:
   - Analyzes raw client conversation threads (`.txt`, `.csv`, `.json`).
   - Powered by **Amazon Bedrock Claude 3 Haiku** with strict confidence scoring (`CONFIDENCE_THRESHOLD = 0.70`).
   - Categorizes out-of-scope requests, extra deliverables, and design revisions.

2. **Authoritative Scope Creep Ledger**:
   - Real-time tabular tracking of scope additions across all projects.
   - Line-item cost estimates, status tracking (`PENDING`, `APPROVED`, `REJECTED`), and audit trails.

3. **Deterministic Change Order Generator**:
   - Generates formal PDF/digital Change Orders complete with project baselines, revised scope breakdown, timeline adjustments, and total price impact.

4. **Multi-Currency Engine**:
   - Instant localization across major global currencies: **USD ($)**, **EUR (€)**, **GBP (£)**, **CAD ($)**, **AUD ($)**, **JPY (¥)**, and **INR (₹)**.

5. **3D Glassmorphic Interface**:
   - Modern dark-mode UI powered by CSS glassmorphism, fluid micro-interactions, responsive design, and dynamic financial charts.

6. **AWS Cloud Diagnostics Console**:
   - Live system health monitoring across 6 AWS services: **Cognito**, **Amplify**, **S3**, **DynamoDB**, **Lambda**, and **Bedrock**.

---

## 🧪 15 Real-World Test Cases Benchmark Suite

ALXO includes a pre-packaged suite of 15 comprehensive real-world client communication scenarios located in [`apps/web/public/test-cases/`](apps/web/public/test-cases/).

| # | Scenario Title | Domain | Test Conversation File |
| :--- | :--- | :--- | :--- |
| **01** | E-Commerce Mobile App Scope Creep | Mobile Development | `01-mobile-app/` |
| **02** | Brand Identity & Motion Design | Creative Design | `02-brand-identity/` |
| **03** | Cloud Migration & DevOps Pipeline | Infrastructure | `03-cloud-migration/` |
| **04** | SaaS Billing Engine Integration | Fintech | `04-saas-billing/` |
| **05** | Custom CRM Data Pipelines | Enterprise Software | `05-custom-crm/` |
| **06** | Healthcare Portal HIPAA Compliance | Healthcare IT | `06-healthcare-portal/` |
| **07** | Real Estate Listing 3D Virtual Tours | PropTech | `07-real-estate-3d/` |
| **08** | AI Chatbot Customer Support Workflow | Conversational AI | `08-ai-chatbot/` |
| **09** | EdTech Learning Management System | EdTech | `09-edtech-lms/` |
| **10** | Logistics Fleet Management System | Logistics / IoT | `10-fleet-logistics/` |
| **11** | Cyber Security Penetration Testing | Security | `11-cyber-security/` |
| **12** | Event Ticketing Web Application | Ticketing / SaaS | `12-event-ticketing/` |
| **13** | HR Payroll Integration Pipeline | Enterprise HR | `13-hr-payroll/` |
| **14** | Gaming Community Dashboard | Web3 / Gaming | `14-gaming-community/` |
| **15** | Restaurant Point-of-Sale Ecosystem | Retail POS | `15-restaurant-pos/` |

---

## 🏗️ System Architecture & AWS Infrastructure

```
                   +----------------------------------+
                   |       User Browser / Client      |
                   +----------------------------------+
                                     |
                                     v
                   +----------------------------------+
                   |        AWS Amplify Cloud         |
                   |   Next.js 14 Web & API Router    |
                   +----------------------------------+
                                     |
       +-----------------------------+-----------------------------+
       |                             |                             |
       v                             v                             v
+--------------+              +--------------+              +--------------+
| Amazon S3    |              | DynamoDB     |              | Amazon       |
| Raw Files &  |              | Projects &   |              | Bedrock      |
| Exports      |              | Ledger Items |              | Claude 3     |
+--------------+              +--------------+              +--------------+
```

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- Node.js `18.x` or `20.x`
- npm `9.x`+

### Setup Instructions

```bash
# 1. Clone Repository
git clone https://github.com/ilakkiyan-j/ScopeCreepDetector.git
cd ScopeCreepDetector

# 2. Install Workspace Dependencies
npm install

# 3. Launch Development Server
npm run dev
# Next.js web application will be accessible at http://localhost:3000
```

### Running Automated Test Suite

ALXO includes a complete Playwright E2E test suite with **25 passing tests**.

```bash
# Run End-to-End Playwright Tests
npx playwright test
```

---

## 📄 License & Attribution

Designed & Developed for Hackathon Presentation by **Team Arixen**. All rights reserved.
