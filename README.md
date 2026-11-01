# Kotoba — Học tiếng Nhật N4

Mini web học tiếng Nhật dạng tĩnh, tách riêng giao diện, mã ứng dụng và dữ liệu JSON.

## Chạy trên máy

Mở terminal trong thư mục này và chạy:

```powershell
python -m http.server 8000
```

Sau đó mở http://localhost:8000. Cần dùng máy chủ HTTP để trình duyệt tải được các tệp JSON.

## Cấu trúc

- `index.html`: khung trang
- `assets/styles.css`: giao diện
- `assets/app.js`: hành vi ứng dụng
- `data/kanji.json`: chữ Hán và danh sách unit
- `data/vocabulary.json`: từ vựng và danh sách bài
- `data/grammar.json`: ngữ pháp
- `data/exam.json`: câu hỏi luyện đề

Dữ liệu JSON được tách từ phiên bản HTML được cung cấp; nội dung từ vựng bổ sung đã được gộp vào danh sách từ vựng.
