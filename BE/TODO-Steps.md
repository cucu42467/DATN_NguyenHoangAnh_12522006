# BE Compilation Fix - Approved Plan Steps

## Current Progress from BE/TODO.md
1. [x] Add SortBy/SortDir to LocGiaoDichDto
2. [x] Fix TongQuanController.cs DateTime parsing
3. [x] Fix XacThucController.cs: PienOtpId → PhienOtpId
4. [x] Add missing methods to IXacThucBll.cs
5. [ ] **Implement missing methods in XacThucBll.cs (stubs)**
6. [ ] **Build project to verify (msbuild)**
7. [ ] Fix style warnings
8. [ ] Update GiaoDichBll/Dal for sorting
9. [ ] Test APIs

## Detailed Breakdown
### Step 5: XacThucBll.cs Stubs
- LamMoiTokenAsync
- DangXuatAsync  
- QuenMatKhauEmailAsync / QuenMatKhauSdtAsync
- XacThucOtpAsync
- DatLaiMatKhauAsync
- Add error handling / logging

### Step 6: Build & Verify
```
cd BE/BE & msbuild BE.sln /p:Configuration=Debug /v:minimal
```

### Next: Warnings & FE Integration
- Fix unused 'ex' in NguoiDungSocialDal.cs
- Null checks in Program.cs
- Progress FE/TODO-FE.md (Admin API connections)

**Track progress by updating [ ] → [x] after each step.**

