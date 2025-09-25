<?php
// Cek apakah request menggunakan metode POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo "Metode tidak diizinkan.";
  exit;
}

// Ambil data dari form
$name    = $_POST['name'] ?? '';
$email   = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';

// Validasi input
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
  http_response_code(400);
  echo "Semua field wajib diisi.";
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo "Format email tidak valid.";
  exit;
}

// Tujuan email
$to = "helmi.lf123@gmail.com";

// Susun isi email
$email_content = "Nama: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Subjek: $subject\n";
$email_content .= "Pesan:\n$message\n";

// Header email
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";

// Kirim email
if (mail($to, $subject, $email_content, $headers)) {
  echo "OK";
} else {
  http_response_code(500);
  echo "Gagal mengirim pesan. Silakan coba lagi.";
}
?>
