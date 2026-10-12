# Rewards Tool - Admin Panel

Dự án Web Quản lý & Tạo mã bản quyền cho Rewards Tool.

## 🚀 Cách mở Admin Panel:
1. Bạn chỉ cần click đúp mở file index.html bằng trình duyệt (Chrome, Edge...) 
   hoặc chạy lệnh: 
px serve . trong thư mục này.
2. Lần đầu mở:
   - Bấm vào nút **\ Cài đặt API Key\** ở góc trên bên phải.
   - Nhập **Supabase Secret Key** (chuỗi sb_secret_... lấy từ Supabase: Project Settings -> API Keys -> Secret keys).
   - Bấm **\Lưu Cài Đặt\**. (Key này được lưu riêng tư trong trình duyệt của bạn).

## 🛠️ Các tính năng có sẵn:
- **Tạo Key Mới**:
  - Tự động sinh mã REW-VIP-XXXX-YYYY.
  - Chọn tên khách hàng & ghi chú giá tiền/kênh bán.
  - Cài đặt số Profile tối đa (mặc định 5).
  - Cài đặt Tổng lượt Runs (mặc định 150).
  - Chọn thời hạn: 7 ngày, 14 ngày, 30 ngày, 90 ngày, 1 năm, vĩnh viễn.
  - Bấm tạo -> Tự động copy mã Key để bạn gửi cho khách.
- **Quản lý danh sách**:
  - Tìm kiếm theo tên khách, mã key, HWID.
  - Lọc theo: Đang hoạt động, Hết hạn, Đã bị khóa.
  - Xem thanh tiến độ Runs đã dùng / Còn lại.
  - Xem ID máy tính (HWID) đã gắn.
- **Thao tác nhanh trên từng Key**:
  - 🔄 **Reset máy**: Xóa Hardware ID (cho phép khách chuyển sang máy tính khác khi cài lại Windows hoặc đổi máy).
  - ➕ **Cộng lượt / Gia hạn**: Cộng thêm runs hoặc cộng thêm ngày cho khách mua thêm.
  - 🔒 **Khóa / Mở khóa**: Tạm dừng quyền sử dụng của key.
  - 🗑️ **Xóa key**: Xóa vĩnh viễn khỏi cơ sở dữ liệu.
