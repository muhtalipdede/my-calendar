# My Calendar — Cursor Agent Rehberi

Bu dosya, bu projede çalışan AI agent'lar için bağlam sağlar.

## Proje Özeti

**My Calendar** — takvim, görev ve multi-step workflow yönetimi. Mock JSON veri; production backend yok. Stajyer devrine hazırlanmış sprint bazlı yapı.

## Hızlı Başlangıç

```bash
npm install && npm run dev   # http://localhost:3000
npm run build && npm run lint
```

## Güncel Durum

| Sprint | Konu | Durum |
|--------|------|-------|
| 0–5 | Kurulum, mock, dashboard, görev, takvim, workflow | ✅ |
| **6** | Hatırlatmalar CRUD | 🔜 Sıradaki |
| 7 | Cilalama + MVP | ⏳ |
| 7 | Cilalama + MVP | ⏳ |

**MVP:** ~84% (46/55) — `docs/04-MVP-CHECKLIST.md`

## Agent için kritik dosyalar

| Amaç | Dosya |
|------|-------|
| Aktif görevler | `docs/03-INTERN-TASKS.md` |
| Biten sprint rehberleri | `docs/completed/README.md` |
| Veri şemaları | `docs/02-MOCK-DATA.md` |
| Mimari | `docs/01-ARCHITECTURE.md` |
| Global state | `src/providers/AppProvider.tsx` |
| Cursor kuralları | `.cursor/rules/*.mdc` |

## "Devam et" dediğinde

1. `docs/03-INTERN-TASKS.md` → sıradaki sprint'i uygula
2. Mevcut pattern'i takip et (`tasks/`, `calendar/` modülleri referans)
3. `npm run build` + `npm run lint` doğrula
4. Dokümantasyonu güncelle:
   - `docs/completed/sprint-N-*.md` (öğrenci rehberi)
   - `docs/03-INTERN-TASKS.md`, `04-MVP-CHECKLIST.md`, `README.md`, `01-ARCHITECTURE.md`
   - `.cursor/rules/project-conventions.mdc` sprint durumu

## Tamamlanan modüller

- **Dashboard** — `src/components/dashboard/`, `src/app/page.tsx`
- **Görevler** — CRUD: `src/components/tasks/`, `useTasks`
- **Takvim** — FullCalendar CRUD: `src/components/calendar/`, `useEvents`
- **Workflow** — CRUD + step yönetimi: `src/components/workflows/`, `useWorkflows`
- **Hatırlatmalar** — read-only liste; Sprint 6'da CRUD gelecek

## Yapma

- Backend/API/database ekleme (MVP scope dışı)
- Mock veriyi component içinde hardcode etme
- Sprint dokümantasyonunu atlama
- İngilizce UI metinleri (Türkçe kullan)

## Ürün farkı

Workflow sistemi — görevler tek adım değil, aşamalı süreç olabilir. Step bazlı due date, not ve reminder desteklenmeli.
