# Database Schema

```mermaid
erDiagram

User {
  String id PK
  String email UK
  String passwordHash
  String name
  Role role  // BUYER | SUPPLIER
  DateTime createdAt
}

RFP {
  String id PK
  String title
  String description
  DateTime dueDate
  String status        // DRAFT | PUBLISHED | RESPONSE_SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED
  String attachmentKey
  Int version
  String buyerId FK
  DateTime createdAt
  DateTime updatedAt
}

RFPVersion {
  String id PK
  String rfpId FK
  Int version
  String title
  String description
  String attachmentKey
  DateTime createdAt
}

Response {
  String id PK
  String rfpId FK
  String supplierId FK
  String message
  String attachmentKey
  String status   // SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED
  DateTime createdAt
  DateTime updatedAt
}
```
Indexes: `User.email` unique; `RFP(buyerId)`; `Response(rfpId, supplierId)`; Full‑text index on RFP(title + description).
