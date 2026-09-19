import { ChatMessage } from '@scope-creep-ledger/shared';

/**
 * Regex Patterns for Common Communication Formats
 */

// Format 1: [01/03/2026, 09:15:22] Sender: Message or [10/09/2026, 14:10:22] Priya Sharma (Aura Retail): Message
const BRACKET_DATE_TIME_REGEX = /^\[(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]\s*([^:]+):\s*(.*)$/i;

// Format 2: 01/03/2026, 09:15 - Sender: Message or 01/03/2026, 9:15 AM - Sender: Message
const WHATSAPP_DASH_REGEX = /^(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\s*-\s*([^:]+):\s*(.*)$/i;

// Format 3: Sender (01/03/2026 09:15): Message
const SENDER_PAREN_REGEX = /^([^(]+)\s*\(([^)]+)\):\s*(.*)$/;

// Format 4: Slack format -> Sender [10:30 AM]: Message
const SLACK_SENDER_TIME_REGEX = /^([^:[\]\n\r]+?)\s*\[(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]:\s*(.*)$/i;

// Format 5: Video Call / Meeting transcript -> [00:02:15] Speaker: Message
const TRANSCRIPT_TIMESTAMP_REGEX = /^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/i;

// Format 6: Email Header -> From: Name <email> or From: Name
const EMAIL_FROM_REGEX = /^From:\s*([^<]+?)(?:\s*<.*>)?$/i;

// Format 7: Email Subject -> Subject: ...
const EMAIL_SUBJECT_REGEX = /^Subject:\s*(.*)$/i;

// Format 8: Numbered Deliverable List Item -> 1. New Feature / Ask
const NUMBERED_ITEM_REGEX = /^(\d+)\.\s+(.*)$/;

/**
 * Parses raw conversation logs, chat exports, transcripts, or email memos
 * into normalized ChatMessage objects.
 */
export function parseConversation(rawText: string): ChatMessage[] {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  const lines = rawText.split(/\r?\n/);
  const messages: ChatMessage[] = [];
  let currentMsg: ChatMessage | null = null;
  let messageCounter = 1;
  let currentEmailSender = 'Client';
  let inEmailBody = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // 1. Detect Email From Header
    const fromMatch = trimmedLine.match(EMAIL_FROM_REGEX);
    if (fromMatch) {
      currentEmailSender = fromMatch[1].trim();
      inEmailBody = true;
      continue;
    }

    // 2. Detect Email Subject Header
    const subjectMatch = trimmedLine.match(EMAIL_SUBJECT_REGEX);
    if (subjectMatch) {
      inEmailBody = true;
      continue;
    }

    // Skip generic email greetings/closings from becoming standalone messages if not useful
    if (/^(Hi |Hello |Hey |Dear |Best regards|Thanks|Sincerely|Regards)/i.test(trimmedLine) && inEmailBody) {
      continue;
    }

    // Match Format 1: [Date, Time] Sender: Content
    let match = trimmedLine.match(BRACKET_DATE_TIME_REGEX);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg_${String(messageCounter++).padStart(3, '0')}`,
        timestamp: match[1].trim(),
        sender: match[2].trim(),
        content: match[3].trim(),
      };
      inEmailBody = false;
      continue;
    }

    // Match Format 4: Slack -> Sender [10:30 AM]: Content
    match = trimmedLine.match(SLACK_SENDER_TIME_REGEX);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg_${String(messageCounter++).padStart(3, '0')}`,
        timestamp: match[2].trim(),
        sender: match[1].trim(),
        content: match[3].trim(),
      };
      inEmailBody = false;
      continue;
    }

    // Match Format 5: Call Transcript -> [00:02:15] Speaker: Content
    match = trimmedLine.match(TRANSCRIPT_TIMESTAMP_REGEX);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg_${String(messageCounter++).padStart(3, '0')}`,
        timestamp: match[1].trim(),
        sender: match[2].trim(),
        content: match[3].trim(),
      };
      inEmailBody = false;
      continue;
    }

    // Match Format 2: Date, Time - Sender: Content
    match = trimmedLine.match(WHATSAPP_DASH_REGEX);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg_${String(messageCounter++).padStart(3, '0')}`,
        timestamp: match[1].trim(),
        sender: match[2].trim(),
        content: match[3].trim(),
      };
      inEmailBody = false;
      continue;
    }

    // Match Format 3: Sender (Timestamp): Content
    match = trimmedLine.match(SENDER_PAREN_REGEX);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg_${String(messageCounter++).padStart(3, '0')}`,
        timestamp: match[2].trim(),
        sender: match[1].trim(),
        content: match[3].trim(),
      };
      inEmailBody = false;
      continue;
    }

    // Match Numbered List Item inside email or requirements memo -> 1. Deliverable ask
    const numMatch = trimmedLine.match(NUMBERED_ITEM_REGEX);
    if (numMatch && inEmailBody) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg_${String(messageCounter++).padStart(3, '0')}`,
        timestamp: `Req #${numMatch[1]}`,
        sender: currentEmailSender,
        content: numMatch[2].trim(),
      };
      continue;
    }

    // Continuation line
    if (currentMsg) {
      currentMsg.content += `\n${trimmedLine}`;
    } else {
      // First line if no headers matched
      currentMsg = {
        id: `msg_${String(messageCounter++).padStart(3, '0')}`,
        timestamp: 'Unknown Date',
        sender: inEmailBody ? currentEmailSender : 'User',
        content: trimmedLine,
      };
    }
  }

  if (currentMsg) {
    messages.push(currentMsg);
  }

  return messages;
}
