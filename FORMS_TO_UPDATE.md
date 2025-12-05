# Forms Cần Cập Nhật - React Hook Form & Yup

## 📋 Danh sách các form còn chưa sử dụng react-hook-form và yup

### 1. ✅ Đã cập nhật
- ✅ `components/auth/LoginPage.tsx` - Đã sử dụng react-hook-form và yup
- ✅ `components/widget/DynamicForm.tsx` - Đã sử dụng react-hook-form và yup
- ✅ `components/widget/DynamicFormField.tsx` - Đã sử dụng react-hook-form và yup

### 2. ✅ Đã cập nhật

#### 2.1. ✅ WidgetBundleForm.tsx
**File:** `src/components/widget-bundle/WidgetBundleForm.tsx`
**Vấn đề:**
- Sử dụng `useState` cho form state
- Sử dụng `TextField` thay vì `OutlinedInput`
- Không có validation schema
- Manual validation với `error={!formData.title}`

**Cần cập nhật:**
- Thay `useState` bằng `useForm` từ react-hook-form
- Tạo Yup schema cho validation (title, alias required)
- Thay `TextField` bằng `OutlinedInput` với `FormControl`
- Sử dụng `Controller` cho các fields

#### 2.2. ✅ DashboardStatesDialog.tsx
**File:** `src/components/dashboard/DashboardStatesDialog.tsx`
**Vấn đề:**
- Sử dụng `useState` cho form state (`stateName`, `isRoot`)
- Sử dụng `TextField` thay vì `OutlinedInput`
- Không có validation

**Cần cập nhật:**
- Thay `useState` bằng `useForm`
- Tạo Yup schema (stateName required)
- Thay `TextField` bằng `OutlinedInput`

#### 2.3. ✅ EntityAliasesDialog.tsx
**File:** `src/components/dashboard/EntityAliasesDialog.tsx`
**Vấn đề:**
- Sử dụng `useState` cho form state (`aliasName`, `filterType`, `resolveMultiple`)
- Sử dụng `TextField` thay vì `OutlinedInput`
- Có validation service nhưng không tích hợp với form

**Cần cập nhật:**
- Thay `useState` bằng `useForm`
- Tạo Yup schema (aliasName required, filterType required)
- Thay `TextField` bằng `OutlinedInput`
- Tích hợp validation service với Yup schema

#### 2.4. ✅ TimewindowDialog.tsx
**File:** `src/components/dashboard/TimewindowDialog.tsx`
**Vấn đề:**
- Sử dụng `useState` cho nhiều fields (`mode`, `realtimeMs`, `historyMs`, `intervalMs`, `aggregationType`, `limit`)
- Sử dụng `TextField` thay vì `OutlinedInput`
- Không có validation cho number fields

**Cần cập nhật:**
- Thay `useState` bằng `useForm`
- Tạo Yup schema với conditional validation (realtime vs history mode)
- Number validation (min > 0)
- Thay `TextField` bằng `OutlinedInput`

#### 2.5. ✅ FiltersDialog.tsx
**File:** `src/components/dashboard/FiltersDialog.tsx`
**Vấn đề:**
- Sử dụng `useState` cho form state (`filterType`)
- Sử dụng `TextField` thay vì `OutlinedInput`
- Không có validation

**Cần cập nhật:**
- Thay `useState` bằng `useForm`
- Tạo Yup schema (filterType required)
- Thay `TextField` bằng `OutlinedInput`

## 📝 Template cho việc cập nhật

### Bước 1: Import dependencies
```typescript
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
```

### Bước 2: Tạo validation schema
```typescript
const formSchema = yup.object({
  fieldName: yup.string().required('Field is required'),
  numberField: yup.number().min(1, 'Must be greater than 0').required(),
});
```

### Bước 3: Setup form
```typescript
const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(formSchema),
  defaultValues: { fieldName: '', numberField: 0 },
});
```

### Bước 4: Thay TextField bằng OutlinedInput
```typescript
<Controller
  name="fieldName"
  control={control}
  render={({ field }) => (
    <FormControl fullWidth required error={!!errors.fieldName}>
      <InputLabel>Field Name</InputLabel>
      <OutlinedInput {...field} label="Field Name" />
      {errors.fieldName && (
        <FormHelperText>{errors.fieldName.message}</FormHelperText>
      )}
    </FormControl>
  )}
/>
```

## 🎯 Ưu tiên cập nhật

1. **WidgetBundleForm.tsx** - Form quan trọng, có nhiều fields
2. **TimewindowDialog.tsx** - Form phức tạp với conditional validation
3. **EntityAliasesDialog.tsx** - Có validation service cần tích hợp
4. **DashboardStatesDialog.tsx** - Form đơn giản
5. **FiltersDialog.tsx** - Form đơn giản nhất

## ✅ Lợi ích sau khi cập nhật

- ✅ Type safety với TypeScript
- ✅ Automatic validation với error messages
- ✅ Better performance (chỉ re-render khi cần)
- ✅ Consistent form handling pattern
- ✅ Easier to maintain và extend
- ✅ Better UX với real-time validation

