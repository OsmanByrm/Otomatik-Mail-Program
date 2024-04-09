function main() {
  // Google Sheet'e erişim sağlanıyor
  var wb = SpreadsheetApp.getActiveSpreadsheet();

  // Verilerin bulunduğu sayfaya erişim sağlanıyor
  var sheet = wb.getSheetByName('Summary');

  // Veriler bir değişkende saklanıyor
  var data = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  
  // Geçerli tarih ve saat alınıyor
  var today = new Date();
  
  // E-postanın gönderileceği hedef zaman belirleniyor (Türkiye saatiyle ayarlardan uluşabilirsiniz)
  var targetDate = new Date();
  targetDate.setHours(15, 35, 0, 0); // Saati 'e ayarla
  targetDate.setMinutes(35); // Dakikaları 0'a ayarla
  targetDate.setSeconds(0); // Saniyeleri 0'a ayarla
  targetDate.setMilliseconds(0); // Milisaniyeleri 0'a ayarla
  
  // Eğer mevcut zaman hedef zamandan sonra ise, e-postayı bir sonraki güne planla
  if (today.getTime() >= targetDate.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  
  // E-postayı hedef zamanda göndermek için tetikleyici ayarlanıyor
  ScriptApp.newTrigger('sendEmail')
    .timeBased()
    .at(targetDate)
    .create();
}

function sendEmail() {
  // Google Sheet'e erişim sağlanıyor
  var wb = SpreadsheetApp.getActiveSpreadsheet();

  // Verilerin bulunduğu sayfaya erişim sağlanıyor
  var sheet = wb.getSheetByName('Summary');

  // Veriler bir değişkende saklanıyor
  var data = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();

  // Veri noktaları tanımlanıyor
  var Tarih = data[2][0];
  var Veri1Gece = data[2][1];
  var Veri1Gunduz  = data[2][2];
  var Veri2Gece  = data[2][3];
  var Veri2Gunduz = data[2][4];
  var Veri3Gece  = data[2][5];
  var Veri3Gunduz  = data[2][6];
  var Veri4 = data[2][7];
  var Not  = data[2][8];
  var TeslimAlan  = data[2][9];
  var TeslimatiOnayVeren  = data[2][11];

  // E-posta listesi
  var listPpl = ['mail@mail.com'];

  // HTML dinamik olarak oluşturmak için şablon nesnesi oluşturuluyor
  var htmlTemplate = HtmlService.createTemplateFromFile('email');

  // HTML değişkenleri tanımlanıyor
  htmlTemplate.Tarih = Tarih;
  htmlTemplate.Veri1Gece = Veri1Gece;
  htmlTemplate.Veri1Gunduz = Veri1Gunduz;
  htmlTemplate.Veri2Gece = Veri2Gece;
  htmlTemplate.Veri2Gunduz = Veri2Gunduz;
  htmlTemplate.Veri3Gece = Veri3Gece;
  htmlTemplate.Veri3Gunduz = Veri3Gunduz;
  htmlTemplate.Veri4 = Veri4;
  htmlTemplate.Not = Not;
  htmlTemplate.TeslimAlan = TeslimAlan;
  htmlTemplate.TeslimatiOnayVeren = TeslimatiOnayVeren;

 
  // Şablonu değerlendir ve bir HTML çıktı nesnesi döndür
  var htmlForEmail = htmlTemplate.evaluate().getContent();

  // E-postayı gönder
  GmailApp.sendEmail(
    listPpl,
    'Gunluk Tablo ' + Tarih,
    'Bu e-posta HTML içerir',
    { htmlBody: htmlForEmail }
  );
}
