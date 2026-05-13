# BE Compilation Errors Fix Plan

## Steps:
1. [x] Add SortBy/SortDir to LocGiaoDichDto in DTO/GiaoDichDto.cs
2. [x] Fix TongQuanController.cs: Use DateTime for TuNgay/DenNgay instead of strings
3. [x] Fix XacThucController.cs: PienOtpId → PhienOtpId
4. [x] Add missing methods to IXacThucBll.cs interface
5. [x] Implement missing methods in XacThucBll.cs (stubs - all methods now have working impls)
6. [x] Build project to verify (msbuild - SUCCESS with only minor warnings)
7. [x] Fix style warnings (unused var logged, null checks, deconstruction types)
8. [ ] Update GiaoDichBll/Dal for sorting support if needed
9. [ ] Test APIs

Current: Steps 1-7 complete. BE compiles cleanly. TyGiaController uses BLL (no direct DbSet issues). Next: sorting & tests.


