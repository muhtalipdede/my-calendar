# Sprint 5 — Süreçli Görevler (Workflow)

> **Hedef:** Multi-step workflow CRUD, adım tamamlama, not ekleme ve otomatik ilerleme.

Bu sprint ürünün **fark yaratan özelliğini** tamamladı: görevler artık tek adımlı değil, aşamalı süreç olarak yönetilebiliyor.

---

## 1. Workflow Nedir?

Klasik todo: "Şirkete başvur" → tek checkbox.

My Calendar workflow:

```
1. Online başvuru      ✅
2. CV gönderimi        🔄
3. Mülakat             ⏳
4. Sonuç               ⏳
```

Her adım (step) bağımsız durum, tarih ve not alır.

---

## 2. Yeni Bileşenler

```
src/components/workflows/
├── WorkflowCard.tsx    ← liste kartı
├── WorkflowForm.tsx    ← oluştur/düzenle (dinamik adımlar)
├── StepItem.tsx        ← tek adım (checkbox, not, devam et)
└── StepList.tsx        ← sıralı adım listesi

src/lib/utils/workflow.ts  ← status türetme, step güncelleme
```

---

## 3. AppProvider — Workflow CRUD

| Fonksiyon | Ne yapar? |
|-----------|-----------|
| `addWorkflow` | Yeni süreç + adımlar |
| `updateWorkflow` | Başlık, açıklama, adım listesi |
| `deleteWorkflow` | Süreci sil |
| `updateStep` | Tek adımı güncelle (status, notes) |

`useWorkflows()` hook'u bu fonksiyonları expose eder.

---

## 4. Step Güncelleme Mantığı

`applyStepUpdate()` — `src/lib/utils/workflow.ts`:

```typescript
// Step completed → completedAt kaydet
// Tüm adımlar completed/skipped → workflow status: "completed"
const status = deriveWorkflowStatus(steps);
```

**Otomatik tamamlama:** Son adım işaretlenince workflow `completed` olur ve `completedAt` atanır.

---

## 5. WorkflowForm — Dinamik Adımlar

- Minimum **2 adım** zorunlu
- Her adım: başlık* + opsiyonel due date
- `+ Adım` ile ekle, `Sil` ile çıkar (min 2 kalır)
- Düzenlemede aynı sıradaki aynı başlıklı adımların id/status/notes korunur

---

## 6. StepItem Etkileşimleri

| Aksiyon | Sonuç |
|---------|-------|
| Checkbox | `completed` ↔ `in_progress` toggle |
| Devam et | `status: "in_progress"` |
| Not ekle | Textarea aç/kapa |
| Notu kaydet | `updateStep(id, { notes })` |

Gecikmiş adımlar kırmızı arka planla vurgulanır (`isOverdue`).

---

## 7. Süreçler Sayfası

`/workflows`:
- Filtre: Tümü / Aktif / Tamamlanmış
- Grid layout ile `WorkflowCard`
- `+ Yeni Süreç` butonu
- Karttan veya düzenle ile `WorkflowForm`
- Silme: `ConfirmDialog`

---

## 8. Detay Sayfası

`/workflows/[id]`:
- İlerleme çubuğu
- `StepList` ile tüm adımlar
- Canlı state — adım tamamlanınca dashboard da güncellenir

---

## 9. Test Senaryoları

1. **Yeni süreç** — 2+ adım ile oluştur
2. **Adım tamamla** — checkbox ile; ilerleme çubuğu güncellenmeli
3. **Not ekle** — kaydet, sayfayı yenilemeden görünmeli
4. **Tüm adımları tamamla** — workflow "Tamamlandı" olmalı
5. **Filtre** — sadece aktif süreçleri göster
6. **Gecikmiş adım** — `wf-001` step-002 kırmızı vurgulu
7. **Dashboard** — ActiveWorkflows güncel ilerleme göstermeli
8. **Sil** — onay sonrası listeden kaybolmalı

---

## 10. Kontrol Listesi

- [x] WorkflowCard bileşeni
- [x] StepItem (checkbox, not, overdue, devam et)
- [x] StepList
- [x] WorkflowForm (dinamik adımlar, min 2)
- [x] Süreç listesi + aktif/tamamlanmış filtre
- [x] Detay sayfası + step yönetimi
- [x] Tüm adımlar bitince workflow → completed
- [x] Dashboard canlı state

---

## Sonraki Adım

→ [`docs/03-INTERN-TASKS.md`](../03-INTERN-TASKS.md) — **Sprint 6: Hatırlatmalar**
