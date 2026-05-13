# TODO - FE Optimization Rollout

## Phase 1 - Foundation (Done)
- [x] Add React Query client/provider
- [x] Add query keys
- [x] Integrate QueryProvider in app layout
- [x] Add initial query hooks (giao dich, danh muc)
- [x] Add initial Zustand store for giao dich filter

## Phase 2 - GiaoDich refactor + lint/runtime validation
- [x] Run scoped lint and collect issues for impacted files
- [ ] Refactor `app/(user)/GiaoDich/page.tsx` to use query hooks instead of `useEffect + taiDuLieu`
- [ ] Remove `any` in `tinh_nang/giaodich/thanh_phan/BangLichSu.tsx`
- [ ] Re-run scoped lint for impacted files
- [ ] Run runtime test flow for GiaoDich module:
  - [ ] list -> edit/detail -> back
  - [ ] filter + pagination
  - [ ] cache behavior (no unnecessary refetch)
  - [ ] scroll/state persistence

## Phase 3 - UX optimization
- [ ] Add prefetch detail flow
- [ ] Add scroll restoration hook/store integration
- [ ] Keep filter/search/tab state across back navigation

## Phase 4 - Expand to other modules
- [ ] Apply same query/store pattern to DanhMuc and Admin dashboard
- [ ] Validate performance and cache consistency
