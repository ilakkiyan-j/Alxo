# ALXO — Multi-Channel Enterprise Test Case

This directory contains a complete simulation of a real-world client workflow across **Contract SOW**, **Slack**, **WhatsApp**, and **Gmail**, including items with **confidence < 0.70** to demonstrate human-in-the-loop verification.

---

## 📁 `demo-ecommerce-storefront/` Files:

| File | Channel | Features & Scope Detection |
|---|---|---|
| **`01-contract-baseline-sow.txt`** | **Signed SOW** | 4 responsive pages, Razorpay checkout, 1 revision round, ₹2,500/hr, explicit exclusions. |
| **`02-slack-channel-feed.txt`** | **Slack** | Loyalty rewards portal (4.5h), 360-degree rotation canvas (3h), GA4/Meta CAPI webhooks (2.5h), and **Product Detail grid variation exploration (1.5h, confidence: 0.64 ➡️ `review_required`)**. |
| **`03-whatsapp-urgent-asks.txt`** | **WhatsApp** | Dark Mode theme & vectors (2h), Mobile App REST API endpoints (3.5h), and **Hero banner parallax motion exploration (1.5h, confidence: 0.64 ➡️ `review_required`)**. |
| **`04-gmail-executive-demands.txt`** | **Gmail** | Executive memo demanding 2-way SAP S/4HANA live sync (8h) and Multi-Currency FX auto-conversion (3h). |
| **`project-details.json`** | **Metadata** | Complete scenario breakdown and expected unbilled cost recovery (~₹73,750 / 29.5 hrs). |

---

## 🎬 How to Demonstrate Human-in-the-Loop Review During Recording:

1. In the Alxo UI, create a project with **₹2,500/hr** and paste `01-contract-baseline-sow.txt`.
2. Stage and upload `02-slack-channel-feed.txt` and `03-whatsapp-urgent-asks.txt`.
3. Click **"Analyze Scope & Generate Ledger"**.
4. Point out the item flagged as **`review_required`** with confidence **0.64** (*"Could we potentially explore grid layout variations...?"*).
5. Click **"Verify"** to show how the system immediately recalculates the unbilled ledger totals deterministically!
